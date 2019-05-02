"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Semaphore = /** @class */ (function () {
    function Semaphore(limit) {
        if (limit === void 0) { limit = 1; }
        if (typeof limit !== 'number') {
            throw new TypeError("Expected limit to be a number, got " + typeof limit);
        }
        if (limit < 1) {
            throw new Error('limit cannot be less than 1');
        }
        this.limit = limit;
        this.kQueue = [];
        this.kUsed = 0;
    }
    Semaphore.prototype.aquire = function () {
        var _this = this;
        if (this.kUsed < this.limit) {
            this.kUsed += 1;
            return Promise.resolve();
        }
        return new Promise(function (resolve) {
            _this.kQueue.push(resolve);
        });
    };
    Semaphore.prototype.release = function () {
        if (this.kQueue.length) {
            this.kQueue.shift()();
        }
        else {
            this.kUsed -= 1;
        }
    };
    Semaphore.prototype.use = function (fn) {
        var _this = this;
        return this.aquire().then(fn).then(function (value) { _this.release(); return value; }, function (error) { _this.release(); throw error; });
    };
    return Semaphore;
}());
exports.Semaphore = Semaphore;
