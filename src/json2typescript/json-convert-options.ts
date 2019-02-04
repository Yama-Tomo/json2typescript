/**
 * Internal constants.
 */
export class Settings {
    static readonly MAPPING_PROPERTY = "__jsonconvert__mapping__";
    static readonly MAPPER_PROPERTY = "__jsonconvert__mapper__";
    static readonly CLASS_IDENTIFIER = "__jsonconvert__class_identifier__";
    static readonly CLASS_OPTIONS_ENABLE_AUTO_SNAKE_CASE_MAP = "__jsonconvert__class_options_enable_auto_snake_case_map__";
};

/**
 * Internal mapping options for a property.
 */
export class MappingOptions {
    classPropertyName: string = "";
    jsonPropertyName: string[] = [];
    expectedJsonType?: string = undefined;
    isOptional: boolean = false;
    customConverter: any = null;
    isPropertyNameGiven = false;
}
