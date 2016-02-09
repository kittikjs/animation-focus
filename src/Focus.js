import Animation from 'kittik-animation-basic';

const AVAILABLE_DIRECTIONS = ['bounceUp', 'bounceRight', 'bounceDown', 'bounceLeft', 'shakeX', 'shakeY'];

/**
 * Focus animation is responsible for attention seekers for your shape.
 *
 * @since 1.0.0
 */
export default class Focus extends Animation {
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
  _animateBounce(shape, direction = 'bounceUp') {
    let startValue = shape.getY();
    let endValue = shape.getY();
    let property = 'y';

    switch (direction) {
      case 'bounceUp':
        startValue = shape.getY();
        endValue = shape.getY() - this.getOffset();
        property = 'y';
        break;
      case 'bounceRight':
        startValue = shape.getX();
        endValue = shape.getX() + this.getOffset();
        property = 'x';
        break;
      case 'bounceDown':
        startValue = shape.getY();
        endValue = shape.getY() + this.getOffset();
        property = 'y';
        break;
      case 'bounceLeft':
        startValue = shape.getX();
        endValue = shape.getX() - this.getOffset();
        property = 'x';
        break;
    }

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
  _animateShake(shape, direction = 'shakeX') {
    let startValue = shape.getX();
    let leftValue = shape.getX();
    let rightValue = shape.getX();
    let property = 'x';

    switch (direction) {
      case 'shakeX':
        startValue = shape.getX();
        leftValue = shape.getX() - this.getOffset();
        rightValue = shape.getX() + this.getOffset();
        property = 'x';
        break;
      case 'shakeY':
        startValue = shape.getY();
        leftValue = shape.getY() - this.getOffset();
        rightValue = shape.getY() + this.getOffset();
        property = 'y';
        break;
    }

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
   * @param {Cursor} cursor
   */
  animate(shape, cursor) {
    const isBounce = this.getDirection().indexOf('bounce') !== -1;

    if (isBounce) {
      return this._animateBounce(shape, this.getDirection());
    } else {
      return this._animateShake(shape, this.getDirection());
    }
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
