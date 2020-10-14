model = {
    name: 'Distributed incremental machine learning',

    agents: {
        world: {
            behaviour: open('world.js'),
            visual: {
                shape: 'circle',
                width: 10,
                height: 10,
                fill: {
                    color: 'green',
                    opacity: 0.0
                }
            }
        },
        messenger: {
            behaviour: open('messenger.js'),
            visual: {
                shape: 'circle',
                width: 7,
                height: 7,
                fill: {
                    color: 'pink',
                    opacity: 0.0
                },
                line: {
                    color: 'pink',
                    width: 1
                }
            }
        },
        learner: {
            behaviour: open('learner.js'),
            visual: {
                shape: 'circle',
                width: 4,
                height: 4,
                fill: {
                    color: 'blue',
                    opacity: 0.0
                }
            },
            type: 'physical'
        },
        datastore: {
            behaviour: open('datastore.js'),
            visual: {
                shape: 'circle',
                width: 4,
                height: 4,
                fill: {
                    color: 'red',
                    opacity: 0.0
                }
            },
            type: 'physical'
        }
    },

    resources: {},

    nodes: {
        world: function (x, y) {
            return {
                id: 'world',
                x: x,
                y: y,
                visual: {
                    shape: 'icon',
                    icon: 'world',
                    label: {
                        text: 'World',
                        fontSize: 14
                    },
                    width: 20,
                    height: 20,
                    fill: {
                        color: 'black',
                        opacity: 0.5
                    }
                },
                ports: {
                    wlan: {
                        type: 'multicast',
                        status: function (nodes) {
                            return nodes;
                        },
                        visual: {
                            shape: 'circle',
                            width: 2000,
                            height: 2000,
                            line: {
                                color: '#BBB',
                                opacity: 0.1,
                                width: 1
                            }
                        }
                    },
                    /*phy: {
                        type: 'physical',
                        ip: '*',
                        to: 'localhost:10001',
                        proto: 'http'
                    }*/
                }
            }
        },
        learner: function (x, y, id) {
            return {
                id: id,
                x: x,
                y: y,
                visual: {
                    shape: 'rect',
                    width: 10,
                    height: 10,
                    line: {
                        width: 0,
                    },
                    fill: {
                        color: 'blue',
                        opacity: 0.5
                    }
                },
                ports: {
                    wlan: {
                        type: 'multicast',
                        status: function (nodes) {
                            return nodes;
                        },
                        visual: {
                            shape: 'circle',
                            width: 200,
                            height: 200,
                            line: {
                                color: '#BBB',
                                opacity: 0.2,
                                width: 1
                            }
                        }
                    }
                }
            }
        },
        datastore: function (x, y, id) {
            return {
                id: id,
                x: x,
                y: y,
                visual: {
                    shape: 'rect',
                    width: 10,
                    height: 10,
                    line: {
                        width: 0,
                    },
                    fill: {
                        color: 'red',
                        opacity: 0.5
                    }
                },
                ports: {
                    wlan: {
                        type: 'multicast',
                        status: function (nodes) {
                            return nodes;
                        },
                        visual: {
                            shape: 'circle',
                            width: 40,
                            height: 40,
                            line: {
                                color: '#BBB',
                                opacity: 0.2,
                                width: 1
                            }
                        }
                    }
                }
            }
        }
    },

    parameter: {
        const: {
            threshold: 15,
            num_learner: 3,
            sleep: 1
        },
        log: []
    },

    world: {
        init: {
            agents: {
                world: function (nodeId) {
                    if (nodeId === 'world')
                        return {level: 3, args: {verbose: 1}};
                }
            }
        },
        map: function () {
            return [
                model.nodes.world(model.world.patchgrid.rows + 10, 5)
            ]
        },
        resources: function () {
            return [];
        },
        patchgrid: {
            rows: 50,
            cols: 50,
            width: 10,
            height: 10,
            floating: true
        }
    }

};