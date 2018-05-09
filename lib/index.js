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
                next: (doc) => {
                    count++;
                    return send({ action: 'write', key: doc['@id'], data: doc });
                },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLG1DQUFtQztBQUNuQyxtQ0FBK0I7QUFFL0IscUZBQW9GO0FBRXBGLGNBQW1DLEVBQUUsSUFBSSxFQUFFOztRQUN6QyxNQUFNLElBQUksR0FBRyxNQUFNLHVDQUFLLENBQUM7WUFDdkIsSUFBSTtZQUNKLFlBQVksRUFBRSxNQUE2QjtTQUM1QyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFDckMsTUFBTSxJQUFJLEdBQUcsWUFBSSxFQUFFLENBQUM7UUFFcEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNiLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUNaLEtBQUssRUFBRSxDQUFDO29CQUVSLE9BQU8sSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRCxDQUFDO2dCQUNELEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO29CQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7b0JBQ2hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakIsQ0FBQztnQkFDRCxRQUFRLEVBQUUsR0FBRyxFQUFFO29CQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztvQkFDL0IsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEtBQUssZ0JBQWdCLENBQUMsQ0FBQztRQUM1QyxPQUFPO0lBQ1QsQ0FBQztDQUFBO0FBOUJELHVCQThCQztBQUlELElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQztRQUNILElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtLQUNsQixDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUN6QiJ9