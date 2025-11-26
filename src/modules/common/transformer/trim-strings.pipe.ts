import { AbstractTransformPipe } from './abstract-transform.pipe';

export class TrimStringsPipe extends AbstractTransformPipe {
  except() {
    return ['password', 'passwordConfirmation'];
  }

  protected transformValue(value: any): any {
    return typeof value === 'string' ? value.trim() : value;
  }

  transform(values: any): any {
    if (typeof values === 'string') {
      return values.trim();
    }
    return values;
  }
}
