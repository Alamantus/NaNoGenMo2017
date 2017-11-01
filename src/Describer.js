import {randomArrayValue, capitalize} from './helpers';

import sentenceBuilder from './sentenceBuilder';

const MAX_SENTENCES = 10;

class Describer {
  constructor (random) {
    this.random = random;
    this.randomArrayValue = (array) => randomArrayValue(array, this.random);
  }

  location ({
    placeName = 'it',
    feeling = undefined,
    numSentences = undefined,
  } = {}) {
    const numberOfSentences = numSentences || Math.ceil(this.random() * MAX_SENTENCES);
  }
}

module.exports = (random) => new Describer(random);