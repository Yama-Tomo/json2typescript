import { JsonConvert } from '../src/json2typescript/json-convert';
import { OperationMode, PropertyMatchingRule, ValueCheckingMode } from '../src/json2typescript/json-convert-enums';
import { Any } from '../src/json2typescript/any';
import { Settings } from '../src/json2typescript/json-convert-options';
import { Human } from './model/typescript/human';
import { Cat } from './model/typescript/cat';
import { Dog } from './model/typescript/dog';
import { IHuman } from './model/json/i-human';
import { ICat } from './model/json/i-cat';

describe('Unit tests', () => {

  describe('JsonConvert', () => {
    // JSON DATA
    const human1JsonObject: IHuman = {
      givenName: 'Andreas',
      lastName: 'Muster',
    };

    const human2JsonObject: IHuman = {
      givenName: 'Michael',
      name: 'Meier',
    };

    const cat1JsonObject: ICat = {
      catName: 'Meowy',
      district: 100,
      owner: human1JsonObject,
      talky: true,
      other: 'cute',
      birthdate: null,
      friends: [],
    };

    const cat2JsonObject: ICat = {
      catName: 'Links',
      district: 50,
      owner: human2JsonObject,
      talky: true,
      other: 'sweet',
      birthdate: '2014-09-01',
      friends: null,
    };

    // TYPESCRIPT INSTANCES
    const human1 = new Human();
    human1.firstname = 'Andreas';
    human1.lastname = 'Muster';

    const human2 = new Human();
    human2.firstname = 'Michael';
    human2.lastname = 'Meier';

    const cat1 = new Cat();
    cat1.name = 'Meowy';
    cat1.district = 100;
    cat1.owner = human1;
    cat1.talky = true;
    cat1.other = 'cute';
    cat1.friends = [];

    const cat2 = new Cat();
    cat2.name = 'Links';
    cat2.district = 50;
    cat2.owner = human2;
    cat2.other = 'sweet';
    cat2.birthdate = new Date('2014-09-01');
    cat2.friends = null;
    cat2.talky = true;

    const dog1 = new Dog();
    dog1.name = 'Barky';
    dog1.isBarking = true;
    dog1.owner = null;
    dog1.other = 1.1;

    // SETUP CHECKS
    describe('setup checks', () => {
      it('JsonConvert instance', () => {
        let jsonConvertTest = new JsonConvert();

        jsonConvertTest = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_OBJECT_NULL, false);
        expect(jsonConvertTest.operationMode).toEqual(OperationMode.ENABLE);
        expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.ALLOW_OBJECT_NULL);
        expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(false);

        jsonConvertTest = new JsonConvert(OperationMode.DISABLE, ValueCheckingMode.ALLOW_NULL, true);
        expect(jsonConvertTest.operationMode).toEqual(OperationMode.DISABLE);
        expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.ALLOW_NULL);
        expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(true);

        jsonConvertTest = new JsonConvert(OperationMode.LOGGING, ValueCheckingMode.DISALLOW_NULL, false);
        expect(jsonConvertTest.operationMode).toEqual(OperationMode.LOGGING);
        expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.DISALLOW_NULL);
        expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(false);

        jsonConvertTest = new JsonConvert();
        expect(jsonConvertTest.operationMode).toEqual(OperationMode.ENABLE);
        expect(jsonConvertTest.valueCheckingMode).toEqual(ValueCheckingMode.ALLOW_OBJECT_NULL);
        expect(jsonConvertTest.ignorePrimitiveChecks).toEqual(false);
      });

      it('JsonObject decorator', () => {
        expect((human1 as any)[Settings.CLASS_IDENTIFIER]).toEqual('Human');
        expect((cat1 as any)[Settings.CLASS_IDENTIFIER]).toEqual('Kitty');
        expect((dog1 as any)[Settings.CLASS_IDENTIFIER]).toEqual('Dog');
      });
    });

    // NULL/UNDEFINED CHECKS
    describe('null/undefined checks', () => {
      const jsonConvert = new JsonConvert();
      it('serialize and deserialize null', () => {
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

        const tCat = (jsonConvert as any).deserialize(null, Cat);
        expect(tCat).toEqual(null);

        const tCatJsonObject = (jsonConvert as any).serialize(null);
        expect(tCatJsonObject).toEqual(null);

        jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL;
        expect(() => (jsonConvert as any).deserialize(null, Cat)).toThrow();
        expect(() => (jsonConvert as any).serialize(null)).toThrow();
      });

      it('deserialize and serialize undefined', () => {
        jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

        expect(() => (jsonConvert as any).deserialize(undefined, Cat)).toThrowError();
        expect(() => (jsonConvert as any).serialize(undefined)).toThrowError();
      });
    });

    // BASIC CHECKS
    describe('basic checks', () => {
      const jsonConvert = new JsonConvert();
      jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

      it('serialize and deserialize same data', () => {
        const tCatJsonObject = (jsonConvert as any).serialize(cat1);
        expect(tCatJsonObject).toEqual(cat1JsonObject);

        const tCat = (jsonConvert as any).deserialize(tCatJsonObject, Cat);
        expect(tCat).toEqual(cat1);
      });

      it('deserialize and serialize same data', () => {
        const tCat = (jsonConvert as any).deserialize(cat1JsonObject, Cat);
        expect(tCat).toEqual(cat1);

        const tCatJsonObject = (jsonConvert as any).serialize(tCat);
        expect(tCatJsonObject).toEqual(cat1JsonObject);
      });
    });

    // PRIVATE METHODS
    describe('private methods', () => {
      const jsonConvert = new JsonConvert();
      jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

      it('serializeObject_loopProperty()', () => {
        const tCat = {};
        (jsonConvert as any).serializeObject_loopProperty(cat1, 'name', tCat);
        expect((tCat as any).catName).toBe(cat1.name);
        (jsonConvert as any).serializeObject_loopProperty(cat1, 'district', tCat);
        expect((tCat as any).district).toBe(100);
        (jsonConvert as any).serializeObject_loopProperty(cat1, 'owner', tCat);
        expect((tCat as any).owner.givenName).toBe('Andreas');
      });

      it('deserializeObject_loopProperty()', () => {
        const tCat = new Cat();
        (jsonConvert as any).deserializeObject_loopProperty(tCat, 'name', { catName: 'Meowy' });
        expect(tCat.name).toEqual('Meowy');

        const tDog = new Dog();
        (jsonConvert as any).deserializeObject_loopProperty(tDog, 'name', { name: 'Barky' });
        expect(tDog.name).toEqual('Barky');

        (jsonConvert as any).deserializeObject_loopProperty(tCat, 'district', { district: 100 });
        expect(tCat.district).toEqual(100);
        (jsonConvert as any).deserializeObject_loopProperty(tCat, 'owner', {
          owner: {
            givenName: 'Andreas',
            lastName: 'Muster',
          },
        });

        jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_INSENSITIVE;

        (jsonConvert as any).deserializeObject_loopProperty(tCat, 'name', { catName: 'Meowy' });
        expect(tCat.name).toEqual('Meowy');
        (jsonConvert as any).deserializeObject_loopProperty(tCat, 'name', { catNAME: 'Meowy' });
        expect(tCat.name).toEqual('Meowy');
        expect(() => (jsonConvert as any).deserializeObject_loopProperty(tCat, 'name', { catNames: 'Meowy' })).toThrow();

        jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_STRICT;
      });
    });

    // HELPER METHODS
    describe('helper methods', () => {
      const jsonConvert = new JsonConvert();
      jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

      it('getClassPropertyMappingOptions()', () => {
        expect((jsonConvert as any).getClassPropertyMappingOptions(cat1, 'name')).not.toBeNull();
        expect((jsonConvert as any).getClassPropertyMappingOptions(dog1, 'name')).not.toBeNull();
        expect((jsonConvert as any).getClassPropertyMappingOptions(human1, 'name')).toBeNull();
      });

      it('verifyProperty()', () => {
        expect((jsonConvert as any).verifyProperty(String, 'Andreas', false)).toBe('Andreas');
        expect((jsonConvert as any).verifyProperty([String, [Boolean, Number]], ['Andreas', [true, 2.2]], false))
          .toEqual(['Andreas', [true, 2.2]]);
        expect(() => (jsonConvert as any).verifyProperty(Number, 'Andreas', false)).toThrow();
      });

      it('getObjectValue()', () => {
        expect((jsonConvert as any).getObjectValue({ name: 'Andreas' }, 'name')).toBe('Andreas');
        expect(() => (jsonConvert as any).getObjectValue({ nAmE: 'Andreas' }, 'NaMe')).toThrow();

        jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_INSENSITIVE;
        expect((jsonConvert as any).getObjectValue({ nAmE: 'Andreas' }, 'NaMe')).toBe('Andreas');

        jsonConvert.propertyMatchingRule = PropertyMatchingRule.CASE_STRICT;
      });
    });

    // JSON2TYPESCRIPT TYPES
    describe('json2typescript types', () => {
      const jsonConvert = new JsonConvert();
      jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

      it('getExpectedType()', () => {
        expect((jsonConvert as any).getExpectedType(JsonConvert)).toBe('JsonConvert');
        expect((jsonConvert as any).getExpectedType([String, [Boolean, Number]])).toBe('array');
        expect((jsonConvert as any).getExpectedType([String, [Boolean, Number]], true))
          .toBe('[string,[boolean,number]]');
        expect((jsonConvert as any).getExpectedType([[null, Any], Object], true)).toBe('[[any,any],any]');
        expect((jsonConvert as any).getExpectedType(undefined)).toBe('undefined');
        expect((jsonConvert as any).getExpectedType('?')).toBe('?????');
      });

      it('getJsonType()', () => {
        expect((jsonConvert as any).getJsonType({ name: 'Andreas' })).toBe('object');
        expect((jsonConvert as any).getJsonType(['a', 0, [true, null]])).toBe('[string,number,[boolean,null]]');
      });

      it('getTrueType()', () => {
        expect((jsonConvert as any).getTrueType(new JsonConvert())).toBe('object');
        expect((jsonConvert as any).getTrueType({ name: 'Andreas' })).toBe('object');
        expect((jsonConvert as any).getTrueType('Andreas')).toBe('string');
      });
    });
  });
});
