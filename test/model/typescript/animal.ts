import { JsonObject, JsonProperty } from '../../../src/json2typescript/json-convert-decorators';
import { Any } from '../../../src/json2typescript/any';

import { DateConverter } from './date-converter';
import { Human } from './human';

@JsonObject('Animal')
export class Animal {
  @JsonProperty('name', String)
  public name: string = '';
  @JsonProperty('owner', Human, true)
  public owner: Human|null = null;
  @JsonProperty('birthdate', DateConverter, true)
  public birthdate: Date|null = null;
  @JsonProperty('friends', Any, true)
  public friends: Any[]|null = null;
}
