import { SmartClass } from '../SmartClass';
import { variable } from '../variable';

export const TestLog = SmartClass.define({
  constructor: function TestLog() {
    this.memberCalls = [];
  },

  memberCalls: variable<string[]>(),

  logMemberCall(memberName: string): void {
    this.memberCalls.push(memberName);
  },
});
