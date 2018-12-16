var Tetrisblock_1 = require("./Tetrisblock");
var Constants_1 = require("./Constants");
var Stage_1 = require("./Stage");
var ScoreManager_1 = require("./ScoreManager");
var Game = /** @class */ (function () {
    function Game() {
        console.log(PIXI);
        this._domContainer = document.querySelector(Constants_1.default.DOM.CONTAINER);
        this._domNextContainer = document.querySelector(Constants_1.default.DOM.NEXT);
        this._initKeyboardEvents();
        this._initMouseEvents();
        this._renderer = PIXI.autoDetectRenderer(Constants_1.default.WIDTH * Constants_1.default.SQUARE_SIZE, Constants_1.default.HEIGHT * Constants_1.default.SQUARE_SIZE);
        this._domContainer.appendChild(this._renderer.view);
        this._container = new PIXI.Container();
        this._stage = new Stage_1.default(this._container);
        this._tetrisblock = undefined; 
        this._nextTetrisblock = undefined; 
        this._newTetrisblock();
        this._delay = 300;
        this._timer = new Date().getTime();
        this._scoreManager = new ScoreManager_1.default();
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
            document.querySelector(Constants_1.default.DOM.START_PAUSE).innerText = 'resume';
            document.querySelector(Constants_1.default.DOM.START_PAUSE).innerText = 'continue';
            document.querySelector(Constants_1.default.DOM.OVERLAY).className = 'active';
        }
        else {
            this._start();
            document.querySelector(Constants_1.default.DOM.START_PAUSE).id = 'pause';
            document.querySelector(Constants_1.default.DOM.START_PAUSE).innerText = 'pause';
            document.querySelector(Constants_1.default.DOM.OVERLAY).className = '';
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
            this._nextTetrisblock = Tetrisblock_1.default.getRandom(this._container);
        }
        this._tetrisblock = this._nextTetrisblock;
        this._nextTetrisblock = Tetrisblock_1.default.getRandom(this._container);
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
        var startPauseButton = document.querySelector(Constants_1.default.DOM.START_PAUSE);
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
exports.default = Game;
