/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDefinition, SmartClassType, InstanceOf, GetScopedMembersFrom, SmartClassInternal } from './models';
import { InstanceMeta, getInstanceMeta, recordInstanceType, associateMetaWith } from './registry';
import { createPrototype } from './createPrototype';

function addInternalSettingsTo<T extends ClassDefinition>(meta: InstanceMeta<T>): void {
  const internalSettings: SmartClassInternal = {
    extendWith<E extends ClassDefinition>(ExtendedCtor: SmartClassType<E>, ...args: Parameters<E['constructor']>): void {
      const publicInstanceOfExtendedClass = new ExtendedCtor(...args);
      meta.extendedTypes.set(ExtendedCtor, publicInstanceOfExtendedClass);
    },
    superOf<E extends ClassDefinition>(type: SmartClassType<E>) {
      const publicInstanceOfExtendedClass = meta.extendedTypes.get(type) as GetScopedMembersFrom<E, 'public'>;
      const extendedMeta = getInstanceMeta(publicInstanceOfExtendedClass);
      return extendedMeta?.protectedInstance;
    },
  };
  Object.defineProperty(meta.internalInstance, '_', {
    get: () => internalSettings,
    enumerable: false,
    configurable: false,
  });
}

export function createConstructor<T extends ClassDefinition>(definition: T): SmartClassType<T> {
  const ctor = function constructor(this: InstanceOf<SmartClassType<T>>, ...args: any[]) {
    const internalInstancePrototype = createPrototype(definition, ['public', 'protected', 'private']);
    const internalInstance = Object.create(internalInstancePrototype);
    recordInstanceType(internalInstance, `Internal - ${ctor.name}`);
    const protectedInstance = createPrototype(definition, ['public', 'protected']);
    recordInstanceType(protectedInstance, `Protected - ${ctor.name}`);
    recordInstanceType(this, `Public - ${ctor.name}`);
    const meta: InstanceMeta<T> = {
      type: ctor,
      internalInstance,
      protectedInstance,
      extendedTypes: new WeakMap([[ctor, null]]) as any,
      variables: {},
    };
    associateMetaWith(meta, this, internalInstance, protectedInstance);
    addInternalSettingsTo(meta);
    definition.constructor.call(internalInstance, ...args);
    return this;
  } as unknown as SmartClassType<T>;
  ctor.prototype = createPrototype(definition, ['public']);
  return ctor;
}
