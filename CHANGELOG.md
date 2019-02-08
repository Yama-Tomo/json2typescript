# v2.0.3 (2019-02-08)

## Bug Fixes

* expectedTypeStrict is default enabled [here](https://github.com/Yama-Tomo/json2typescript/commit/8787c35ea3660c7721655a748332648a38c5b81f)

# v2.0.2 (2019-02-07)

## Features

* output warning when expectedType not given [#14](https://github.com/Yama-Tomo/json2typescript/pull/14)
* add nullable option to `JsonProperty` [#12](https://github.com/Yama-Tomo/json2typescript/pull/12), [#13](https://github.com/Yama-Tomo/json2typescript/pull/13)

## Refactoring

* introduced tslint and code style changes ([so big change](https://github.com/Yama-Tomo/json2typescript/pull/8))
* update packages [here](https://github.com/Yama-Tomo/json2typescript/pull/7)

# v2.0.1 (2019-02-05)

## Features

* using the declared the type of property of typescript if not given `expectedType` [#4](https://github.com/Yama-Tomo/json2typescript/pull/6)
* mapping between snake-case and camel-case automatically [#3](https://github.com/Yama-Tomo/json2typescript/pull/4)

# v1.0.9 (2019-02-03)

* track original repo changes (v1.1.0)

> ## Features
> * Added generics in order to allow the compiler to detect types, closes [#73](https://github.com/dhlab-basel/json2typescript/issues/73)
> ## Breaking Changes
> * It is not possible to serialize `undefined` anymore; instead, an error is thrown. Before this version, `json2typescript` serialized `undefined` to `null`.

## Features

* removed build files, run build when `npm install` instead

# v1.0.8 (2019-02-01)

## Features

* Refactor using type checking of Array.isArray and constructor.name instead of instanceof

# v1.0.7 (2019-01-22)

## Bug Fixes

* Included old pull request to support multiple property decorators, closes [#26](https://github.com/dhlab-basel/json2typescript/pull/26)
* Implemented pull request that fixes an issue with child class properties, closes [#80](https://github.com/dhlab-basel/json2typescript/pull/80)
* Fixed bug in constructor properties, closes [#82](https://github.com/dhlab-basel/json2typescript/issues/82)

## Features

* Allow case insensitive lookup in json deserializing, closes [#81](https://github.com/dhlab-basel/json2typescript/issues/81)

# v1.0.6 (2018-08-12)

## Bug Fixes

* Fixed serialization and deserialization of `null` and `undefined` values, closes [#33](https://github.com/dhlab-basel/json2typescript/issues/33) and [#69](https://github.com/dhlab-basel/json2typescript/issues/69)
* Adjusted README to close [#40](https://github.com/dhlab-basel/json2typescript/issues/40)
* Removed js map files, closes [#60](https://github.com/dhlab-basel/json2typescript/issues/60)
* Allowed custom class identifiers in the `@JsonObject` property, closes [#66](https://github.com/dhlab-basel/json2typescript/issues/66)

# v1.0.5 (2017-10-09)

## Bug Fixes

* Fixed issues with activated `strictNullChecks`

## Features

* Added README note about circular dependency issues
* Removed ts files from publishing, added declaration files instead

## Breaking Changes

* `json2typescript` will now throw an exception if the `JsonProperty` decorator has `undefined` as second parameter. Pass `Any` if you want to skip the type check instead or don't pass the second parameter at all. `Any` is a type from `json2typescript` and needs to be imported

# v1.0.4 (2017-09-12)

## Bug Fixes

* Fixed bug in serialization mode

# v1.0.3 (2017-09-10)

## Bug Fixes

* Fixed issue with class properties when extending another class, closes [#22](https://github.com/dhlab-basel/json2typescript/issues/22)

## Features

* Allow `json2typescript` to work with `noImplicitAny`, closes [#23](https://github.com/dhlab-basel/json2typescript/issues/23)

# v1.0.2 (2017-07-31)

## Bug Fixes

* Fixed issue with `ValueCheckingMode` by using an enum instead of a nested class, closes [#10](https://github.com/dhlab-basel/json2typescript/issues/10) and [#11](https://github.com/dhlab-basel/json2typescript/issues/11) 
* Added missing js references, closes [#11](https://github.com/dhlab-basel/json2typescript/issues/11) and [#16](https://github.com/dhlab-basel/json2typescript/issues/16)

## Features

* Allow serialization the same way as deserialization, closes [#4](https://github.com/dhlab-basel/json2typescript/issues/4)
* Added smart methods `serialize()` and `deserialize()` for simplified usage
* Added custom converters, closes [#6](https://github.com/dhlab-basel/json2typescript/issues/6)
* Use class methods instead of static methods, closes [#14](https://github.com/dhlab-basel/json2typescript/issues/14)

## Breaking Changes

* Use an instance of `JsonConvert` and its class methods instead of the static methods
* The static class properties `valueCheckingMode` and `debugMode` are not static anymore. `debugMode` has been renamed to `operationMode`. Their values should be assigned through the given enums with the same name
* Removed the string method `deserializeString()` due to the fact that it is the same as `jsonConvert.deserialize()` combined with `JSON.stringify()`

# 0.9.6  (2017-01-18) 
Fixed errors in ReadMe and small bug on JsonConvert.

# 0.9.5  (2017-12-11): 
New method for deserializing array of objects.

# 0.9.4  (2017-11-22): 
Class properties are now not overridden to `undefined` if there is no decorator and no matching json value.

# 0.9.3  (2017-11-16): 
It is now possible to map an JSON object to an TypeScript array, then the object keys become the array keys. Also, class properties can be set to optional. See below in the chapter "decorators" for more information.

# 0.9.2  (2017-10-10): 
Added method `serializeString()`, changed property names and behaviour.

# 0.9.1 (2017-10-06): 
First version released to the public.