/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClassDefinition, MemberDefinition, MemberTypes, FullClassDefinition, GetScopedDefinitionsFrom, SmartClassType, FullMemberDefinition } from './models';
import { is, MapOf, AnyObject } from 'anux-common';
import { setBaseTypeOnDefinition } from './registry';

export function createFullDefinition<T extends ClassDefinition>(definition: T) {
  const fullDefinition: MapOf<MemberDefinition> = {};
  Object.entries(definition).forEach(([key, memberDefinition]) => {
    if (!memberDefinition) return;
    fullDefinition[key] = memberDefinition;
    if (key === 'constructor') return;
    if (is.function(memberDefinition)) {
      fullDefinition[key] = {
        type: 'method',
        scope: 'public',
        definition: memberDefinition,
      };
    } else {
      if (memberDefinition.scope === 'private') return;
      if (memberDefinition.type === 'variable' && memberDefinition.scope != null) return;
      const type: MemberTypes = memberDefinition.type != null ? memberDefinition.type : 'definition' in memberDefinition ? 'method' : 'property';
      const newDefinition = {
        type: type as any,
        scope: type === 'variable' ? 'private' : 'public',
        ...memberDefinition,
      };
      fullDefinition[key] = (Reflect.areShallowEqual(newDefinition, memberDefinition) ? memberDefinition : newDefinition) as FullMemberDefinition;
    }
  });
  return fullDefinition as T;
}

export function setBaseTypeOnDefinitions<T extends ClassDefinition>(fullDefinition: T, type: SmartClassType<T>): void {
  Object.values<FullMemberDefinition>(fullDefinition as FullClassDefinition).forEach(definition => setBaseTypeOnDefinition(definition, type));
}

export function extractDerivedDefinition<T extends ClassDefinition>(fullDefinition: T) {
  const derivedDefinition: AnyObject = {};
  Object.entries(fullDefinition as FullClassDefinition)
    .forEach(([key, definition]) => {
      if (['public', 'protected'].includes(definition.scope)) { derivedDefinition[key] = definition; }
    });
  return derivedDefinition as unknown as GetScopedDefinitionsFrom<T, 'public' | 'protected'>;
}
