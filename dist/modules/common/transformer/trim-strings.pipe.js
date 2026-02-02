"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimStringsPipe = void 0;
const abstract_transform_pipe_1 = require("./abstract-transform.pipe");
class TrimStringsPipe extends abstract_transform_pipe_1.AbstractTransformPipe {
    except() {
        return ['password', 'passwordConfirmation'];
    }
    transformValue(value) {
        return typeof value === 'string' ? value.trim() : value;
    }
    transform(values) {
        if (typeof values === 'string') {
            return values.trim();
        }
        return values;
    }
}
exports.TrimStringsPipe = TrimStringsPipe;
//# sourceMappingURL=trim-strings.pipe.js.map