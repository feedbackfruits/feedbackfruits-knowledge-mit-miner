"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config = require("./config");
const miner_1 = require("./miner");
const feedbackfruits_knowledge_engine_1 = require("feedbackfruits-knowledge-engine");
function init({ name }) {
    return __awaiter(this, void 0, void 0, function* () {
        const send = yield feedbackfruits_knowledge_engine_1.Miner({
            name,
            customConfig: Config
        });
        console.log('Starting MIT miner...');
        const docs = miner_1.mine();
        let count = 0;
        yield new Promise((resolve, reject) => {
            docs.subscribe({
                next: (doc) => __awaiter(this, void 0, void 0, function* () {
                    count++;
                    console.log(`Sending doc number ${count}:`, doc['@id']);
                    const result = yield send({ action: 'write', key: doc['@id'], data: doc });
                    return result;
                }),
                error: (reason) => {
                    console.log('Miner crashed...');
                    reject(reason);
                },
                complete: () => {
                    console.log('Miner completed');
                    resolve();
                }
            });
        });
        console.log(`Mined ${count} docs from MIT`);
        return;
    });
}
exports.default = init;
if (require.main === module) {
    console.log("Running as script.");
    init({
        name: Config.NAME,
    }).catch(console.error);
}
