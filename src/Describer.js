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
  constructor ({random, toneManager, language = undefined}) {
    this.random = random;
    this.randomArrayValue = (array) => randomArrayValue(array, this.random);
    this.toneManager = toneManager;
    this.language = language || require('./LanguageGenerator')(this.random);
  }

  location ({
    placeName = 'it',
    numSentences = undefined,
  } = {}) {
    const sentences = [];
    const numberOfSentences = numSentences || Math.ceil(this.random() * MAX_SENTENCES);
    for (let i = 0; i < numberOfSentences; i++) {
      const subject = {
        noun: (i === 0) ? placeName : 'it',
      };
      const action = {
        verb: 'is',
      };
      const object = {};

      switch (i) {
        case 0: {
          if (this.random() > 0.5) {
            action.verb = 'was';
            object.adjective = 'once';
          }
          object.noun = 'home';
          object.prepositional = 'to the ' + this.language.name + ' people';
          break;
        }
        case 1: {
          action.verb = 'used to be';
          object.adjective = this.toneManager.chooseOppositeToneWord('adjectives');
          object.prepositional = 'but is now ' + this.toneManager.chooseTonallyAppropriateWord('adjectives');
          break;
        }
        case 2: {
          subject.noun = 'anyone';
          subject.prepositional = 'who has been there';
          action.verb = 'would tell you that ' + placeName + ' is';
          object.adjective = this.toneManager.getRandomWord('adjectives');
          object.prepositional = 'yet ' + this.toneManager.chooseTonallyAppropriateWord('adjectives');
          break;
        }
        default: {
          object.adjective = this.toneManager.chooseTonallyAppropriateWord('adjectives');
          break;
        }
      }

      const sentence = sentenceBuilder({
        subject,
        action,
        object,
      });

      sentences.push(sentence);
    }

    return sentences.join(' ');
  }
}

module.exports = (settings) => new Describer(settings);