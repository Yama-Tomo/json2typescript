import { cloneDeep } from 'lodash';
import { JsonConvert } from '../src/json2typescript/json-convert';
import { ValueCheckingMode } from '../src/json2typescript/json-convert-enums';
import { Cat } from './model/typescript/cat';
import { Human } from './model/typescript/human';
import { Dog } from './model/typescript/dog';
import { IHuman } from './model/json/i-human';
import { ICat } from './model/json/i-cat';
import { IDog } from './model/json/i-dog';
import { IEmployee } from './model/json/i-employee';
import * as Emp from './model/typescript/employee';

describe('Integration tests', () => {
  const jsonConvert = new JsonConvert();

  describe('JsonConvert', () => {
    // JSON DATA
    const human1JsonObject: IHuman = {
      givenName: 'Andreas',
      lastName: 'Muster',
    };
    const cat1JsonObject: ICat = {
      catName: 'Meowy',
      district: 100,
      owner: human1JsonObject,
      birthdate: '2016-01-02',
      friends: [],
      talky: false,
      other: '',
    };
    const dog1JsonObject: IDog = {
      name: 'Barky',
      barking: true,
      owner: null,
      birthdate: '2016-01-02',
      friends: [],
      other: 0,
    };
    const cat2JsonObject: ICat = {
      catName: 'Links',
      district: 50,
      owner: human1JsonObject,
      birthdate: '2016-01-02',
      friends: null,
      talky: true,
      other: '',
    };
    const animalJsonArray = [cat1JsonObject, dog1JsonObject];
    const catsJsonArray = [cat1JsonObject, cat2JsonObject];

    // TYPESCRIPT INSTANCES
    const human1 = new Human();
    human1.firstname = 'Andreas';
    human1.lastname = 'Muster';

    const cat1 = new Cat();
    cat1.name = 'Meowy';
    cat1.district = 100;
    cat1.owner = human1;
    cat1.birthdate = new Date('2016-01-02');
    cat1.friends = [];

    const dog1 = new Dog();
    dog1.name = 'Barky';
    dog1.isBarking = true;
    dog1.owner = null;
    dog1.birthdate = new Date('2016-01-02');
    dog1.friends = [];

    const cat2 = new Cat();
    cat2.name = 'Links';
    cat2.district = 50;
    cat2.owner = human1;
    cat2.birthdate = new Date('2016-01-02');
    cat2.talky = true;

    const animals = [cat1, dog1];
    const cats = [cat1, cat2];

    const employee = (hobby?: string) => {
      const _instanceSkill = new Emp.Skill();
      _instanceSkill.id = 100;
      _instanceSkill.skillName = 'scrum master';
      _instanceSkill.description = 'hogehoge';

      const _instance = new Emp.Employee();
      _instance.id = 1000;
      _instance.firstName = 'Ichiro';
      _instance._lastName = 'Suzuki';
      _instance.branchName = 'developer team';
      _instance.age = 30;
      if (hobby) {
        _instance.hobby = hobby;
      }
      _instance.description.length_of_service = 5;
      _instance.description.position = 'Leader';
      _instance.description.sub_position = '(none)';
      _instance.skillLists = [_instanceSkill];

      return _instance;
    };

    const employeeJsonObj: IEmployee = {
      id: 1000, first_name: 'Ichiro', last_name: 'Suzuki',
      branch_name: 'developer team', age: 30,
      description: { length_of_service: 5, position: 'Leader', sub_position: '(none)' },
      skill_lists: [{ id: 100, skill_name: 'scrum master', description: 'hogehoge' }],
    };

    // SERIALIZE INTEGRATION
    describe('serialize', () => {
      jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

      it('should serialize a TypeScript object to a JSON object', () => {
        expect(jsonConvert.serialize(cat1)).toEqual(cat1JsonObject);
        expect(jsonConvert.serialize(cat2)).toEqual(cat2JsonObject);
        expect(jsonConvert.serialize(dog1)).toEqual(dog1JsonObject);
        expect(jsonConvert.serializeObject(cat1)).toEqual(cat1JsonObject);
        expect(jsonConvert.serializeObject(cat2)).toEqual(cat2JsonObject);
        expect(jsonConvert.serializeObject(dog1)).toEqual(dog1JsonObject);
        expect(jsonConvert.serializeObject(employee())).toEqual({ ...employeeJsonObj, ...{ hobby: '(optional)' } });

        expect(() => jsonConvert.serializeArray(cat1 as any)).toThrow();
      });

      it('should serialize a TypeScript array to a JSON array', () => {
        expect(jsonConvert.serialize(animals)).toEqual(animalJsonArray);
        expect(jsonConvert.serialize(cats)).toEqual(catsJsonArray);
        expect(jsonConvert.serializeArray(animals)).toEqual(animalJsonArray);
        expect(jsonConvert.serializeArray(cats)).toEqual(catsJsonArray);

        expect(() => jsonConvert.serializeArray(cat1 as any)).toThrow();
      });

      it('should serialize a TypeScript object to a JSON object (non null)', () => {
        const nonNullConvert = new JsonConvert();

        const employeeObj = employee('soccer');
        employeeObj.skillLists[0].description = null;
        const expected = cloneDeep(employeeJsonObj);
        expected.skill_lists[0].description = null;

        expect(nonNullConvert.serializeObject(employeeObj)).toEqual({ ...expected, ...{ hobby: 'soccer' } });
      });
    });

    // DESERIALIZE INTEGRATION
    describe('deserialize', () => {
      jsonConvert.valueCheckingMode = ValueCheckingMode.ALLOW_NULL;

      it('should deserialize a JSON object to a TypeScript object', () => {
        expect(jsonConvert.deserialize(cat1JsonObject, Cat)).toEqual(cat1);
        expect(jsonConvert.deserialize(cat2JsonObject, Cat)).toEqual(cat2);
        expect(jsonConvert.deserialize(dog1JsonObject, Dog)).toEqual(dog1);
        expect(jsonConvert.deserializeObject(cat1JsonObject, Cat)).toEqual(cat1);
        expect(jsonConvert.deserializeObject(cat2JsonObject, Cat)).toEqual(cat2);
        expect(jsonConvert.deserializeObject(dog1JsonObject, Dog)).toEqual(dog1);
        expect(jsonConvert.deserializeObject(employeeJsonObj, Emp.Employee)).toEqual(employee());

        expect(() => jsonConvert.deserializeArray(cat1JsonObject as any, Cat)).toThrow();
      });

      it('should deserialize a JSON object to a TypeScript object (non null)', () => {
        const nonNullConvert = new JsonConvert();

        const descNullEmp = cloneDeep(employeeJsonObj);
        descNullEmp.skill_lists[0].description = null;
        const expected = employee();
        expected.skillLists[0].description = null;
        expect(nonNullConvert.deserializeObject(employeeJsonObj, Emp.Employee)).toEqual(employee());
      });

      it('should deserialize a JSON array to a TypeScript array', () => {
        expect(jsonConvert.deserialize(catsJsonArray, Cat)).toEqual(cats);
        expect(jsonConvert.deserializeArray(catsJsonArray, Cat)).toEqual(cats);

        expect(() => jsonConvert.deserializeObject(catsJsonArray, Cat)).toThrow();
      });

      it('should throw error TypeScript property not exists in JSON', () => {
        expect(() => jsonConvert.deserializeObject(employeeJsonObj, Emp.NoSuchPropertyEmployee)).toThrow();
        expect(() => jsonConvert.deserializeObject(employeeJsonObj, Emp.NoSuchPropertyObjectTypeArgEmployee)).toThrow();
      });

      it('should throw error TypeScript property type mismatch in JSON', () => {
        expect(() => jsonConvert.deserializeObject(employeeJsonObj, Emp.InvalidPropertyTypeEmployee)).toThrow();
      });

      it('should throw error non null property to null', () => {
        const nonNullConvert = new JsonConvert();

        const invalidFirstNameEmp = cloneDeep(employeeJsonObj) as any;
        invalidFirstNameEmp.first_name = null;
        expect(() => nonNullConvert.deserializeObject(invalidFirstNameEmp, Emp.Employee)).toThrow();

        const invalidSkillNameEmp = cloneDeep(employeeJsonObj) as any;
        invalidSkillNameEmp.skill_lists[0].skill_name = null;
        expect(() => nonNullConvert.deserializeObject(invalidSkillNameEmp, Emp.Employee)).toThrow();
      });
    });
  });
});
