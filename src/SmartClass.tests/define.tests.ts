/* eslint-disable @typescript-eslint/no-explicit-any */
import { SmartClass } from '../SmartClass';

describe('SmartClass > define', () => {

  it('can create a class function with the additional properties', () => {
    const MyTestClass = SmartClass.define({
      constructor() { /* do nothing */ },
    });

    expect(MyTestClass).to.be.a('function');
    expect(MyTestClass).to.have.property('definition').which.is.an('object');
  });

});
