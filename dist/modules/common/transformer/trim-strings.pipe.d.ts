import { AbstractTransformPipe } from './abstract-transform.pipe';
export declare class TrimStringsPipe extends AbstractTransformPipe {
    except(): string[];
    protected transformValue(value: any): any;
    transform(values: any): any;
}
