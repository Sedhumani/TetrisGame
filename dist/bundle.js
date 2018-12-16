(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var BlockFactory = /** @class */ (function () {
    function BlockFactory() {
    }
    BlockFactory.createBlock = function (x, y, width, height, backgroundColor, borderColor, borderWidth) {
        var block = new PIXI.Container();
        var border = new PIXI.Sprite(getTexture(borderColor));
        border.width = width;
        border.height = height;
        block.addChild(border);
        var background = new PIXI.Sprite(getTexture(backgroundColor));
        background.width = width - 2 * borderWidth;
        background.height = height - 2 * borderWidth;
        background.position.x = borderWidth;
        background.position.y = borderWidth;
        block.addChild(background);
        block.position.x = x;
        block.position.y = y;
        return block;
    };
    return BlockFactory;
}());
exports["default"] = BlockFactory;
function getTexture(color) {
    if (colorTextures[color] === undefined) {
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(0, 0, 1, 1);
        ctx.fill();
        ctx.closePath();
        colorTextures[color] = PIXI.Texture.fromCanvas(canvas);
    }
    return colorTextures[color];
}
;
var colorTextures = {};

},{}],2:[function(require,module,exports){
exports["default"] = {
    WIDTH: 12,
    HEIGHT: 24,
    SQUARE_SIZE: 25,
    COLORS: {
        TETRISBLOCK_BORDERS: '#373c40',
        TETRISBLOCK_I: '#ff8000',
        TETRISBLOCK_J: '#2cc990',
        TETRISBLOCK_L: '#f34344',
        TETRISBLOCK_O: '#ffdf00',
        TETRISBLOCK_S: '#ccdce4',
        TETRISBLOCK_T: '#008aff',
        TETRISBLOCK_Z: '#fcb941',
        BACKGROUND: '#2d3236',
        BORDERS: '#373C40'
    },
    DOM: {
        CONTAINER: '#canvas-container',
        NEXT: '#next-tetrisblock',
        START_PAUSE: '#start-pause button',
        LEVEL: '#level',
        SCORE: '#score',
        CLEARED: '#cleared',
        BEST: '#best-score',
        OVERLAY: '#overlay'
    }
};

},{}],3:[function(require,module,exports){
var Tetrisblock_1 = require("./Tetrisblock");
var Constants_1 = require("./Constants");
var Stage_1 = require("./Stage");
var ScoreManager_1 = require("./ScoreManager");
var Game = /** @class */ (function () {
    function Game() {
        console.log(PIXI);
        this._domContainer = document.querySelector(Constants_1["default"].DOM.CONTAINER);
        this._domNextContainer = document.querySelector(Constants_1["default"].DOM.NEXT);
        this._initKeyboardEvents();
        this._initMouseEvents();
        this._renderer = PIXI.autoDetectRenderer(Constants_1["default"].WIDTH * Constants_1["default"].SQUARE_SIZE, Constants_1["default"].HEIGHT * Constants_1["default"].SQUARE_SIZE);
        this._domContainer.appendChild(this._renderer.view);
        this._container = new PIXI.Container();
        this._stage = new Stage_1["default"](this._container);
        this._tetrisblock = undefined;
        this._nextTetrisblock = undefined;
        this._newTetrisblock();
        this._delay = 300;
        this._timer = new Date().getTime();
        this._scoreManager = new ScoreManager_1["default"]();
        this._requestId = undefined;
        this._paused = false;
        this._start();
    }
    Game.prototype._start = function () {
        var _this = this;
        this._stage.draw();
        this._requestId = requestAnimationFrame(function () { return _this._loop(); });
    };
    Game.prototype._loop = function () {
        var _this = this;
        if (new Date().getTime() - this._timer > this._delay) {
            this._timer = new Date().getTime();
            this._drop();
        }
        this._render();
        this._requestId = requestAnimationFrame(function () { return _this._loop(); });
    };
    Game.prototype._pause = function () {
        this._paused = !this._paused;
        if (this._paused) {
            cancelAnimationFrame(this._requestId);
            document.querySelector(Constants_1["default"].DOM.START_PAUSE).innerText = 'resume';
            document.querySelector(Constants_1["default"].DOM.START_PAUSE).innerText = 'continue';
            document.querySelector(Constants_1["default"].DOM.OVERLAY).className = 'active';
        }
        else {
            this._start();
            document.querySelector(Constants_1["default"].DOM.START_PAUSE).id = 'pause';
            document.querySelector(Constants_1["default"].DOM.START_PAUSE).innerText = 'pause';
            document.querySelector(Constants_1["default"].DOM.OVERLAY).className = '';
        }
    };
    Game.prototype._drop = function () {
        this._tetrisblock.move(0, 1);
        if (this._stage.isCollision(this._tetrisblock)) {
            this._tetrisblock.move(0, -1);
            this._tetrisblock.remove();
            var clearedLines = this._stage.unite(this._tetrisblock);
            if (clearedLines > 0) {
                this._scoreManager.addClearedLines(clearedLines);
            }
            this._scoreManager.tetrisblockDropped();
            this._stage.draw();
            this._newTetrisblock();
        }
    };
    Game.prototype._hardDrop = function () {
        while (!this._stage.isCollision(this._tetrisblock)) {
            this._tetrisblock.move(0, 1);
        }
        this._tetrisblock.move(0, -1);
        this._tetrisblock.remove();
        var clearedLines = this._stage.unite(this._tetrisblock);
        if (clearedLines > 0) {
            this._scoreManager.addClearedLines(clearedLines);
        }
        this._scoreManager.tetrisblockDropped();
        this._stage.draw();
        this._newTetrisblock();
    };
    Game.prototype._gameOver = function () {
        this._stage.reset();
        this._stage.draw();
        this._scoreManager.reset();
    };
    Game.prototype._newTetrisblock = function () {
        if (!this._nextTetrisblock) {
            this._nextTetrisblock = Tetrisblock_1["default"].getRandom(this._container);
        }
        this._tetrisblock = this._nextTetrisblock;
        this._nextTetrisblock = Tetrisblock_1["default"].getRandom(this._container);
        this._domNextContainer.className = this._nextTetrisblock.type.name;
        if (this._stage.isCollision(this._tetrisblock)) {
            this._gameOver();
        }
    };
    Game.prototype._initKeyboardEvents = function () {
        var _this = this;
        var leftKey = this._keyboard(37);
        var upKey = this._keyboard(38);
        var rightKey = this._keyboard(39);
        var downKey = this._keyboard(40);
        var spaceKey = this._keyboard(32);
        var pKey = this._keyboard(80);
        leftKey.press = function () { return _this._pressLeft(); };
        upKey.press = function () { return _this._pressUp(); };
        rightKey.press = function () { return _this._pressRight(); };
        downKey.press = function () { return _this._pressDown(); };
        spaceKey.press = function () { return _this._pressSpace(); };
        pKey.press = function () { return _this._pause(); };
    };
    Game.prototype._initMouseEvents = function () {
        var _this = this;
        var startPauseButton = document.querySelector(Constants_1["default"].DOM.START_PAUSE);
        startPauseButton.addEventListener('click', function () { return _this._pause(); });
    };
    Game.prototype._pressLeft = function () {
        if (!this._paused) {
            this._tetrisblock.move(-1, 0);
            if (this._stage.isCollision(this._tetrisblock)) {
                this._tetrisblock.move(1, 0);
            }
        }
    };
    Game.prototype._pressRight = function () {
        if (!this._paused) {
            this._tetrisblock.move(1, 0);
            if (this._stage.isCollision(this._tetrisblock)) {
                this._tetrisblock.move(-1, 0);
            }
        }
    };
    Game.prototype._pressUp = function () {
        if (!this._paused) {
            this._tetrisblock.rotate();
            if (this._stage.isCollision(this._tetrisblock)) {
                this._tetrisblock.antiRotate();
            }
        }
    };
    Game.prototype._pressDown = function () {
        if (!this._paused) {
            this._drop();
        }
    };
    Game.prototype._pressSpace = function () {
        if (!this._paused) {
            this._hardDrop();
        }
    };
    Game.prototype._render = function () {
        this._tetrisblock.draw();
        this._renderer.render(this._container);
    };
    Game.prototype._keyboard = function (keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        key.downHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press)
                    key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };
        key.upHandler = function (event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release)
                    key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        };
        window.addEventListener('keydown', key.downHandler.bind(key), false);
        window.addEventListener('keyup', key.upHandler.bind(key), false);
        return key;
    };
    return Game;
}());
exports["default"] = Game;

},{"./Constants":2,"./ScoreManager":4,"./Stage":5,"./Tetrisblock":6}],4:[function(require,module,exports){
var Constants_1 = require("./Constants");
var ScoreManager = /** @class */ (function () {
    function ScoreManager() {
        this.reset();
    }
    ScoreManager.prototype.reset = function () {
        this.best = localStorage.bestScore ? localStorage.bestScore : 0;
        if (this.score > this.best) {
            this.best = localStorage.bestScore = this.score;
        }
        this.level = 0;
        this.score = 0;
        this.clearedLines = 0;
        this.updateDisplay();
    };
    ScoreManager.prototype._addPoints = function (points) {
        this.score += points;
    };
    ScoreManager.prototype.addClearedLines = function (lines) {
        var previousClearedLines = this.clearedLines;
        this.clearedLines += lines;
        if (previousClearedLines % 10 > this.clearedLines % 10) {
            this.level++;
        }
        if (lines === 1) {
            this._addPoints(40 * (this.level + 1));
        }
        else if (lines === 2) {
            this._addPoints(100 * (this.level + 1));
        }
        else if (lines === 3) {
            this._addPoints(300 * (this.level + 1));
        }
        else if (lines === 4) {
            this._addPoints(1200 * (this.level + 1));
        }
        this.updateDisplay();
    };
    ScoreManager.prototype.tetrisblockDropped = function () {
        this._addPoints(5 * (this.level + 1));
        this.updateDisplay();
    };
    ScoreManager.prototype.updateDisplay = function () {
        document.querySelector(Constants_1["default"].DOM.LEVEL).innerText = this.level;
        document.querySelector(Constants_1["default"].DOM.SCORE).innerText = this.score;
        document.querySelector(Constants_1["default"].DOM.CLEARED).innerText = this.clearedLines;
        document.querySelector(Constants_1["default"].DOM.BEST).innerText = this.best;
    };
    return ScoreManager;
}());
exports["default"] = ScoreManager;

},{"./Constants":2}],5:[function(require,module,exports){
var Constants_1 = require("./Constants");
var BlockFactory_1 = require("./BlockFactory");
var Stage = /** @class */ (function () {
    function Stage(container) {
        this._container = container;
        this._data = [];
        for (var x = 0; x < Constants_1["default"].WIDTH; x++) {
            this._data.push([]);
            for (var y = 0; y < Constants_1["default"].HEIGHT; y++) {
                this._data[x].push(0);
            }
        }
        this._blocks = [];
    }
    Stage.prototype.draw = function () {
        var i = 0;
        for (var x = 0; x < Constants_1["default"].WIDTH; x++) {
            for (var y = 0; y < Constants_1["default"].HEIGHT; y++) {
                if (this._data[x][y] !== 0) {
                    var block = BlockFactory_1["default"].createBlock(x * Constants_1["default"].SQUARE_SIZE, y * Constants_1["default"].SQUARE_SIZE, Constants_1["default"].SQUARE_SIZE, Constants_1["default"].SQUARE_SIZE, this._data[x][y], Constants_1["default"].COLORS.TETRISBLOCK_BORDERS, 0.5);
                    this._container.removeChild(this._blocks[i]);
                    delete this._blocks[i];
                    this._container.addChild(block);
                    this._blocks[i] = block;
                }
                else if (this._blocks[i] === undefined) {
                    var block = BlockFactory_1["default"].createBlock(x * Constants_1["default"].SQUARE_SIZE, y * Constants_1["default"].SQUARE_SIZE, Constants_1["default"].SQUARE_SIZE, Constants_1["default"].SQUARE_SIZE, Constants_1["default"].COLORS.BACKGROUND, Constants_1["default"].COLORS.BORDERS, 0.5);
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
                if (tetrisblock.x + x < 0 || tetrisblock.x + x >= Constants_1["default"].WIDTH || y >= Constants_1["default"].HEIGHT || tetrisblock.y >= 0 && this._data[tetrisblock.x + x][tetrisblock.y + y] !== 0) {
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
                if (tetrisblock.x + x < Constants_1["default"].WIDTH && tetrisblock.x + x >= 0 && tetrisblock.hasBlock(x, y)) {
                    this._data[tetrisblock.x + x][tetrisblock.y + y] = tetrisblock.type.color;
                }
            }
        }
        for (var y = 0; y < tetrisblock.type.size; y++) {
            var eraseLine = true;
            if (y + tetrisblock.y >= Constants_1["default"].HEIGHT) {
                eraseLine = false;
            }
            else {
                for (var x = 0; x < Constants_1["default"].WIDTH; x++) {
                    if (this._data[x][y + tetrisblock.y] === 0) {
                        eraseLine = false;
                        break;
                    }
                }
            }
            if (eraseLine) {
                clearedLines++;
                for (var yy = y + tetrisblock.y; yy >= 0; yy--) {
                    for (var x = 0; x < Constants_1["default"].WIDTH; x++) {
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
        for (var x = 0; x < Constants_1["default"].WIDTH; x++) {
            this._data.push([]);
            for (var y = 0; y < Constants_1["default"].HEIGHT; y++) {
                this._data[x].push(0);
            }
        }
        this._blocks = [];
    };
    return Stage;
}());
exports["default"] = Stage;

},{"./BlockFactory":1,"./Constants":2}],6:[function(require,module,exports){
var Constants_1 = require("./Constants");
var BlockFactory_1 = require("./BlockFactory");
var Tetrisblock = /** @class */ (function () {
    function Tetrisblock(type, container) {
        this._container = container;
        this.type = type;
        this.x = Math.floor(Constants_1["default"].WIDTH / 2 - this.type.size / 2);
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
                        var block = BlockFactory_1["default"].createBlock(0, 0, Constants_1["default"].SQUARE_SIZE, Constants_1["default"].SQUARE_SIZE, this.type.color, Constants_1["default"].COLORS.TETRISBLOCK_BORDERS, 0.5);
                        this._blocks.push(block);
                        this._container.addChild(block);
                    }
                    this._blocks[i].x = (this.x + x) * Constants_1["default"].SQUARE_SIZE;
                    this._blocks[i].y = (this.y + y) * Constants_1["default"].SQUARE_SIZE;
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
exports["default"] = Tetrisblock;
exports.Types = {
    I: {
        name: 'I',
        color: Constants_1["default"].COLORS.TETRISBLOCK_I,
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
        color: Constants_1["default"].COLORS.TETRISBLOCK_J,
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
        color: Constants_1["default"].COLORS.TETRISBLOCK_L,
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
        color: Constants_1["default"].COLORS.TETRISBLOCK_O,
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
        color: Constants_1["default"].COLORS.TETRISBLOCK_S,
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
        color: Constants_1["default"].COLORS.TETRISBLOCK_T,
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
        color: Constants_1["default"].COLORS.TETRISBLOCK_Z,
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

},{"./BlockFactory":1,"./Constants":2}],7:[function(require,module,exports){
var Game_1 = require("./Game");
var g = new Game_1["default"]();

},{"./Game":3}]},{},[7]);
