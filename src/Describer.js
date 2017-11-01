import {randomArrayValue, capitalize} from './helpers';
import {
  MAX_SENTENCES,
  POSITIVE,
  NEGATIVE,
  FEARFUL,
  EXCITED,
  NEUTRAL,
} from './constants';

import sentenceBuilder from './sentenceBuilder';

class Describer {
  constructor (random) {
    this.random = random;
    this.randomArrayValue = (array) => randomArrayValue(array, this.random);
  }

  location ({
    language = null,
    placeName = 'it',
    feeling = null,
    numSentences = undefined,
  } = {}) {
    if (!language) language = require('./LanguageGenerator')(this.random);
    if (!feeling) {
      switch (Math.ceil(this.random() * 5)) {
        case 1: {
          feeling = POSITIVE;
          break;
        }
        case 2: {
          feeling = NEGATIVE;
          break;
        }
        case 3: {
          feeling = FEARFUL;
          break;
        }
        case 4: {
          feeling = EXCITED;
          break;
        }
        default: {
          feeling = NEUTRAL;
          break;
        }
      }
    }

    const numberOfSentences = numSentences || Math.ceil(this.random() * MAX_SENTENCES);
    for (let i = 0; i < numberOfSentences; i++) {
      
    }
  }
}

module.exports = (random) => new Describer(random);