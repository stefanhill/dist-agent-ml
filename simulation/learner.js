function learner(options) {

    this.parameter = null;

    this.node = null;
    this.position = {};

    this.datastore = null;
    this.learners = [];

    this.target = 'party';
    this.features = ['gender', 'age', 'nationality', 'childhoodIn', 'religion', 'married', 'kids', 'education'];

    this.instance = null;
    this.currentModel = null;
    this.receivedModels = [];
    this.stop = false;

    this.tables = {
        learning: [],
        testing: []
    };

    this.accuracies = {
        current: [],
        process: []
    };
    this.predictions = {
        right: 0,
        wrong: 0
    };

    // -> [{agent: id, node: id}]
    this.getLearners = function () {
        let learners = net.ask('agents-learner', 10);
        return learners.length > 0 ? learners.filter(x => x.agent !== me()).map(function (x) {
            return {agent: x.agent, node: x.obj.node};
        }) : null;
    };

    // -> {agent: id, node: id}
    this.getDatastore = function () {
        let datastore = net.ask('agents-datastore', 2);
        return datastore.length > 0 ? {agent: datastore[0].agent, node: datastore[0].obj.node} : null;
    };

    // model -> [data] -> integer
    this.calculateAcc = function (model, testingData, feature) {
        let classificationResult = ml.classify(model, testingData),
            checkArray = testingData.map(e1 => {
                return e1[feature]
            }).map((e2, i) => {
                return e2 === classificationResult[i]
            }),
            counter = checkArray.reduce((n, e) => {
                return n + e
            }, 0);
        return counter / classificationResult.length;
    };

    this.act = {
        init: function () {
            let self = this;
            self.parameter = simu.model().parameter;
            self.node = myNode();

            net.setxy(self.position.x, self.position.y);
            self.learners = self.getLearners();
            self.datastore = self.getDatastore();
        },
        takeInstance: function () {
            let self = this;
            self.instance = null;
            try_inp(0, ['SURVEY', _], function (t1) {
                if (t1) {
                    self.instance = t1[1];
                } else {
                    try_inp(0, ['NO_DATA'], function (t2) {
                        if (t2) {
                            self.stop = true;
                        }
                    });
                    self.instance = null;
                }
            });
        },
        classifyInstance: function () {
            let self = this;
            if (self.instance != null) {
                let classificationResult = ml.classify(self.currentModel, self.instance);
                if (classificationResult === self.instance.party) {
                    self.predictions.right++;
                } else {
                    self.predictions.wrong++;
                }
                self.accuracies.process.push(self.predictions.right / (self.predictions.right + self.predictions.wrong));
                self.accuracies.current.push(self.calculateAcc(self.currentModel, self.tables.testing, self.target));
            }
        },
        addInstance: function () {
            let self = this;
            if (Math.random() < 0.5) {
                self.tables.learning.push(self.instance);
            } else {
                self.tables.testing.push(self.instance);
            }
        },
        makeModel: function () {
            let self = this,
                tempModel = ml.learn({
                    algorithm: ml.ML.ID3,
                    data: self.tables.learning,
                    target: self.target,
                    features: self.features
                });
            if (self.currentModel != null) {
                let accC = self.calculateAcc(self.currentModel, self.tables.testing, self.target),
                    accT = self.calculateAcc(tempModel, self.tables.testing, self.target);
                if (accT > accC) {
                    self.currentModel = tempModel;
                }
            } else {
                self.currentModel = tempModel;
            }
            for (let l in self.learners) {
                create('messenger', {
                    mode: 'model',
                    targetNode: self.learners[l].node,
                    message: self.currentModel
                }, 2);
            }
        },
        takeModels: function () {
            let self = this;
            self.receivedModels = [];
            try_inp(0, ['MODEL', _], function (tuples) {
                if (tuples)
                    self.receivedModels = map(tuples, function (tuple) {
                        return tuple[1]
                    })
            }, true);
        },
        compareModels: function () {
            let self = this,
                accC = self.calculateAcc(self.currentModel, self.tables.testing, self.target);
            for (let m in self.receivedModels) {
                let receivedModel = self.receivedModels[m],
                    accR = self.calculateAcc(receivedModel, self.tables.testing, self.target);
                if (accR > accC) {
                    self.currentModel = receivedModel;
                }
            }
        },
        wait: function () {
            let self = this;
            self.learners = self.getLearners();
            create('messenger', {
                mode: 'survey',
                targetNode: self.datastore.node,
                homeNode: myNode()
            }, 2);
            sleep(7 * self.parameter.const.sleep);
        },
        fini: function () {
            let self = this;
            log(ml.print(self.currentModel));
            log('');
        },
        finiLoop: function () {
            let self = this;
            sleep(100 * self.parameter.const.sleep);
        }
    };

    this.trans = {
        init: wait,
        wait: takeInstance,
        takeInstance: function () {
            let self = this;
            if (self.stop) {
                return fini;
            } else if (self.currentModel != null) {
                return classifyInstance;
            } else {
                return addInstance;
            }
        },
        classifyInstance: function () {
            let self = this;
            if (self.instance != null) {
                return addInstance;
            } else {
                return wait;
            }
        },
        addInstance: function () {
            let self = this;
            if (self.tables.learning.length > self.parameter.const.threshold) {
                return makeModel;
            } else {
                return wait;
            }
        },
        makeModel: takeModels,
        takeModels: compareModels,
        compareModels: wait,
        fini: finiLoop,
        finiLoop: finiLoop
    };

    this.on = {};
    this.next = 'init';
}
