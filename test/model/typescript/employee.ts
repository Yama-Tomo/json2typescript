import {JsonObject, JsonProperty} from "../../../src/json2typescript/json-convert-decorators";

@JsonObject({ classIdentifier: 'employee', enableAutoSnakeCaseMap: true })
export class Employee {
    @JsonProperty()
    id: number = 0;
    @JsonProperty()
    firstName: string = '';
    @JsonProperty('last_name')
    _lastName: string = '';
    @JsonProperty({ type: String })
    branchName: string = '';
    @JsonProperty()
    age: number = 0;
    @JsonProperty({ optional: true })
    hobby: string = '(optional)';
}

@JsonObject({ classIdentifier: 'invalidPropertyMapEmployee', enableAutoSnakeCaseMap: true })
export class NoSuchPropertyEmployee {
    @JsonProperty()
    noSuchProp: string = '';
}

@JsonObject({ classIdentifier: 'invalidPropertyMapObjectTypeArgEmployee', enableAutoSnakeCaseMap: true })
export class NoSuchPropertyObjectTypeArgEmployee {
    @JsonProperty({ propName: 'no_such_prop' })
    noSuchProp: string = '';
}

@JsonObject({ classIdentifier: 'invalidPropertyTypeEmployee', enableAutoSnakeCaseMap: true })
export class InvalidPropertyTypeEmployee {
    @JsonProperty({ type: Number })
    branchName: string = '';
}


