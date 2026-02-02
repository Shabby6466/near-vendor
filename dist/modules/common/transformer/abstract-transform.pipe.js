"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTransformPipe = void 0;
class AbstractTransformPipe {
    except() {
        return [];
    }
    isObject(value) {
        return typeof value === 'object' && value !== null;
    }
    transformObject(values) {
        Object.keys(values).forEach((key) => {
            if (this.except().includes(key)) {
                return;
            }
            if (this.isObject(values[key])) {
                values[key] = this.transformObject(values[key]);
            }
            else {
                values[key] = this.transformValue(values[key]);
            }
        });
        return values;
    }
    transform(values, metadata) {
        const { type } = metadata;
        if (this.isObject(values) && type === 'body') {
            return this.transformObject(values);
        }
        return values;
    }
}
exports.AbstractTransformPipe = AbstractTransformPipe;
//# sourceMappingURL=abstract-transform.pipe.js.map