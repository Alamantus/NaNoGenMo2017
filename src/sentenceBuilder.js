import {capitalize} from './helpers';

export default ({
  subject = {},
  action = {},
  object = {},
  punctuation = '.',
} = {}) => {
  let sentence = '';

  if (subject.hasOwnProperty('adjective')) {
    sentence += subject.adjective + ' ';
  }
  if (subject.hasOwnProperty('noun')) {
    sentence += subject.noun + ' ';
  }
  if (subject.hasOwnProperty('prepositional')) {
    sentence += subject.prepositional + ' ';
  }

  if (action.hasOwnProperty('adverb')) {
    sentence += action.adverb + ' ';
  }
  if (action.hasOwnProperty('verb')) {
    sentence += action.verb + ' ';
  }

  if (object.hasOwnProperty('adjective')) {
    sentence += object.adjective + ' ';
  }
  if (object.hasOwnProperty('noun')) {
    sentence += object.noun + ' ';
  }
  if (object.hasOwnProperty('prepositional')) {
    sentence += object.prepositional + ' ';
  }

  return capitalize(sentence.trim()) + punctuation;
}
