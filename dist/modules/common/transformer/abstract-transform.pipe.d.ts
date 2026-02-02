import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare abstract class AbstractTransformPipe implements PipeTransform {
    protected abstract transformValue(value: any): any;
    protected except(): string[];
    private isObject;
    private transformObject;
    transform(values: any, metadata: ArgumentMetadata): any;
}
