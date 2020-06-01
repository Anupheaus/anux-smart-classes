import { Scope, ClassDefinition, GetScopedMembersFrom } from './models';
export declare function createPrototype<T extends ClassDefinition, S extends Scope[]>(definition: T, scopes: S): GetScopedMembersFrom<T, S[number]>;
