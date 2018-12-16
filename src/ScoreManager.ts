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
        document.querySelector(Constants_1.default.DOM.LEVEL).innerText = this.level;
        document.querySelector(Constants_1.default.DOM.SCORE).innerText = this.score;
        document.querySelector(Constants_1.default.DOM.CLEARED).innerText = this.clearedLines;
        document.querySelector(Constants_1.default.DOM.BEST).innerText = this.best;
    };
    return ScoreManager;
}());
exports.default = ScoreManager;
