/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartClassType, InstanceOf } from './models';
import { isOfType } from './registry';

export function createIsBaseTypeFor<T extends SmartClassType<any>>(type: T) {
  return (instance: InstanceOf<SmartClassType<any>>): instance is InstanceOf<T> => isOfType(instance, type);
}
