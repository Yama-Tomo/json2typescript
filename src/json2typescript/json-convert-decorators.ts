import { MappingOptions, Settings } from './json-convert-options';
import { Any } from './any';
import 'reflect-metadata';

/**
 * Decorator of a class that is a custom converter.
 *
 * @param target the class
 */
export function JsonConverter(target: any) {
  target[Settings.MAPPER_PROPERTY] = '';
}

/**
 * Decorator of a class that comes from a JSON object.
 *
 * @param target the class identifier or the class
 *
 * @returns {any}
 *
 * @throws Error
 */
interface JsonObjectObjectTypeArg {
  classIdentifier?: string;
  enableAutoSnakeCaseMap?: boolean;
}

const isJsonObjectObjectTypeArg = (v: any): v is JsonObjectObjectTypeArg => typeof v === 'object';

export function JsonObject(param?: string|JsonObjectObjectTypeArg|any): any {
  const decorator = (target: any): void => {
    target.prototype[Settings.CLASS_IDENTIFIER] = classIdentifier(target);
    target.prototype[Settings.CLASS_OPTIONS_ENABLE_AUTO_SNAKE_CASE_MAP] = enableAutoSnakeCaseMap;

    const mapping: any = target.prototype[Settings.MAPPING_PROPERTY];

    // Make sure we replace the mapping names of all properties of this class
    if (!mapping) {
      return;
    }

    const unmappedKeys = Object.keys(mapping)
      .filter((val) => val.indexOf(`${Settings.CLASS_IDENTIFIER}.`) === 0);

    for (const key of unmappedKeys) {
      mapping[key.replace(Settings.CLASS_IDENTIFIER, target.prototype[Settings.CLASS_IDENTIFIER])] = mapping[key];

      // We must delete the mapping without associated class since it will
      // cause issues with inheritance of mappings and overrides.
      delete mapping[key];
    }
  };


  // target is the constructor or the custom class name
  const classIdentifier = (target: any) => {
    if (typeof param === 'string') {
      return param;
    }

    if (isJsonObjectObjectTypeArg(param) && param.classIdentifier) {
      return param.classIdentifier;
    }

    return target.name as string;
  };

  const enableAutoSnakeCaseMap = isJsonObjectObjectTypeArg(param) && param.enableAutoSnakeCaseMap;

  const type: string = typeof param;
  if (type === 'string' || type === 'undefined' || isJsonObjectObjectTypeArg(param)) {
    return decorator;
  }

  if (type === 'function') {
    return decorator(param);
  }

  throw new Error(
    'Fatal error in JsonConvert. ' +
    'It\'s mandatory to pass a string as parameter in the @JsonObject decorator.\n\n' +
    'Use either @JsonObject or @JsonObject(classId) where classId is a string.\n\n',
  );
}

/**
 * Decorator of a class property that comes from a JSON object.
 *
 * The second param can be either a type or a class of a custom converter.
 *
 * Use the following notation for the type:
 * - Primitive type: String|Number|Boolean
 * - Custom type: YourClassName
 * - Array type: [String|Number|Boolean|YourClassName]
 *
 * If you decide to use a custom converter, make sure this class implements the interface JsonCustomConvert from this package.
 *
 * @param jsonPropertyName optional param (default: classPropertyName) the property name in the expected JSON object
 * @param conversionOption optional param (default: Any), should be either the expected type (String|Boolean|Number|etc) or a custom converter class implementing JsonCustomConvert
 * @param isOptional optional param (default: false), if true, the json property does not have to be present in the object
 *
 * @returns {(target:any, classPropertyName:string)=>void}
 */
interface JsonPropertyObjectTypeArg {
  propName?: string;
  type?: any;
  optional?: boolean;
  nullable?: boolean;
}

export function JsonProperty(propName?: string, expectedType?: any, isOptional?: boolean, isNullable?: boolean): any;
export function JsonProperty(params?: JsonPropertyObjectTypeArg): any;
export function JsonProperty(...params: any[]): any {
  return (target: any, classPropertyName: string): void => {
    // target is the class
    const getPropName = (propName?: string) => ({
      jsonPropertyName: propName ? propName : classPropertyName,
      isPropertyNameGiven: !!propName,
    });

    const getExpectedType = (type?: any) => {
      const _expectedType = () => {
        if (type) {
          return type;
        }

        const designType = Reflect.getMetadata('design:type', target, classPropertyName);
        if (designType.name !== 'Array' && designType.name !== 'Object') {
          return designType;
        }
        return Any;
      };

      return {
        expectedType: _expectedType(),
        isExpectedTypeGiven: !!type,
      };
    };

    const {
      jsonPropertyName, expectedType, isOptional, isPropertyNameGiven, isExpectedTypeGiven, isNullable,
    } = (() => {
      const isObjectTypeArgGiven = params.length === 1 && typeof params[0] !== 'string';
      if (isObjectTypeArgGiven) {
        const param = params[0] as JsonPropertyObjectTypeArg;

        return {
          ...getPropName(param.propName),
          ...getExpectedType(param.type),
          ...{ isOptional: !!param.optional, isNullable: !!param.nullable },
        };
      } else {
        return {
          ...getPropName(params[0]),
          ...getExpectedType(params[1]),
          ...{ isOptional: !!params[2], isNullable: !!params[3] },
        };
      }
    })();

    if (typeof target[Settings.MAPPING_PROPERTY] === 'undefined') {
      target[Settings.MAPPING_PROPERTY] = [];
    }

    const jsonPropertyMappingOptions = new MappingOptions();
    jsonPropertyMappingOptions.classPropertyName = classPropertyName;
    jsonPropertyMappingOptions.jsonPropertyName.push(jsonPropertyName);
    jsonPropertyMappingOptions.isOptional = isOptional;
    jsonPropertyMappingOptions.isPropertyNameGiven = isPropertyNameGiven;
    jsonPropertyMappingOptions.isNullable = isNullable;
    jsonPropertyMappingOptions.isExpectedTypeGiven = isExpectedTypeGiven;

    // Check if expectedType is a type or a custom converter.
    const hasCustomConverter = typeof expectedType !== 'undefined' && expectedType !== null &&
      typeof expectedType[Settings.MAPPER_PROPERTY] !== 'undefined';
    if (hasCustomConverter) {
      jsonPropertyMappingOptions.customConverter = new expectedType();
    } else {
      jsonPropertyMappingOptions.expectedJsonType = expectedType;
    }

    // Save the mapping info
    const mappingName = Settings.CLASS_IDENTIFIER + '.' + classPropertyName;
    const isAlreadyDecorate = typeof target[Settings.MAPPING_PROPERTY][mappingName] !== 'undefined';
    if (!isAlreadyDecorate) {
      // First decorator for this classProperty
      target[Settings.MAPPING_PROPERTY][mappingName] = jsonPropertyMappingOptions;
    } else {
      // Second decorator - just add the alternative JSON-name for this classProperty
      target[Settings.MAPPING_PROPERTY][mappingName].jsonPropertyName.unshift(jsonPropertyName);
    }
  };
}
