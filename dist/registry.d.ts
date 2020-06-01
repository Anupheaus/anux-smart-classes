import { InstanceOf, SmartClassType, ClassDefinition, GetScopedMembersFrom, FullMemberDefinition } from './models';
import { AnyObject } from 'anux-common';
export interface InstanceMeta<T extends ClassDefinition> {
    type: SmartClassType<any>;
    internalInstance: GetScopedMembersFrom<T, 'public' | 'protected' | 'private'>;
    protectedInstance: GetScopedMembersFrom<T, 'public' | 'protected'>;
    extendedTypes: WeakMap<SmartClassType<any>, InstanceOf<SmartClassType<any>>>;
    variables: AnyObject;
}
export declare function recordInstanceType(instance: AnyObject, type: string): void;
export declare function getInstanceMeta<T extends ClassDefinition>(instance: InstanceOf<SmartClassType<T>>): InstanceMeta<T> | undefined;
export declare function associateMetaWith<T extends ClassDefinition>(meta: InstanceMeta<T>, ...instances: AnyObject[]): void;
export declare function getBaseTypeMeta<T extends ClassDefinition>(instance: InstanceOf<SmartClassType<any>>, type: SmartClassType<T>): InstanceMeta<any> | undefined;
export declare function isOfType(instance: InstanceOf<SmartClassType<any>>, type: SmartClassType<any>): boolean;
export declare function setBaseTypeOnDefinition<T extends ClassDefinition>(definition: FullMemberDefinition, type: SmartClassType<T>): void;
export declare function getInstanceMetaFromDefinition<T extends ClassDefinition>(instance: InstanceOf<SmartClassType<T>>, definition: FullMemberDefinition): InstanceMeta<T> | undefined;
