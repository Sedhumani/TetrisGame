var Constants_1 = require("./Constants");
var BlockFactory_1 = require("./BlockFactory");
var Stage = /** @class */ (function () {
    function Stage(container) {
        this._container = container;
        this._data = [];
        for (var x = 0; x < Constants_1.default.WIDTH; x++) {
            this._data.push([]);
            for (var y = 0; y < Constants_1.default.HEIGHT; y++) {
                this._data[x].push(0);
            }
        }
        this._blocks = [];
    }
    Stage.prototype.draw = function () {
        var i = 0;
        for (var x = 0; x < Constants_1.default.WIDTH; x++) {
            for (var y = 0; y < Constants_1.default.HEIGHT; y++) {
                if (this._data[x][y] !== 0) {
                    var block = BlockFactory_1.default.createBlock(x * Constants_1.default.SQUARE_SIZE, y * Constants_1.default.SQUARE_SIZE, Constants_1.default.SQUARE_SIZE, Constants_1.default.SQUARE_SIZE, this._data[x][y], Constants_1.default.COLORS.TETRISBLOCK_BORDERS, 0.5);
                    this._container.removeChild(this._blocks[i]);
                    delete this._blocks[i];
                    this._container.addChild(block);
                    this._blocks[i] = block;
                }
                else if (this._blocks[i] === undefined) {
                    var block = BlockFactory_1.default.createBlock(x * Constants_1.default.SQUARE_SIZE, y * Constants_1.default.SQUARE_SIZE, Constants_1.default.SQUARE_SIZE, Constants_1.default.SQUARE_SIZE, Constants_1.default.COLORS.BACKGROUND, Constants_1.default.COLORS.BORDERS, 0.5);
                    this._container.addChild(block);
                    this._blocks[i] = block;
                }
                i++;
            }
        }
    };
    Stage.prototype.isCollision = function (tetrisblock) {
        for (var x = 0; x < tetrisblock.type.size; x++) {
            for (var y = 0; y < tetrisblock.type.size; y++) {
                if (tetrisblock.x + x < 0 || tetrisblock.x + x >= Constants_1.default.WIDTH || y >= Constants_1.default.HEIGHT || tetrisblock.y >= 0 && this._data[tetrisblock.x + x][tetrisblock.y + y] !== 0) {
                    if (tetrisblock.hasBlock(x, y)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Stage.prototype.unite = function (tetrisblock) {
        var clearedLines = 0;
        for (var y = 0; y < tetrisblock.type.size; y++) {
            for (var x = 0; x < tetrisblock.type.size; x++) {
                if (tetrisblock.x + x < Constants_1.default.WIDTH && tetrisblock.x + x >= 0 && tetrisblock.hasBlock(x, y)) {
                    this._data[tetrisblock.x + x][tetrisblock.y + y] = tetrisblock.type.color;
                }
            }
        }
        for (var y = 0; y < tetrisblock.type.size; y++) {
            var eraseLine = true;
            if (y + tetrisblock.y >= Constants_1.default.HEIGHT) {
                eraseLine = false;
            }
            else {
                for (var x = 0; x < Constants_1.default.WIDTH; x++) {
                    if (this._data[x][y + tetrisblock.y] === 0) {
                        eraseLine = false;
                        break;
                    }
                }
            }
            if (eraseLine) {
                clearedLines++;
                for (var yy = y + tetrisblock.y; yy >= 0; yy--) {
                    for (var x = 0; x < Constants_1.default.WIDTH; x++) {
                        if (yy > 0) {
                            this._data[x][yy] = this._data[x][yy - 1];
                        }
                        else {
                            this._data[x][yy] = 0;
                        }
                    }
                }
                this._blocks = [];
            }
        }
        return clearedLines;
    };
    Stage.prototype.reset = function () {
        this._data = [];
        for (var x = 0; x < Constants_1.default.WIDTH; x++) {
            this._data.push([]);
            for (var y = 0; y < Constants_1.default.HEIGHT; y++) {
                this._data[x].push(0);
            }
        }
        this._blocks = [];
    };
    return Stage;
}());
exports.default = Stage;
