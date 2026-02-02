"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnQueue = exports.EnJob = void 0;
var EnJob;
(function (EnJob) {
    EnJob["SCHEDULED_TX"] = "scheduled_tx";
    EnJob["PUSH_NOTIFICATION"] = "push_notification";
})(EnJob || (exports.EnJob = EnJob = {}));
var EnQueue;
(function (EnQueue) {
    EnQueue["SCHEDULED_TX"] = "scheduled_tx_queue";
    EnQueue["PUSH_NOTIFICATION"] = "push_notification";
})(EnQueue || (exports.EnQueue = EnQueue = {}));
//# sourceMappingURL=processor.enum.js.map