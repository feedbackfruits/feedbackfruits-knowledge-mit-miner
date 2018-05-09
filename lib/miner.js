"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("@reactivex/rxjs");
function mine() {
    return new rxjs_1.Observable(observer => {
        observer.complete();
    });
}
exports.mine = mine;
