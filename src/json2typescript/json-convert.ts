/* tslint:disable:no-console */

import { OperationMode, PropertyMatchingRule, ValueCheckingMode } from './json-convert-enums';
import { MappingOptions, Settings } from './json-convert-options';
import { Any } from './any';
import * as lodash from 'lodash';

/**
 * Offers a simple API for mapping JSON objects to TypeScript/JavaScript classes and vice versa.
 *
 * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
 * @see https://www.npmjs.com/package/json2typescript full documentation on NPM
 */
export class JsonConvert {
  /**
   * Determines how the JsonConvert class instance should operate.
   *
   * You may assign three different values:
   * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
   * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
   * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
   */
  private _operationMode: number = OperationMode.ENABLE;

  /**
   * Determines which types are allowed to be null.
   *
   * You may assign three different values:
   * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
   * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
   * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
   */
  private _valueCheckingMode: number = ValueCheckingMode.ALLOW_OBJECT_NULL;

  /**
   * Determines whether primitive types should be checked.
   * If true, it will be allowed to assign primitive to other primitive types.
   */
  private _ignorePrimitiveChecks: boolean = false;

  /**
   * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
   *
   * You may assign the following values:
   * - CASE_STRICT: JSON properties need to match exactly the names in the decorators
   * - CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
   */
  private _propertyMatchingRule: number = PropertyMatchingRule.CASE_STRICT;

  /**
   * Constructor.
   *
   * To learn more about the params, check the documentation of the equally named class properties.
   *
   * @param operationMode optional param (default: OperationMode.ENABLE)
   * @param valueCheckingMode optional param (default: ValueCheckingMode.ALLOW_OBJECT_NULL)
   * @param ignorePrimitiveChecks optional param (default: false)
   * @param propertyMatchingRule optional param (default: PropertyMatchingRule.CASE_STRICT)
   */
  constructor(operationMode?: number, valueCheckingMode?: number,
              ignorePrimitiveChecks?: boolean, propertyMatchingRule?: number) {
    if (operationMode !== undefined && operationMode in OperationMode) {
      this.operationMode = operationMode;
    }

    if (valueCheckingMode !== undefined && valueCheckingMode in ValueCheckingMode) {
      this.valueCheckingMode = valueCheckingMode;
    }

    if (ignorePrimitiveChecks !== undefined) {
      this.ignorePrimitiveChecks = ignorePrimitiveChecks;
    }

    if (propertyMatchingRule !== undefined) {
      this.propertyMatchingRule = propertyMatchingRule;
    }
  }

  /**
   * Determines how the JsonConvert class instance should operate.
   *
   * You may assign three different values:
   * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
   * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
   * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
   * @returns {number}
   */
  get operationMode(): number {
    return this._operationMode;
  }

  /**
   * Determines how the JsonConvert class instance should operate.
   *
   * You may assign three different values:
   * - OperationMode.DISABLE: json2typescript will be disabled, no type checking or mapping is done
   * - OperationMode.ENABLE: json2typescript is enabled, but only errors are logged
   * - OperationMode.LOGGING: json2typescript is enabled and detailed information is logged
   * @param value
   */
  set operationMode(value: number) {
    if (value in OperationMode) {
      this._operationMode = value;
    }
  }

  /**
   * Determines which types are allowed to be null.
   *
   * You may assign three different values:
   * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
   * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
   * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
   *
   * @returns {number}
   */
  get valueCheckingMode(): number {
    return this._valueCheckingMode;
  }

  /**
   * Determines which types are allowed to be null.
   *
   * You may assign three different values:
   * - ValueCheckingMode.ALLOW_NULL: all given values in the JSON are allowed to be null
   * - ValueCheckingMode.ALLOW_OBJECT_NULL: objects in the JSON are allowed to be null, primitive types are not allowed to be null
   * - ValueCheckingMode.DISALLOW_NULL: no null values are tolerated in the JSON
   *
   * @param value
   */
  set valueCheckingMode(value: number) {
    if (value in ValueCheckingMode) {
      this._valueCheckingMode = value;
    }
  }

  /**
   * Determines whether primitive types should be checked.
   * If true, it will be allowed to assign primitive to other primitive types.
   *
   * @returns {boolean}
   */
  get ignorePrimitiveChecks(): boolean {
    return this._ignorePrimitiveChecks;
  }

  /**
   * Determines whether primitive types should be checked.
   * If true, it will be allowed to assign primitive to other primitive types.
   *
   * @param value
   */
  set ignorePrimitiveChecks(value: boolean) {
    this._ignorePrimitiveChecks = value;
  }

  /**
   * Determines the rule of how JSON properties shall be matched with class properties during deserialization.
   *
   * You may assign the following values:
   * - CASE_STRICT: JSON properties need to match exactly the names in the decorators
   * - CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
   * @returns {number}
   */
  get propertyMatchingRule(): number {
    return this._propertyMatchingRule;
  }

  /**
   *  Determines the rule of how JSON properties shall be matched with class properties during deserialization.
   *
   * You may assign the following values:
   * - CASE_STRICT: JSON properties need to match exactly the names in the decorators
   * - CASE_INSENSITIVE: JSON properties need to match names in the decorators, but names they are not case sensitive
   * @param value
   */
  set propertyMatchingRule(value: number) {
    if (value in PropertyMatchingRule) {
      this._propertyMatchingRule = value;
    }
  }

  /**
   * Tries to serialize a TypeScript object or array of objects to JSON.
   *
   * @param data object or array of objects
   *
   * @returns the JSON object
   *
   * @throws an Error in case of failure
   *
   * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
   * @see https://www.npmjs.com/package/json2typescript full documentation
   */
  public serialize<T>(data: T|T[]): any|any[] {
    if (this.operationMode === OperationMode.DISABLE) {
      return data;
    }

    // Call the appropriate method depending on the type
    if (Array.isArray(data)) {
      return this.serializeArray(data);
    }

    // careful: an array is an object in TypeScript!
    if (typeof data === 'object') {
      return this.serializeObject(data);
    }

    throw new Error(
      'Fatal error in JsonConvert. ' +
      'Passed parameter data in JsonConvert.serialize() is not in valid format (object or array).' +
      '\n',
    );
  }

  /**
   * Tries to serialize a TypeScript object to a JSON object.
   *
   * @param instance TypeScript instance
   *
   * @returns the JSON object
   *
   * @throws an Error in case of failure
   *
   * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
   * @see https://www.npmjs.com/package/json2typescript full documentation
   */
  public serializeObject<T>(instance: T): any {
    if (this.operationMode === OperationMode.DISABLE) {
      return instance;
    }

    // Check if the passed type is allowed
    if (instance === undefined) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter instance in JsonConvert.serializeObject() is undefined. This is not a valid JSON format.\n',
      );
    }

    if (instance === null) {
      if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
        throw new Error('Fatal error in JsonConvert. ' +
          'Passed parameter instance in JsonConvert.serializeObject() ' +
          'is undefined. You have specified to disallow null values.\n',
        );
      }

      return instance;
    }

    if (typeof instance !== 'object' || Array.isArray(instance)) {
      throw new Error(
        'Fatal error in JsonConvert. ' +
        'Passed parameter instance in JsonConvert.serializeObject() is not of type object.' +
        '\n',
      );
    }

    // Now serialize and return the plain object
    if (this.operationMode === OperationMode.LOGGING) {
      console.log('----------');
      console.log('Receiving JavaScript instance:');
      console.log(instance);
    }

    const jsonObject: any = {};

    // Loop through all initialized class properties
    for (const propertyKey of Object.keys(instance)) {
      this.serializeObject_loopProperty(instance, propertyKey, jsonObject);
    }

    if (this.operationMode === OperationMode.LOGGING) {
      console.log('Returning JSON object:');
      console.log(jsonObject);
      console.log('----------');
    }

    return jsonObject;
  }

  /**
   * Tries to serialize a TypeScript array to a JSON array.
   *
   * @param instanceArray array of TypeScript instances
   *
   * @returns the JSON array
   *
   * @throws an Error in case of failure
   *
   * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
   * @see https://www.npmjs.com/package/json2typescript full documentation
   */
  public serializeArray<T>(instanceArray: T[]): any[] {
    if (this.operationMode === OperationMode.DISABLE) {
      return instanceArray;
    }

    // Check if the passed type is allowed
    if (instanceArray === undefined) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter instanceArray in JsonConvert.serializeArray() is undefined. ' +
        'This is not a valid JSON format.\n',
      );
    }

    if (instanceArray === null) {
      if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
        throw new Error('Fatal error in JsonConvert. ' +
          'Passed parameter instanceArray in JsonConvert.serializeArray() is undefined. ' +
          'You have specified to disallow null values.\n',
        );
      }

      return instanceArray;
    }

    if (typeof instanceArray !== 'object' || Array.isArray(instanceArray) === false) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter instanceArray in JsonConvert.serializeArray() is not of type array.\n',
      );
    }

    // Now serialize and return the plain object
    if (this.operationMode === OperationMode.LOGGING) {
      console.log('----------');
      console.log('Receiving JavaScript array:');
      console.log(instanceArray);
    }

    const jsonArray: any[] = [];

    // Loop through all array elements
    for (const classInstance of instanceArray as any) {
      jsonArray.push(this.serializeObject(classInstance));
    }

    if (this.operationMode === OperationMode.LOGGING) {
      console.log('Returning JSON array:');
      console.log(jsonArray);
      console.log('----------');
    }
    return jsonArray;
  }

  /**
   * Tries to deserialize given JSON to a TypeScript object or array of objects.
   *
   * @param json the JSON as object or array
   * @param classReference the class reference
   *
   * @returns the deserialized data (TypeScript instance or array of TypeScript instances)
   *
   * @throws an Error in case of failure
   *
   * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
   * @see https://www.npmjs.com/package/json2typescript full documentation
   */
  public deserialize<T>(json: any, classReference: new() => T): T|T[] {
    if (this.operationMode === OperationMode.DISABLE) {
      return json;
    }

    // Call the appropriate method depending on the type
    if (Array.isArray(json)) {
      return this.deserializeArray(json, classReference);
    }

    // careful: an array is an object in TypeScript!
    if (typeof json === 'object') {
      return this.deserializeObject(json, classReference);
    }

    throw new Error('Fatal error in JsonConvert. ' +
      'Passed parameter json in JsonConvert.deserialize() is not in valid JSON format (object or array).\n',
    );
  }

  /**
   * Tries to deserialize a JSON object to a TypeScript object.
   *
   * @param jsonObject the JSON object
   * @param classReference the class reference
   *
   * @returns the deserialized TypeScript instance
   *
   * @throws an Error in case of failure
   *
   * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
   * @see https://www.npmjs.com/package/json2typescript full documentation
   */
  public deserializeObject<T>(jsonObject: any, classReference: new() => T): T {
    if (this.operationMode === OperationMode.DISABLE) {
      return jsonObject;
    }

    // Check if the passed type is allowed
    if (jsonObject === undefined) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter jsonObject in JsonConvert.deserializeObject() is undefined. ' +
        'This is not a valid JSON format.\n',
      );
    }

    if (jsonObject === null) {
      if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
        throw new Error('Fatal error in JsonConvert. ' +
          'Passed parameter jsonObject in JsonConvert.deserializeObject() is undefined. ' +
          'You have specified to disallow null values.\n',
        );
      }
      return jsonObject;
    }

    if (typeof jsonObject !== 'object' || Array.isArray(jsonObject)) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter jsonObject in JsonConvert.deserializeObject() is not of type object.\n',
      );
    }

    // Now deserialize and return the instance
    if (this.operationMode === OperationMode.LOGGING) {
      console.log('----------');
      console.log('Receiving JSON object:');
      console.log(jsonObject);
    }

    const instance: T = new classReference();

    // Loop through all initialized class properties
    for (const propertyKey of Object.keys(instance)) {
      this.deserializeObject_loopProperty(instance, propertyKey, jsonObject);
    }

    if (this.operationMode === OperationMode.LOGGING) {
      console.log('Returning CLASS instance:');
      console.log(instance);
      console.log('----------');
    }

    return instance;
  }

  /**
   * Tries to deserialize a JSON array to a TypeScript array.
   *
   * @param jsonArray the JSON array
   * @param classReference the object class
   *
   * @returns the deserialized array of TypeScript instances
   *
   * @throws an Error in case of failure
   *
   * @author Andreas Aeschlimann, DHlab, University of Basel, Switzerland
   * @see https://www.npmjs.com/package/json2typescript full documentation
   */
  public deserializeArray<T>(jsonArray: any[], classReference: new() => T): T[] {
    if (this.operationMode === OperationMode.DISABLE) {
      return jsonArray;
    }

    // Check if the passed type is allowed
    if (jsonArray === undefined) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter jsonArray in JsonConvert.deserializeObject() is undefined. ' +
        'This is not a valid JSON format.\n',
      );
    }

    if (jsonArray === null) {
      if (this.valueCheckingMode === ValueCheckingMode.DISALLOW_NULL) {
        throw new Error('Fatal error in JsonConvert. ' +
          'Passed parameter jsonArray in JsonConvert.deserializeObject() is undefined. ' +
          'You have specified to disallow null values.\n',
        );
      }

      return jsonArray;
    }

    if (typeof jsonArray !== 'object' || Array.isArray(jsonArray) === false) {
      throw new Error('Fatal error in JsonConvert. ' +
        'Passed parameter jsonArray in JsonConvert.deserializeArray() is not of type array.\n',
      );
    }

    // Now deserialize and return the array
    if (this.operationMode === OperationMode.DISABLE) {
      return jsonArray;
    }

    if (this.operationMode === OperationMode.LOGGING) {
      console.log('----------');
      console.log('Receiving JSON array:');
      console.log(jsonArray);
    }

    const array: T[] = [];

    // Loop through all array elements
    for (const jsonObject of jsonArray) {
      array.push(this.deserializeObject<T>(jsonObject, classReference));
    }

    if (this.operationMode === OperationMode.LOGGING) {
      console.log('Returning array of CLASS instances:');
      console.log(array);
      console.log('----------');
    }

    return array;
  }

  /**
   * Tries to find the JSON mapping for a given class property and finally assign the value.
   *
   * @param instance the instance of the class
   * @param classPropertyName the property name
   * @param json the JSON object
   *
   * @throws throws an Error in case of failure
   */
  private serializeObject_loopProperty(instance: any, classPropertyName: string, json: any): void {
    // Check if a JSON-object mapping is possible for a property
    const mappingOptions: MappingOptions|null = this.getClassPropertyMappingOptions(instance, classPropertyName);
    if (mappingOptions === null) {
      return;
    }

    const isConvertSnakeCase = instance[Settings.CLASS_OPTIONS_ENABLE_AUTO_SNAKE_CASE_MAP] &&
      !mappingOptions.isPropertyNameGiven;

    // Get expected and real values
    const jsonPropertyName = isConvertSnakeCase ?
      lodash.snakeCase(mappingOptions.jsonPropertyName[0]) : mappingOptions.jsonPropertyName[0];

    const isOptional = mappingOptions.isOptional;
    const classInstancePropertyValue = instance[classPropertyName];

    // Check if the json value exists
    if (typeof classInstancePropertyValue === 'undefined') {
      if (isOptional) {
        return;
      }

      throw new Error('Fatal error in JsonConvert. ' +
        `Failed to map the JavaScript instance of class "${instance[Settings.CLASS_IDENTIFIER]}" to ` +
        `JSON because the defined class property "${classPropertyName}" does not exist or is not defined:\n\n` +
        `\tClass property: \n\t\t${classPropertyName}\n\n` +
        `\tJSON property: \n\t\t${jsonPropertyName}\n\n`,
      );
    }

    if (classInstancePropertyValue === null &&
      (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL || mappingOptions.isNullable)) {
      json[jsonPropertyName] = null;
      return;
    }

    const expectedJsonType = mappingOptions.expectedJsonType;
    const customConverter = mappingOptions.customConverter;

    // Map the property
    try {
      // Each class property might have multiple decorators
      // only use the JSON property name as defined in the first one
      json[jsonPropertyName] = customConverter !== null ?
        customConverter.serialize(classInstancePropertyValue) :
        this.verifyProperty(expectedJsonType, classInstancePropertyValue, true);
    } catch (e) {
      throw new Error('Fatal error in JsonConvert. ' +
        `Failed to map the JavaScript instance of class "${instance[Settings.CLASS_IDENTIFIER]}" to ` +
        'JSON because of a type error.\n\n' +
        `\tClass property: \n\t\t${classPropertyName}\n\n` +
        `\tClass property value: \n\t\t${classInstancePropertyValue}\n\n` +
        `\tExpected type: \n\t\t${this.getExpectedType(expectedJsonType, true)}\n\n` +
        `\tRuntime type: \n\t\t${this.getTrueType(classInstancePropertyValue)}\n\n` +
        `\tJSON property: \n\t\t${jsonPropertyName}\n\n` +
        `${e.message}\n`,
      );
    }
  }

  /**
   * Tries to find the JSON mapping for a given class property and finally assign the value.
   *
   * @param instance the instance of the class
   * @param classPropertyName the property name
   * @param json the JSON object
   *
   * @throws throws an Error in case of failure
   */
  private deserializeObject_loopProperty(instance: any, classPropertyName: string, json: any): void {
    const mappingOptions: MappingOptions|null = this.getClassPropertyMappingOptions(instance, classPropertyName);
    if (mappingOptions === null) {
      return;
    }

    const isConvertSnakeCase = instance[Settings.CLASS_OPTIONS_ENABLE_AUTO_SNAKE_CASE_MAP] &&
      !mappingOptions.isPropertyNameGiven;

    // Get expected and real values
    const jsonPropertyName = isConvertSnakeCase ?
      lodash.snakeCase(mappingOptions.jsonPropertyName[0]) : mappingOptions.jsonPropertyName[0];

    const isOptional = mappingOptions.isOptional;
    const jsonValue = (() => {
      try {
        return this.getObjectValue(json, jsonPropertyName);
      } catch (e) {
        return undefined;
      }
    })();

    // Check if the json value exists
    if (typeof jsonValue === 'undefined') {
      if (isOptional) {
        return;
      }

      throw new Error('Fatal error in JsonConvert. ' +
        `Failed to map the JSON object to the class "${instance[Settings.CLASS_IDENTIFIER]}" ` +
        `because the defined JSON property "${jsonPropertyName}" does not exist:\n\n` +
        `\tClass property: \n\t\t${classPropertyName}\n\n` +
        `\tJSON property: \n\t\t${jsonPropertyName}\n\n`,
      );
    }

    if (jsonValue === null && (this.valueCheckingMode === ValueCheckingMode.ALLOW_NULL || mappingOptions.isNullable)) {
      instance[classPropertyName] = null;
      return;
    }

    const expectedJsonType: any = mappingOptions.expectedJsonType;
    const customConverter: any = mappingOptions.customConverter;

    // Map the property
    try {
      instance[classPropertyName] = customConverter !== null ?
        customConverter.deserialize(jsonValue) : this.verifyProperty(expectedJsonType, jsonValue);
    } catch (e) {
      throw new Error('Fatal error in JsonConvert. ' +
        `Failed to map the JSON object to the class "${instance[Settings.CLASS_IDENTIFIER]}" ` +
        'because of a type error.\n\n' +
        `\tClass property: \n\t\t${classPropertyName}\n\n` +
        `\tExpected type: \n\t\t${this.getExpectedType(expectedJsonType, true)}\n\n` +
        `\tJSON property: \n\t\t${jsonPropertyName}\n\n` +
        `\tJSON type: \n\t\t${this.getJsonType(jsonValue)}\n\n` +
        `\tJSON value: \n\t\t${JSON.stringify(jsonValue)}\n\n` +
        `${e.message}\n`,
      );
    }
  }

  /**
   * Gets the mapping options of a given class property.
   *
   * @param instance any class instance
   * @param {string} propertyName any property name
   *
   * @returns {MappingOptions|null}
   */
  private getClassPropertyMappingOptions(instance: any, propertyName: string): MappingOptions|null {
    const mappings = instance[Settings.MAPPING_PROPERTY];

    // Check if mapping is defined
    if (typeof mappings === 'undefined') {
      return null;
    }

    // Get direct mapping if possible
    const directMappingName = instance[Settings.CLASS_IDENTIFIER] + '.' + propertyName;
    if (typeof mappings[directMappingName] !== 'undefined') {
      return mappings[directMappingName];
    }

    // No mapping was found, try to find some
    const indirectMappingNames = Object.keys(mappings)
    // use endsWidth in later versions
      .filter((key) => key.match('\\.' + propertyName + '$'));

    if (indirectMappingNames.length > 0) {
      return mappings[indirectMappingNames[0]];
    }

    return null;
  }

  /**
   * Compares the type of a given value with an internal expected json type.
   * Either returns the resulting value or throws an exception.
   *
   * @param expectedJsonType the expected json type for the property
   * @param value the property value to verify
   * @param serialize optional param (default: false), if given, we are in serialization mode
   *
   * @returns returns the resulted mapped property
   *
   * @throws an error in case of failure
   */
  private verifyProperty(expectedJsonType: any, value: any, serialize?: boolean): any {
    const type = this.getExpectedType(expectedJsonType).toLowerCase();

    // Map immediately if we don't care about the type
    if (type === 'any') {
      return value;
    }

    if (type !== 'array') {
      // Check if attempt and expected was 1-d
      if (!Array.isArray(value)) {
        return this.verifyPropertyElement(expectedJsonType, type, value, serialize);
      }

      throw new Error('\tReason: Given value is array, but expected a non-array type.');
    }

    if (type === 'array') {
      // Check if attempt and expected was n-d
      if (Array.isArray(value)) {
        return this.verifyPropertyArray(expectedJsonType, value, serialize);
      }

      // Check if attempt was 1-d and expected was n-d
      if (value instanceof Object) {
        return this.verifyPropertyObject(expectedJsonType, value, serialize);
      }

      if (value === null) {
        throw new Error('\tReason: Given value is null.');
      }

      throw new Error('\tReason: Expected type is array, but given value is non-array.');
    }

    // All other attempts are fatal
    throw new Error('\tReason: Mapping failed because of an unknown error.');
  }

  private verifyPropertyElement(expectedJsonType: any, type: string, value: any, serialize?: boolean) {
    // Check the type
    // only decorated custom objects have this injected property
    if (typeof expectedJsonType !== 'undefined' &&
      expectedJsonType.prototype.hasOwnProperty(Settings.CLASS_IDENTIFIER)) {

      // Check if we have null value
      if (value !== null) {
        return serialize ? this.serializeObject(value) : this.deserializeObject(value, expectedJsonType);
      }

      throw new Error('\tReason: Given value is null.');
    }

    // general object
    if (type === 'any') {
      // Check if we have null value
      if (value !== null) {
        return value;
      }

      throw new Error('\tReason: Given value is null.');
    }

    // otherwise check for a primitive type
    if (type === 'string' || type === 'number' || type === 'boolean') {
      // Check if we have null value
      if (value === null) {
        throw new Error('\tReason: Given value is null.');
      }

      // Check if the types match
      if ( // primitive types match
        this.ignorePrimitiveChecks ||
        (type === 'string' && typeof value === 'string') ||
        (type === 'number' && typeof value === 'number') ||
        (type === 'boolean' && typeof value === 'boolean')
      ) {
        return value;
      }

      throw new Error('\tReason: Given object does not match the expected primitive type.');
    }

    throw new Error(
      '\tReason: Expected type is unknown. There might be multiple reasons for this:\n' +
      '\t- You are missing the decorator @JsonObject (for object mapping)\n' +
      '\t- You are missing the decorator @JsonConverter (for custom mapping) before your class definition\n' +
      '\t- Your given class is undefined in the decorator because of circular dependencies',
    );
  }

  private verifyPropertyArray(expectedJsonType: any[], value: any, serialize?: boolean) {
    const array: any[] = [];

    // No data given, so return empty value
    if (value.length === 0) {
      return array;
    }

    // We obviously don't care about the type, so return the value as is
    if (expectedJsonType.length === 0) {
      return value;
    }

    // Loop through the data. Both type and value are at least of length 1
    const autofillType = expectedJsonType.length < value.length;
    for (let i = 0; i < value.length; i++) {
      if (autofillType && i >= expectedJsonType.length) {
        expectedJsonType[i] = expectedJsonType[i - 1];
      }

      array[i] = this.verifyProperty(expectedJsonType[i], value[i], serialize);
    }

    return array;
  }

  private verifyPropertyObject(expectedJsonType: any[], value: any, serialize?: boolean) {
    const object: any = {};
    const propLength = Object.keys(value).length;

    // No data given, so return empty value
    if (propLength === 0) {
      return object;
    }

    // We obviously don't care about the type, so return the json value as is
    if (expectedJsonType.length === 0) {
      return value;
    }

    // Loop through the data. Both type and value are at least of length 1
    const autofillType: boolean = expectedJsonType.length < propLength;
    let i = 0;
    for (const key of Object.keys(value)) {
      if (autofillType && i >= expectedJsonType.length) {
        expectedJsonType[i] = expectedJsonType[i - 1];
      }

      object[key] = this.verifyProperty(expectedJsonType[i], value[key], serialize);
      i++;
    }

    return object;
  }

  /**
   * Gets the value of an object for a given value.
   * If the object does not have the specific key, an Error is thrown.
   *
   * @param data
   * @param key
   *
   * @returns returns the value
   *
   * @throws an Error in case of the key was not found in the object
   */
  private getObjectValue(data: any, key: string): any {
    // If we do not care about the case of the key, ad
    if (this.propertyMatchingRule === PropertyMatchingRule.CASE_INSENSITIVE) {

      // Create a mapping of the keys: keys[lowercase]=normalcase
      const keyMapping: any = Object.keys(data).reduce((keys: string[], _key: string) => {
        keys[_key.toLowerCase() as any] = _key;
        return keys;
      }, {});

      // Define the new key
      key = keyMapping[key.toLowerCase()];
    }

    // Throw an error if the key is not in the object
    if (!(key in data)) {
      throw new Error();
    }

    return data[key];
  }

  /**
   * Returns a string representation of the expected json type.
   *
   * @param expectedJsonType the expected type given from the decorator
   *
   * @param showIncludeValuesWhenArray
   * @returns {string} the string representation
   */
  private getExpectedType(expectedJsonType: any, showIncludeValuesWhenArray = false): string {
    if (Array.isArray(expectedJsonType)) {
      if (!showIncludeValuesWhenArray) {
        return 'array';
      }

      const stack = ['['];
      for (let i = 0; i < expectedJsonType.length; i++) {
        if (i > 0) {
          stack.push(',');
        }
        stack.push(this.getExpectedType(expectedJsonType[i], showIncludeValuesWhenArray));
      }
      stack.push(']');

      return stack.join('');
    }

    if (expectedJsonType === Any || expectedJsonType === null || expectedJsonType === Object) {
      return 'any';
    }

    if (expectedJsonType === String || expectedJsonType === Boolean || expectedJsonType === Number) {
      return (new expectedJsonType()).constructor.name.toLowerCase();
    }

    if (typeof expectedJsonType === 'function') {
      return (new expectedJsonType()).constructor.name;
    }

    if (expectedJsonType === undefined) {
      return 'undefined';
    }

    return '?????';
  }

  /**
   * Returns a string representation of the JSON value type.
   *
   * @param jsonValue the JSON value
   *
   * @returns {string} the string representation
   */
  private getJsonType(jsonValue: any): string {
    if (jsonValue === null) {
      return 'null';
    }

    if (Array.isArray(jsonValue)) {
      const stack = ['['];
      for (let i = 0; i < jsonValue.length; i++) {
        if (i > 0) {
          stack.push(',');
        }

        stack.push(this.getJsonType(jsonValue[i]));
      }
      stack.push(']');

      return stack.join('');
    }

    return typeof jsonValue;
  }

  /**
   * Returns a string representation of the true TypeScript type.
   *
   * @param trueValue the true value
   *
   * @returns {string} the string representation
   */
  private getTrueType(trueValue: any): string {
    return typeof trueValue;
  }
}
