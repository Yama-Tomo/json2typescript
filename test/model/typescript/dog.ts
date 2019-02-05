import { JsonObject, JsonProperty } from '../../../src/json2typescript/json-convert-decorators';

import { Animal } from './animal';

@JsonObject
export class Dog extends Animal {
  @JsonProperty('barking', Boolean)
  public isBarking: boolean = false;
  @JsonProperty('other', Number)
  public other: number = 0;
}
