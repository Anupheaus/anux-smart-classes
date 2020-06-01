import { ClassDefinition, GetScopedDefinitionsFrom, SmartClassType } from './models';
export declare function createFullDefinition<T extends ClassDefinition>(definition: T): T;
export declare function setBaseTypeOnDefinitions<T extends ClassDefinition>(fullDefinition: T, type: SmartClassType<T>): void;
export declare function extractDerivedDefinition<T extends ClassDefinition>(fullDefinition: T): GetScopedDefinitionsFrom<T, "protected" | "public">;
