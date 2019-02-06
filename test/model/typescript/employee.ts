import { JsonObject, JsonProperty } from '../../../src/json2typescript/json-convert-decorators';

@JsonObject({ classIdentifier: 'skill', enableAutoSnakeCaseMap: true })
export class Skill {
  @JsonProperty()
  public id: number = 0;
  @JsonProperty()
  public skillName: string = '';
  @JsonProperty({ nullable: true })
  public description: string|null = null;
}

@JsonObject({ classIdentifier: 'employee', enableAutoSnakeCaseMap: true })
export class Employee {
  @JsonProperty()
  public id: number = 0;
  @JsonProperty()
  public firstName: string = '';
  @JsonProperty('last_name')
  public _lastName: string = '';
  @JsonProperty({ type: String })
  public branchName: string = '';
  @JsonProperty()
  public age: number = 0;
  @JsonProperty({ optional: true })
  public hobby: string = '(optional)';
  @JsonProperty({ type: [Number, String] })
  public description = { length_of_service: 0, position: '', sub_position: '' };
  @JsonProperty({ type: [Skill] })
  public skillLists: Skill[] = [];
}

@JsonObject({ classIdentifier: 'invalidPropertyMapEmployee', enableAutoSnakeCaseMap: true })
export class NoSuchPropertyEmployee {
  @JsonProperty()
  public noSuchProp: string = '';
}

@JsonObject({ classIdentifier: 'invalidPropertyMapObjectTypeArgEmployee', enableAutoSnakeCaseMap: true })
export class NoSuchPropertyObjectTypeArgEmployee {
  @JsonProperty({ propName: 'no_such_prop' })
  public noSuchProp: string = '';
}

@JsonObject({ classIdentifier: 'invalidPropertyTypeEmployee', enableAutoSnakeCaseMap: true })
export class InvalidPropertyTypeEmployee {
  @JsonProperty({ type: Number })
  public branchName: string = '';
}


