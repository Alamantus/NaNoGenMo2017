import seedrandom from 'seedrandom';
const random = seedrandom();

console.log('Generating!');

const language = require('./LanguageGenerator')(random);
// console.log(language.test());

const toneManager = require('./ToneManager')(random);
// console.log(toneManager.currentTone);
// let output = '';
// for (let i = 0; i < 50; i++) {
//   output += toneManager.chooseTonallyAppropriateWord('adjectives');
//   output += '(' + toneManager.toneLevel.toString() + ': ' + toneManager.currentTone + ')';
//   output += ' ';
// }

// const describe = require('./Describer')({
//   random,
//   toneManager,
//   language
// });
// console.log(describe.location({placeName: 'the quarry'}));

import sentenceBuilder from './sentenceBuilder';
function generateConlangNovel() {
  const sentences = [];
  for (let i = 0; i < 10000; i++) {
    const subject = {
      adjective: random() > 0.5 ? undefined : language.lexicon.adjectives[Math.floor(random() * language.lexicon.adjectives.length)],
      noun: language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)],
      prepositional: random() > 0.85
        ? undefined
        : (language.lexicon.prepositions[Math.floor(random() * language.lexicon.prepositions.length)]
          + ' ' + language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)]),
    };
    const action = {
      adverb: random() > 0.85 ? undefined : language.lexicon.adverbs[Math.floor(random() * language.lexicon.adverbs.length)],
      verb: language.lexicon.verbs[Math.floor(random() * language.lexicon.verbs.length)],
    };
    const object = {
      adjective: random() > 0.5 ? undefined : language.lexicon.adjectives[Math.floor(random() * language.lexicon.adjectives.length)],
      noun: language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)],
      prepositional: random() > 0.85
        ? undefined
        : (language.lexicon.prepositions[Math.floor(random() * language.lexicon.prepositions.length)]
          + ' ' + language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)]),
    };

    const generateCompoundSentence = random() > 0.85;

    const sentence = sentenceBuilder({
      subject,
      action,
      object,
      punctuation: generateCompoundSentence ? ',' : (random() > 0.85 ? '!' : (random() > 0.85 ? '?' : '.')),
    });

    sentences.push(sentence);

    if (generateCompoundSentence) {
      const subject2 = {
        adjective: random() > 0.5 ? undefined : language.lexicon.adjectives[Math.floor(random() * language.lexicon.adjectives.length)],
        noun: language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)],
        prepositional: random() > 0.85
          ? undefined
          : (language.lexicon.prepositions[Math.floor(random() * language.lexicon.prepositions.length)]
            + ' ' + language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)]),
      };
      const action2 = {
        adverb: random() > 0.85 ? undefined : language.lexicon.adverbs[Math.floor(random() * language.lexicon.adverbs.length)],
        verb: language.lexicon.verbs[Math.floor(random() * language.lexicon.verbs.length)],
      };
      const object2 = {
        adjective: random() > 0.5 ? undefined : language.lexicon.adjectives[Math.floor(random() * language.lexicon.adjectives.length)],
        noun: language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)],
        prepositional: random() > 0.85
          ? undefined
          : (language.lexicon.prepositions[Math.floor(random() * language.lexicon.prepositions.length)]
            + ' ' + language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)]),
      };

      const sentence2 = language.lexicon.nouns[Math.floor(random() * language.lexicon.nouns.length)] +
        ' ' +
        sentenceBuilder({
          subject2,
          action2,
          object2,
          punctuation: random() > 0.85 ? '!' : (random() > 0.85 ? '?' : '.'),
        });

      sentences.push(sentence2);
    }
  }

  let output = '';
  sentences.forEach((sentence, index) => {
    output += sentence;
    output += (output.substr(-1) !== ',' && index % Math.ceil(random() * 10 + 1) === 0) ? '\n\n' : ' ';
  });

  return output;
}

console.log(generateConlangNovel());
