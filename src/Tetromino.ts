var Constants_1 = require("./Constants");
var BlockFactory_1 = require("./BlockFactory");
var Tetrisblock = /** @class */ (function () {
    function Tetrisblock(type, container) {
        this._container = container;
        this.type = type;
        this.x = Math.floor(Constants_1.default.WIDTH / 2 - this.type.size / 2);
        this.y = 0;
        this.angle = 0;
        this._blocks = [];
    }
    Tetrisblock.getRandom = function (container) {
        var types = [exports.Types.I, exports.Types.J, exports.Types.L, exports.Types.O, exports.Types.S, exports.Types.T, exports.Types.Z];
        var type = types[Math.floor(Math.random() * 7)];
        return new Tetrisblock(type, container);
    };
    Tetrisblock.prototype.draw = function () {
        var i = 0;
        for (var x = 0; x < this.type.size; x++) {
            for (var y = 0; y < this.type.size; y++) {
                if (this.type.shapes[this.angle][y][x] === 1) {
                    if (this._blocks.length !== 4) {
                        var block = BlockFactory_1.default.createBlock(0, 0, Constants_1.default.SQUARE_SIZE, Constants_1.default.SQUARE_SIZE, this.type.color, Constants_1.default.COLORS.TETRISBLOCK_BORDERS, 0.5);
                        this._blocks.push(block);
                        this._container.addChild(block);
                    }
                    this._blocks[i].x = (this.x + x) * Constants_1.default.SQUARE_SIZE;
                    this._blocks[i].y = (this.y + y) * Constants_1.default.SQUARE_SIZE;
                    i++;
                }
            }
        }
    };
    Tetrisblock.prototype.remove = function () {
        for (var i = 0; i < this._blocks.length; i++) {
            this._container.removeChild(this._blocks[i]);
            delete this._blocks[i];
        }
    };
    Tetrisblock.prototype.rotate = function () {
        this.angle += 1;
        this.angle %= 4;
    };
    Tetrisblock.prototype.antiRotate = function () {
        this.angle -= 1;
        if (this.angle === -1) {
            this.angle = 3;
        }
    };
    Tetrisblock.prototype.move = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };
    Tetrisblock.prototype.hasBlock = function (x, y) {
        return this.type.shapes[this.angle][y][x] === 1;
    };
    return Tetrisblock;
}());
exports.default = Tetrisblock;
exports.Types = {
    I: {
        name: 'I',
        color: Constants_1.default.COLORS.TETRISBLOCK_I,
        size: 4,
        shapes: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ]
    },
    J: {
        name: 'J',
        color: Constants_1.default.COLORS.TETRISBLOCK_J,
        size: 3,
        shapes: [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        ]
    },
    L: {
        name: 'L',
        color: Constants_1.default.COLORS.TETRISBLOCK_L,
        size: 3,
        shapes: [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    O: {
        name: 'O',
        color: Constants_1.default.COLORS.TETRISBLOCK_O,
        size: 2,
        shapes: [
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1],
                [1, 1]
            ],
            [
                [1, 1],
                [1, 1]
            ]
        ]
    },
    S: {
        name: 'S',
        color: Constants_1.default.COLORS.TETRISBLOCK_S,
        size: 3,
        shapes: [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    T: {
        name: 'T',
        color: Constants_1.default.COLORS.TETRISBLOCK_T,
        size: 3,
        shapes: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ]
    },
    Z: {
        name: 'Z',
        color: Constants_1.default.COLORS.TETRISBLOCK_Z,
        size: 3,
        shapes: [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0]
            ]
        ]
    }
};
