/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FullClassDefinition, Scope, MethodDefinition, PropertyDefinition, ReadOnlyPropertyDefinition,
  ClassDefinition, GetScopedMembersFrom, VariableDefinition, FullMemberDefinition, MemberDefinition
} from './models';
import { AnyObject } from 'anux-common';
import { getInstanceMetaFromDefinition } from './registry';
import { MetaNotFound } from './errors';

function createSmartClassWrapper(definition: MemberDefinition, func: Function, bindFunc: boolean) {
  return function smartClassWrapper(this: AnyObject, ...args: any[]) {
    const meta = getInstanceMetaFromDefinition(this, definition as FullMemberDefinition);
    if (!meta) throw new MetaNotFound(this);
    const instance = meta.internalInstance;
    return bindFunc ? func.bind(instance) : func.call(instance, ...args);
  };
}

function defineMethod(prototype: AnyObject, memberName: string, methodDefinition: MethodDefinition): void {
  Object.defineProperty(prototype, memberName, {
    get: createSmartClassWrapper(methodDefinition, methodDefinition.definition, true),
    enumerable: true,
    configurable: true,
  });
}

function defineProperty(prototype: AnyObject, memberName: string, propertyDefinition: PropertyDefinition | ReadOnlyPropertyDefinition): void {
  Object.defineProperty(prototype, memberName, {
    get: createSmartClassWrapper(propertyDefinition, propertyDefinition.get, true),
    set: 'set' in propertyDefinition ? createSmartClassWrapper(propertyDefinition, propertyDefinition.set, false) : undefined,
    enumerable: true,
    configurable: true,
  });
}

function defineVariable(prototype: AnyObject, memberName: string, definition: VariableDefinition): void {
  function variableGetter(this: AnyObject) {
    const meta = getInstanceMetaFromDefinition(this, definition as FullMemberDefinition);
    if (!meta) throw new MetaNotFound(this);
    return meta.variables[memberName];
  }
  function variableSetter(this: AnyObject, value: any) {
    const meta = getInstanceMetaFromDefinition(this, definition as FullMemberDefinition);
    if (!meta) throw new MetaNotFound(this);
    meta.variables[memberName] = value;
  }
  const get = variableGetter.setName(`${memberName}_getter`);
  const set = variableSetter.setName(`${memberName}_setter`);
  Object.defineProperty(prototype, memberName, {
    get,
    set,
    enumerable: true,
    configurable: true,
  });
}

export function createPrototype<T extends ClassDefinition, S extends Scope[]>(definition: T, scopes: S) {
  const prototype: AnyObject = {};
  Object.entries(definition as FullClassDefinition).forEach(([memberName, memberDefinition]) => {
    if (!scopes.includes(memberDefinition.scope)) return;
    switch (memberDefinition.type) {
      case 'method':
        defineMethod(prototype, memberName, memberDefinition);
        break;
      case 'property':
        defineProperty(prototype, memberName, memberDefinition);
        break;
      case 'variable':
        defineVariable(prototype, memberName, memberDefinition);
        break;
    }
  });
  return prototype as GetScopedMembersFrom<T, S[number]>;
}