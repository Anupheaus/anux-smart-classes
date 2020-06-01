/* eslint-disable @typescript-eslint/no-explicit-any */
import { InstanceOf, SmartClassType, ClassDefinition, GetScopedMembersFrom, FullMemberDefinition } from './models';
import { AnyObject } from 'anux-common';

export interface InstanceMeta<T extends ClassDefinition> {
  type: SmartClassType<any>;
  internalInstance: GetScopedMembersFrom<T, 'public' | 'protected' | 'private'>;
  protectedInstance: GetScopedMembersFrom<T, 'public' | 'protected'>;
  extendedTypes: WeakMap<SmartClassType<any>, InstanceOf<SmartClassType<any>>>;
  variables: AnyObject;
}

const instanceRegistry = new WeakMap<InstanceOf<SmartClassType<any>>, InstanceMeta<any>>();
const baseTypeOnDefinitionRegistry = new WeakMap<FullMemberDefinition, SmartClassType<any>>();
const instanceTypes = new WeakMap<AnyObject, string>();

export function recordInstanceType(instance: AnyObject, type: string): void {
  if (instanceTypes.has(instance)) return;
  instanceTypes.set(instance, type);
}

export function getInstanceMeta<T extends ClassDefinition>(instance: InstanceOf<SmartClassType<T>>) {
  return instanceRegistry.get(instance) as InstanceMeta<T> | undefined;
}

export function associateMetaWith<T extends ClassDefinition>(meta: InstanceMeta<T>, ...instances: AnyObject[]): void {
  instances.forEach(instance => instanceRegistry.set(instance, meta));
}

export function getBaseTypeMeta<T extends ClassDefinition>(instance: InstanceOf<SmartClassType<any>>, type: SmartClassType<T>) {
  const meta = getInstanceMeta(instance);
  if (!meta) return undefined;
  if (meta.type === type) return meta;
  const baseTypePublicInstance = meta.extendedTypes.get(type);
  if (!baseTypePublicInstance) return undefined;
  return getInstanceMeta(baseTypePublicInstance);
}

export function isOfType(instance: InstanceOf<SmartClassType<any>>, type: SmartClassType<any>): boolean {
  const meta = getBaseTypeMeta(instance, type);
  if (!meta) return false;
  return meta.extendedTypes.has(type);
}

export function setBaseTypeOnDefinition<T extends ClassDefinition>(definition: FullMemberDefinition, type: SmartClassType<T>): void {
  if (baseTypeOnDefinitionRegistry.has(definition)) return;
  baseTypeOnDefinitionRegistry.set(definition, type);
}

export function getInstanceMetaFromDefinition<T extends ClassDefinition>(instance: InstanceOf<SmartClassType<T>>,
  definition: FullMemberDefinition): InstanceMeta<T> | undefined {
  const type = baseTypeOnDefinitionRegistry.get(definition);
  if (!type) return;
  return getBaseTypeMeta(instance, type);
}
