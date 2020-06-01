/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartClass } from '../SmartClass';
import { TypeOf } from '../models';

describe('SmartClass > definition', () => {

  const MyTestClass = SmartClass.define({
    constructor() { /* */ },

    publicMethod: {
      scope: 'public',
      definition(): void { /* */ },
    },

    definitionOnlyPublicMethod(): void { /* */ },

    noScopePublicMethod: {
      definition(): void { /* */ },
    },

    protectedMethod: {
      scope: 'protected',
      definition(): void { /* */ },
    },

    privateMethod: {
      scope: 'private',
      definition(): void { /* */ },
    },

    privateVariable: {
      type: 'variable',
      valueType: TypeOf<string>(),
    },

    privateVariableWithScope: {
      type: 'variable',
      scope: 'private',
      valueType: TypeOf<string>(),
    },

    protectedVariable: {
      type: 'variable',
      scope: 'protected',
      valueType: TypeOf<string>(),
    },

    publicVariable: {
      type: 'variable',
      scope: 'public',
      valueType: TypeOf<boolean>(),
    },

  });

  it('only has the protected and public members', () => {
    const keys = Object.keys(MyTestClass.definition);

    expect(keys).to.eql(['publicMethod', 'definitionOnlyPublicMethod', 'noScopePublicMethod', 'protectedMethod', 'protectedVariable', 'publicVariable']);
  });

  it('has the correct full definitions of exposed members', () => {
    const values: any[] = Object.values(MyTestClass.definition);

    expect(values).to.eql([
      { type: 'method', scope: 'public', definition: values[0].definition },
      { type: 'method', scope: 'public', definition: values[1].definition },
      { type: 'method', scope: 'public', definition: values[2].definition },
      { type: 'method', scope: 'protected', definition: values[3].definition },
      { type: 'variable', scope: 'protected', valueType: values[4].valueType },
      { type: 'variable', scope: 'public', valueType: values[5].valueType },
    ]);
  });

});
