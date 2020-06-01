/* eslint-disable @typescript-eslint/no-explicit-any */
import { DerivedTestClass } from './DerivedTestClass';
import { TestLog } from './TestLog';
import { TestClass } from './TestClass';

describe('SmartClass > instance', () => {

  function createInstance() {
    const testLog = new TestLog();
    return { derivedClass: new DerivedTestClass(testLog), testLog };
  }

  it('can create a derived class', () => {
    const { testLog, derivedClass } = createInstance();
    expect(derivedClass).to.be.an('object');
    expect(TestLog.isBaseTypeFor(testLog)).to.be.true;
    expect(DerivedTestClass.isBaseTypeFor(derivedClass)).to.be.true;
    expect(TestLog.isBaseTypeFor(derivedClass)).to.be.false;
    expect(DerivedTestClass.isBaseTypeFor(testLog)).to.be.false;
    expect(TestClass.isBaseTypeFor(derivedClass)).to.be.true;
  });

  it('has the correct full definitions of exposed members', () => {
    const { derivedClass } = createInstance();

    const keys = Object.keys(Object.getPrototypeOf(derivedClass));
    expect(keys).to.eql(['publicMethod', 'definitionOnlyPublicMethod', 'noScopePublicMethod', 'publicVariable', 'derivedPublicMethod', 'ownInternal', 'returnThis']);
    keys.forEach(key => {
      if (key === 'publicVariable') {
        expect((derivedClass as any)[key]).to.be.a('boolean').and.eql(true);
      } else {
        expect((derivedClass as any)[key]).to.be.a('function', `${key} was not found to be a function`);
      }
    });
  });

  it('has the correct functions on the internal variable', () => {
    const { derivedClass } = createInstance();

    const baseInternalVariable = derivedClass.derivedPublicMethod();
    const internalVariable = derivedClass.ownInternal();

    expect(baseInternalVariable).to.be.an('object');
    expect(internalVariable).to.be.an('object');
    expect(baseInternalVariable.extendWith).to.be.a('function');
    expect(internalVariable.extendWith).to.be.a('function');
    expect(baseInternalVariable.superOf).to.be.a('function');
    expect(internalVariable.superOf).to.be.a('function');
    expect(baseInternalVariable.superOf(TestClass)).to.be.undefined;
    expect(internalVariable.superOf(TestClass)).to.be.an('object');
    expect(internalVariable.superOf(TestClass)?.protectedMethod).to.be.a('function');
    expect(internalVariable.superOf(TestClass)?.publicMethod()).to.eq(baseInternalVariable);
  });

  it('does not lose binding', () => {
    const { derivedClass } = createInstance();

    const test = new (class Test {
      returnThis() { return this; }
    })();

    const aArray = new Array(1).fill('a');
    const test1 = aArray.map(derivedClass.returnThis);
    const test2 = aArray.map(test.returnThis);

    expect(test1).not.to.eql([undefined]);
    expect(test2).to.eql([undefined]);
  });

});
