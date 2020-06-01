import { VariableDefinition, TypeOf } from './models';

export const variable = <T>(): VariableDefinition<T> => ({
  type: 'variable',
  valueType: TypeOf<T>(),
});