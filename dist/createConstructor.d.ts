import { ClassDefinition, SmartClassType } from './models';
export declare function createConstructor<T extends ClassDefinition>(definition: T): SmartClassType<T>;
