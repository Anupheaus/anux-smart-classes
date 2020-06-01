import { SmartClassType, InstanceOf } from './models';
export declare function createIsBaseTypeFor<T extends SmartClassType<any>>(type: T): (instance: import("./models").GetScopedMembersFrom<any, "public">) => instance is InstanceOf<T>;
