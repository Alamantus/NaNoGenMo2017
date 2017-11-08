import {capitalize} from './helpers';

export default ({
  subject = {},
  action = {},
  object = {},
  punctuation = '.',
} = {}) => {
  let sentence = '';

  if (subject.adjective) {
    sentence += subject.adjective + ' ';
  }
  if (subject.noun) {
    sentence += subject.noun + ' ';
  }
  if (subject.prepositional) {
    sentence += subject.prepositional + ' ';
  }

  if (action.adverb) {
    sentence += action.adverb + ' ';
  }
  if (action.verb) {
    sentence += action.verb + ' ';
  }

  if (object.adjective) {
    sentence += object.adjective + ' ';
  }
  if (object.noun) {
    sentence += object.noun + ' ';
  }
  if (object.prepositional) {
    sentence += object.prepositional + ' ';
  }

  return capitalize(sentence.trim()) + punctuation;
}
