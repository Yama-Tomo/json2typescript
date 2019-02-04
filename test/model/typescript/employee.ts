import {JsonObject, JsonProperty} from "../../../src/json2typescript/json-convert-decorators";

@JsonObject({ classIdentifier: 'employee', enableAutoSnakeCaseMap: true })
export class Employee {
    @JsonProperty()
    id: number = 0;

    @JsonProperty()
    firstName: string = '';

    @JsonProperty('last_name')
    _lastName: string = '';
}