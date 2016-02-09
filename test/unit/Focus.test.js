import { assert } from 'chai';
import sinon from 'sinon';
import Rectangle from 'kittik-shape-rectangle';
import Focus from '../../src/Focus';

describe('Animation::Focus', () => {
  it('Should properly get/set direction', () => {
    const animation = new Focus({direction: 'bounceDown'});
    assert.equal(animation.getDirection(), 'bounceDown');
    assert.instanceOf(animation.setDirection('bounceUp'), Focus);
    assert.equal(animation.getDirection(), 'bounceUp');
  });

  it('Should properly throw error if direction is not supports', () => {
    const animation = new Focus();
    assert.throws(() => animation.setDirection('wrong'), Error, 'Unknown direction: wrong');
  });

  it('Should properly call the animate() method', done => {
    const animation = new Focus();
    const shape = new Rectangle();
    const mock = sinon.mock(animation);

    mock.expects('_animateBounce').never().returns(Promise.resolve());
    mock.expects('_animateShake').once().returns(Promise.resolve());

    animation.animate(shape).then(() => {
      mock.verify();
      done();
    });
  });

  it('Should properly serialize animation to Object', () => {
    const animation = new Focus();

    assert.deepEqual(animation.toObject(), {
      type: 'Focus',
      options: {
        duration: 1000,
        easing: 'outQuad',
        direction: 'shakeX',
        offset: 5,
        repeat: 1
      }
    });
  });

  it('Should properly create Animation instance from object', () => {
    const obj = {
      type: 'Focus',
      options: {
        duration: 4000,
        easing: 'inOutExpo',
        direction: 'bounceDown',
        offset: 20,
        repeat: 5
      }
    };

    const animation = Focus.fromObject(obj);
    assert.instanceOf(animation, Focus);
    assert.equal(animation.getDuration(), 4000 / 5);
    assert.equal(animation.getEasing(), 'inOutExpo');
    assert.equal(animation.getDirection(), 'bounceDown');
    assert.isFunction(animation.animate);
  });
});
