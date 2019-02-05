import { JsonConverter } from '../../../src/json2typescript/json-convert-decorators';
import { JsonCustomConvert } from '../../../src/json2typescript/json-custom-convert';

@JsonConverter
export class DateConverter implements JsonCustomConvert<Date|null> {
  public serialize(date: Date|null): any {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
    } else {
      return null;
    }
  }

  public deserialize(date: any): Date|null {
    if (date === null || date === '') {
      return null;
    }

    return new Date(date);
  }
}
