import { SmartClass } from '../SmartClass';
import { TypeOf, InstanceOf, SmartClassInternal } from '../models';
import { TestLog } from './TestLog';
import { variable } from '../variable';

export const TestClass = SmartClass.define({
  constructor(testLog: typeof TestLog.instance) {
    // testLog.logMemberCall('TestClass.constructor');
    this.testLog = testLog;
    this.publicVariable = true;
  },

  testLog: variable<InstanceOf<typeof TestLog>>(),

  publicMethod: {
    scope: 'public',
    definition(): SmartClassInternal {
      return this._;
    },
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