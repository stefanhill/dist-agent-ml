function messenger(options) {

    this.mode = options.mode;

    this.targetNode = options.targetNode;
    this.homeNode = options.homeNode;

    this.message = options.message;

    this.act = {
        init: function () {
        },
        goToTargetNode: function () {
            let self = this;
            moveto(DIR.PATH(self.targetNode));
        },
        targetOperation: function () {
            let self = this;
            switch (self.mode) {
                case 'model':
                    out(['MODEL', self.message]);
                    kill();
                    break;
                case 'survey':
                    try_inp(0, ['NO_DATA'], function (t2) {
                        if (t2) {
                            self.message = 'NO_DATA';
                        }
                    });
                    try_inp(0, ['SURVEY', _], function (t1) {
                        if (t1) {
                            self.message = t1[1];
                        }
                    });
                    break;
            }
        },
        goToHomeNode: function () {
            let self = this;
            moveto(DIR.PATH(self.homeNode));
        },
        homeOperation: function () {
            let self = this;
            if (self.mode === 'survey') {
                if (self.message === 'NO_DATA') {
                    out(['NO_DATA']);
                } else if (self.message != null) {
                    out(['SURVEY', self.message]);
                }
            }
            kill();
        }
    };

    this.trans = {
        init: goToTargetNode,
        goToTargetNode: targetOperation,
        targetOperation: goToHomeNode,
        goToHomeNode: homeOperation
    };

    this.on = {};
    this.next = 'init';
}
