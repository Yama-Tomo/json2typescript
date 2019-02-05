import { JsonObject, JsonProperty } from '../../../src/json2typescript/json-convert-decorators';

import { Animal } from './animal';

@JsonObject('Kitty')
export class Cat extends Animal {
  @JsonProperty('catName', String)
  public name: string = '';
  @JsonProperty()
  public district: number = 0;
  @JsonProperty()
  public talky: boolean = false;
  @JsonProperty('other', String)
  public other: string = '';
}
