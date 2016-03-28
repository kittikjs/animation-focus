import Animation from 'kittik-animation-basic';

const AVAILABLE_DIRECTIONS = ['bounceUp', 'bounceRight', 'bounceDown', 'bounceLeft', 'shakeX', 'shakeY'];

/**
 * Focus animation is responsible for attention seekers for your shape.
 *
 * @since 1.0.0
 */
export default class Focus extends Animation {
  /**
   * Create Focus animation instance.
   *
   * @constructor
   * @param {Object} [options]
   * @param {String} [options.direction] Direction of the animation
   * @param {Number} [options.offset] Offset in cells, by how many cells you need to shift the shape
   * @param {Number} [options.repeat] How many times you need to repeat this animation
   */
  constructor(options = {}) {
    super(options);

    this.setDirection(options.direction);
    this.setOffset(options.offset);
    this.setRepeat(options.repeat);
  }

  /**
   * Get total duration of the animation taking to attention repeat count.
   *
   * @returns {Number}
   */
  getDuration() {
    return this.get('duration') / this.getRepeat();
  }

  /**
   * Get direction of the animation.
   *
   * @returns {String}
   */
  getDirection() {
    return this.get('direction');
  }

  /**
   * Set new direction of the animation.
   *
   * @param {String} direction
   * @returns {Animation}
   */
  setDirection(direction = 'shakeX') {
    if (AVAILABLE_DIRECTIONS.indexOf(direction) === -1) throw new Error(`Unknown direction: ${direction}`);
    return this.set('direction', direction);
  }

  /**
   * Get interval value used for moving shape.
   *
   * @returns {Number}
   */
  getOffset() {
    return this.get('offset');
  }

  /**
   * Set interval value used for moving shape.
   *
   * @param {Number} [offset=5]
   * @returns {Animation}
   */
  setOffset(offset = 5) {
    return this.set('offset', offset);
  }

  /**
   * Get repeat count of the attractor.
   *
   * @returns {Number}
   */
  getRepeat() {
    return this.get('repeat');
  }

  /**
   * Set repeat count of the attractor.
   *
   * @param {Number} [repeat=1]
   * @returns {Animation}
   */
  setRepeat(repeat = 1) {
    return this.set('repeat', repeat);
  }

  /**
   * Animates shape with bounce effect based on direction.
   *
   * @param {Shape} shape
   * @param {String} direction
   * @returns {Promise}
   * @private
   */
  _animateBounce(shape, direction) {
    const directions = {
      bounceUp: () => [shape.getY(), shape.getY() - this.getOffset(), 'y'],
      bounceRight: () => [shape.getX(), shape.getX() + this.getOffset(), 'x'],
      bounceDown: () => [shape.getY(), shape.getY() + this.getOffset(), 'y'],
      bounceLeft: () => [shape.getX(), shape.getX() - this.getOffset(), 'x']
    };

    const [startValue, endValue, property] = directions[direction]();
    const length = this.getRepeat();
    const firstStep = () => this.animateProperty({shape, property, startValue, endValue});
    const secondStep = () => this.animateProperty({shape, property, startValue: endValue, endValue: startValue});
    const promise = Array.from({length}).reduce(promise => promise.then(firstStep).then(secondStep), Promise.resolve(shape));

    return promise;
  }

  /**
   * Animates shape with shake effect based on direction.
   *
   * @param {Shape} shape
   * @param {String} direction
   * @returns {Promise}
   * @private
   */
  _animateShake(shape, direction) {
    const directions = {
      shakeX: () => [shape.getX(), shape.getX() - this.getOffset(), shape.getX() + this.getOffset(), 'x'],
      shakeY: () => [shape.getY(), shape.getY() - this.getOffset(), shape.getY() + this.getOffset(), 'y']
    };

    const [startValue, leftValue, rightValue, property] = directions[direction]();
    const length = this.getRepeat();
    const firstStep = () => this.animateProperty({shape, property, startValue, endValue: leftValue});
    const secondStep = () => this.animateProperty({shape, property, startValue: leftValue, endValue: rightValue});
    const thirdStep = () => this.animateProperty({shape, property, startValue: rightValue, endValue: startValue});
    const promise = Array.from({length}).reduce(promise => promise.then(firstStep).then(secondStep).then(thirdStep), Promise.resolve(shape));

    return promise;
  }

  /**
   * Main method that calls when shape need to be animated.
   *
   * @override
   * @param {Shape} shape
   */
  animate(shape) {
    const direction = this.getDirection();

    if (/bounce/.test(direction)) return this._animateBounce(shape, direction);
    if (/shake/.test(direction)) return this._animateShake(shape, direction);

    return Promise.reject(`Unknown direction: ${direction}`);
  }

  /**
   * Serializes animation to Object representation.
   *
   * @returns {Object}
   */
  toObject() {
    const obj = super.toObject();

    Object.assign(obj.options, {
      direction: this.get('direction'),
      offset: this.get('offset'),
      repeat: this.get('repeat')
    });

    return obj;
  }
}
