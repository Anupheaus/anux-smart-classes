/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDefinition, SetThisTypeOn, SmartClassType } from './models';
import { createFullDefinition, extractDerivedDefinition, setBaseTypeOnDefinitions } from './definitions';
import { createIsBaseTypeFor } from './createIsBaseTypeFor';
// import { registerBaseType } from './registries';
import { createConstructor } from './createConstructor';

export const SmartClass = {
  define<T extends ClassDefinition>(definition: T & SetThisTypeOn<T>): SmartClassType<T> {
    const fullDefinition = createFullDefinition(definition);
    const result = createConstructor<T>(fullDefinition);
    result.setName(definition.constructor.name);
    setBaseTypeOnDefinitions(fullDefinition, result);
    result.definition = extractDerivedDefinition<T>(fullDefinition);
    result.isBaseTypeFor = createIsBaseTypeFor(result);
    return result;
  },
};

// const Users = SmartClass.define({
//   constructor(blah: boolean): void {
//     /* do nothing */
//   },

//   something: {
//     type: 'variable',
//     valueType: TypeOf<string>(),
//   },

//   user: {
//     scope: 'protected',
//     get(): string | undefined {

//       return this.something;
//     },
//     set(value: string) {
//       this.something = value;
//     },
//   },

//   test(test: string): Promise<void> {
//     this.user = undefined
//     return Promise.resolve();
//   },

//   test2(blah: string): boolean {
//     return true;
//   },


// });

// const Users2 = SmartClass.define({
//   constructor() {
//     this._.extendWith(Users, true);
//   },

//   ...Users.definition,

//   gerr(something: string): void {

//   },

// });

// const b = new Users2();
