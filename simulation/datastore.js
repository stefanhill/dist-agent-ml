function datastore(options) {

    this.parameter = null;

    this.node = null;
    this.position = [];

    this.data = [];

    // -> integer
    this.mfr = function (a) {
        return Math.floor(Math.random() * a)
    };

    this.act = {
        init: function () {
            let self = this;
            self.parameter = simu.model().parameter;
            self.node = myNode();

            net.setxy(self.position.x, self.position.y);
        },
        dropSurvey: function () {
            let self = this;
            if (self.data.length > 0) {
                out(['SURVEY', self.data.splice(self.mfr(self.data.length), 1)[0]]);
            }
            else {
                out(['NO_DATA']);
            }
        },
        wait: function () {
            let self = this;
            sleep(5 * self.parameter.const.sleep);
        }
    };

    this.trans = {
        init: dropSurvey,
        dropSurvey: wait,
        wait: dropSurvey
    };

    this.on = {};
    this.next = 'init';
}
