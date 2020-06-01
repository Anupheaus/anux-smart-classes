/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartClass } from '../SmartClass';
import { TestClass } from './TestClass';
import { TestLog } from './TestLog';
import { variable } from '../variable';
import { SmartClassInternal } from '../models';

export const DerivedTestClass = SmartClass.define({
  constructor(testLog: typeof TestLog.instance) {
    // testLog.logMemberCall('DerivedTestClass.constructor');
    this.testLog = testLog;
    this._.extendWith(TestClass, testLog);
  },

  testLog: variable<typeof TestLog.instance>(),

  ...TestClass.definition,

  derivedPublicMethod(): SmartClassInternal {
    return this.publicMethod();
  },

  ownInternal(): SmartClassInternal {
    return this._;
  },

  returnThis(): any {
    return this;
  },

});
