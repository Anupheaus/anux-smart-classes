export class MetaNotFound extends Error {
  constructor(_instance: Object) {
    super('Cannot find meta on this instance');
  }
}