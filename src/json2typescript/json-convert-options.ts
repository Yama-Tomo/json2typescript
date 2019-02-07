/**
 * Internal constants.
 */
export class Settings {
  public static readonly MAPPING_PROPERTY = '__jsonconvert__mapping__';
  public static readonly MAPPER_PROPERTY = '__jsonconvert__mapper__';
  public static readonly CLASS_IDENTIFIER = '__jsonconvert__class_identifier__';
  public static readonly CLASS_OPTIONS_ENABLE_AUTO_SNAKE_CASE_MAP =
    '__jsonconvert__class_options_enable_auto_snake_case_map__';
}

/**
 * Internal mapping options for a property.
 */
export class MappingOptions {
  public classPropertyName: string = '';
  public jsonPropertyName: string[] = [];
  public expectedJsonType?: any = undefined;
  public isOptional: boolean = false;
  public customConverter: any = null;
  public isPropertyNameGiven = false;
  public isNullable = false;
  public isExpectedTypeGiven = false;
}
