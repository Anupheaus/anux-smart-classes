import { MapOf } from 'anux-common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Scope = 'private' | 'protected' | 'public';

export type FunctionDefinition = (...args: any[]) => any | void;

export type MemberTypes = 'method' | 'property' | 'variable';

export type DirectMethodDefinition<T = FunctionDefinition> = T;

export type MethodDefinition<T = FunctionDefinition> = {
  type?: 'method';
  scope?: Scope;
  definition: T;
}

export type DirectOrFullMethodDefinition<T = FunctionDefinition> = DirectMethodDefinition<T> | MethodDefinition<T>;

export interface PropertyDefinition<T = any> {
  type?: 'property';
  scope?: Scope;
  get(): T;
  set(value: T): void;
}

export interface ReadOnlyPropertyDefinition<T = any> {
  type?: 'property';
  scope?: Scope;
  get(): T;
}

export function TypeOf<T>(): T { return null as unknown as T; }

export interface VariableDefinition<T = any> {
  type: 'variable';
  scope?: Scope;
  valueType: T;
}

export type FullMemberDefinition = Required<MethodDefinition | PropertyDefinition | ReadOnlyPropertyDefinition | VariableDefinition>;
export type MemberDefinition = DirectMethodDefinition | MethodDefinition | PropertyDefinition | ReadOnlyPropertyDefinition | VariableDefinition;

export interface ClassDefinition {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  constructor(...args: any[]): any;
  [key: string]: MemberDefinition;
}

// eslint-disable-next-line @typescript-eslint/no-misused-new
export type FullClassDefinition = MapOf<FullMemberDefinition> & { constructor(...args: any[]): any }

export type MemberKeysOf<T extends {}> = T[keyof Omit<T, 'constructor'>];

type AddDefaultsTo<T> = (T extends VariableDefinition ? (T extends { scope: Scope } ? {} : { scope: 'private' }) : (T extends { scope: Scope } ? {} : { scope: 'public' })) & T;

export type GetScopedMemberKeysThatExtend<E extends MemberDefinition, S extends Scope, T extends ClassDefinition> = MemberKeysOf<{
  [K in keyof T]: AddDefaultsTo<T[K]> extends E & { scope: S } ? K : never;
}>;

export type GetMemberKeysThatExtend<E extends MemberDefinition, T extends ClassDefinition> = MemberKeysOf<{ [K in keyof T]: T[K] extends E ? K : never }>;

/* eslint-disable @typescript-eslint/indent */
export type GetScopedMembersFrom<T extends ClassDefinition, S extends Scope> =
  { [K in GetScopedMemberKeysThatExtend<PropertyDefinition, S, T>]: T[K] extends PropertyDefinition<infer A> ? A : never; }
  & { readonly [K in Exclude<GetScopedMemberKeysThatExtend<ReadOnlyPropertyDefinition, S, T>,
    GetMemberKeysThatExtend<PropertyDefinition, T>>]: T[K] extends ReadOnlyPropertyDefinition<infer A> ? A : never; }
  & { [K in GetScopedMemberKeysThatExtend<DirectOrFullMethodDefinition, S, T>]: T[K] extends DirectOrFullMethodDefinition<infer A> ? A : never; }
  & { [K in GetScopedMemberKeysThatExtend<VariableDefinition, S, T>]: T[K] extends VariableDefinition<infer A> ? A : never; };
/* eslint-enable @typescript-eslint/indent */

/* eslint-disable @typescript-eslint/indent */
export type GetAllMembersFrom<T extends ClassDefinition> =
  { [K in GetMemberKeysThatExtend<PropertyDefinition, T>]: T[K] extends PropertyDefinition<infer A> ? A : never; }
  & { readonly [K in Exclude<GetMemberKeysThatExtend<ReadOnlyPropertyDefinition, T>,
    GetMemberKeysThatExtend<PropertyDefinition, T>>]: T[K] extends ReadOnlyPropertyDefinition<infer A> ? A : never; }
  & { [K in GetMemberKeysThatExtend<DirectOrFullMethodDefinition, T>]: T[K] extends DirectOrFullMethodDefinition<infer A> ? A : never; }
  & { [K in GetMemberKeysThatExtend<VariableDefinition, T>]: T[K] extends VariableDefinition<infer A> ? A : never; };
/* eslint-enable @typescript-eslint/indent */

export type MakeFullDefinitionWith<FullDefinition, PartialDefinition> = Required<Exclude<FullDefinition, PartialDefinition> & PartialDefinition>;

/* eslint-disable @typescript-eslint/indent */
export type ConvertToFullDefinition<T extends MemberDefinition> = T extends FunctionDefinition ? { type: 'method'; scope: 'public'; definition: T } :
  T extends PropertyDefinition<infer A> ? MakeFullDefinitionWith<PropertyDefinition<A>, T> :
  T extends ReadOnlyPropertyDefinition<infer A> ? MakeFullDefinitionWith<ReadOnlyPropertyDefinition<A>, T> :
  T extends VariableDefinition<infer A> ? MakeFullDefinitionWith<VariableDefinition<A>, T> :
  T extends DirectOrFullMethodDefinition<infer A> ? MakeFullDefinitionWith<DirectOrFullMethodDefinition<A>, T> : never;
/* eslint-enable @typescript-eslint/indent */

export type GetScopedDefinitionsFrom<T extends ClassDefinition, S extends Scope> = { [K in GetScopedMemberKeysThatExtend<MemberDefinition, S, T>]: ConvertToFullDefinition<T[K]> };

export type SmartClassType<T extends ClassDefinition> = {
  new(...args: Parameters<T['constructor']>): GetScopedMembersFrom<T, 'public'>;
  definition: GetScopedDefinitionsFrom<T, 'protected' | 'public'>;
  instance: GetScopedMembersFrom<T, 'public'>;
  isBaseTypeFor(instance: InstanceOf<SmartClassType<any>>): instance is InstanceOf<SmartClassType<T>>;
};

export type InstanceOf<T extends SmartClassType<any>> = T extends SmartClassType<infer A> ? GetScopedMembersFrom<A, 'public'> : never;

type GetConstructorParametersFrom<T extends SmartClassType<any>> = T extends SmartClassType<infer A> ? Parameters<A['constructor']> : never;

export interface SmartClassInternal {
  extendWith<T extends SmartClassType<any>>(classType: T, ...constructorParameters: GetConstructorParametersFrom<T>): void;
  superOf<T extends ClassDefinition>(classType: SmartClassType<T>): GetScopedMembersFrom<T, 'public' | 'protected'> | undefined;
}

export type SetThisTypeOn<T extends ClassDefinition> = T & ThisType<GetAllMembersFrom<T> & { _: SmartClassInternal }>;