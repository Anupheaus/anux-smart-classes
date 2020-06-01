import { ClassDefinition, SetThisTypeOn, SmartClassType } from './models';
export declare const SmartClass: {
    define<T extends ClassDefinition>(definition: SetThisTypeOn<T>): SmartClassType<T>;
};
