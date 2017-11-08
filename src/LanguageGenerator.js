import {randomArrayValue, capitalize} from './helpers';
import {
  MAX_RETRIES,
  MAX_SYLLABLES,
} from './constants';

import sentenceBuilder from './sentenceBuilder';

class LanguageGenerator {
  constructor (random) {
    this.random = random;
    this.randomArrayValue = (array) => randomArrayValue(array, this.random);
    this.phonology = this.generatePhonology();
    this.phonotactics = this.generatePhonotactics();
    this.name = capitalize(this.generateWord({numSyllables: 2}));
    this.lexicon = this.generateLexicon();
  }

  generatePhonology (tries = 0) {
    const possibleConsonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
      possibleVowels = ['a', 'e', 'i', 'o', 'u'],
      consonants = [],
      vowels = [];

    possibleConsonants.forEach(letter => {
      if (this.random() > 0.5) consonants.push(letter);
    });
    possibleVowels.forEach(letter => {
      if (this.random() > 0.25) vowels.push(letter);
    });

    if (vowels.length < 1 && tries < MAX_RETRIES) {
      return this.generatePhonology(tries + 1);
    }

    return {
      consonants,
      vowels,
    };
  }

  generatePhonotactics (tries = 0) {
    const onset = [],
      nucleus = [],
      coda = [],
      overlapRestrictions = [];
    const maxSyllables = Math.ceil(this.random() * MAX_SYLLABLES);
    const blendConsonants = this.random() > 0.7;
    const blendVowels = this.random() > 0.2;

    if (this.random() < 0.7) onset.push(null);
    if (this.random() < 0.85) coda.push(null);

    this.phonology.consonants.forEach(letter => {
      if (this.random() > 0.5) onset.push(letter);
      if (this.random() < 0.15) nucleus.push(letter);
      if (this.random() > 0.5) coda.push(letter);

      this.phonology.consonants.forEach(pairedLetter => {
        if (this.random() < 0.2) overlapRestrictions.push(letter + pairedLetter);
      });
      this.phonology.vowels.forEach(pairedLetter => {
        if (this.random() < 0.1) overlapRestrictions.push(letter + pairedLetter);
      });
    });

    this.phonology.vowels.forEach(letter => {
      if (this.random() > 0.5) onset.push(letter);
      if (this.random() > 0.15) nucleus.push(letter);
      if (this.random() > 0.5) coda.push(letter);

      this.phonology.consonants.forEach(pairedLetter => {
        if (this.random() < 0.1) overlapRestrictions.push(letter + pairedLetter);
      });
      this.phonology.vowels.forEach(pairedLetter => {
        if (this.random() < 0.2) overlapRestrictions.push(letter + pairedLetter);
      });
    });

    if (nucleus.length < 1 && tries < MAX_RETRIES) {
      return this.generatePhonotactics(tries + 1);
    }

    return {
      onset,
      nucleus,
      coda,
      overlapRestrictions,
      maxSyllables,
      blendConsonants,
      blendVowels,
    }
  }

  generateSyllable () {
    let onset = this.randomArrayValue(this.phonotactics.onset),
      nucleus = this.randomArrayValue(this.phonotactics.nucleus),
      coda = this.randomArrayValue(this.phonotactics.coda);

    if (onset && nucleus) {
      let tries = 0;
      while (this.phonotactics.overlapRestrictions.includes(onset + nucleus) && tries < MAX_RETRIES) {
        nucleus = this.randomArrayValue(this.phonotactics.nucleus);
        tries++;
      }
    }
    if (nucleus && coda) {
      let tries = 0;
      while (this.phonotactics.overlapRestrictions.includes(nucleus + coda) && tries < MAX_RETRIES) {
        coda = this.randomArrayValue(this.phonotactics.coda);
        tries++;
      }
    }
    
    let syllable = (onset ? onset : '') + (nucleus ? nucleus : '') + (coda ? coda : '');
    return (syllable !== '') ? syllable : this.generateSyllable();
  }

  generateWord ({
    numSyllables = undefined,
    prefix = '',
    suffix = '',
  } = {}) {
    const syllableDistribution = this.phonotactics.maxSyllables / (this.random() < 0.7 ? 2 : 1);
    const numberOfSyllables = numSyllables || Math.ceil(this.random() * syllableDistribution);
    let syllables = [this.generateSyllable()];

    for (let i = 1; i < numberOfSyllables; i++) {
      let syllable = this.generateSyllable();
      let lastLetter = syllables[syllables.length - 1].substr(-1);

      let tries = 0;
      while (this.phonotactics.overlapRestrictions.includes(lastLetter + syllable.substr(-1)) && tries < MAX_RETRIES) {
        syllable = this.generateSyllable();
        tries++;
      }

      syllables.push(syllable);
    }

    return this.splitNonBlendedLetters(prefix + syllables.join('') + suffix);
  }

  splitNonBlendedLetters (word) {
    if (!this.phonotactics.blendConsonants || ! this.phonotactics.blendVowels) {
      let fixedWord = '';

      word.split('').forEach((letter, index) => {
        fixedWord += letter;

        if (index + 1 < word.length) {
          let nextLetter = word.substr(index + 1, 1);
          const breakConsonants = this.phonology.consonants.includes(letter)
            && this.phonology.consonants.includes(nextLetter)
            && ! this.phonotactics.blendConsonants;
          const breakVowels = this.phonology.vowels.includes(letter)
            && this.phonology.vowels.includes(nextLetter)
            && ! this.phonotactics.blendVowels;

          if (breakConsonants || breakVowels) {
            fixedWord += '\'';
          }
        }
      });

      return fixedWord;
    }

    return word;
  }

  generateLexicon () {
    const allowDuplicates = this.random() > 0.4;
    const nouns = [],
      adjectives = [],
      adverbs = [],
      verbs = [],
      prepositions = [],
      conjunctions = [];
    const adjectiveAffix = (this.random() > 0.6) ? null : {
      affix: (this.random() < 0.6) ? 'suffix' : 'prefix',
      value: this.generateSyllable(),
    };
    const adverbAffix = (this.random() > 0.5) ? null : {
      affix: (this.random() < 0.6) ? 'suffix' : 'prefix',
      value: this.generateSyllable(),
    };

    const nounTries = this.random() * 200;
    for (let n = 0; n < nounTries; n++) {
      const word = this.generateWord();
      const isUnique = !nouns.includes(word);

      if (allowDuplicates || isUnique) {
        nouns.push(word);
      }

      // Create derivatives?
      if (this.random() > 0.8 && adjectiveAffix) {
        const adjectiveForm = (adjectiveAffix.affix === 'prefix') ? adjectiveAffix.value + word : word + adjectiveAffix.value;
        adjectives.push(this.splitNonBlendedLetters(adjectiveForm));
      }
      if (this.random() > 0.9 && adverbAffix) {
        const adverbForm = (adverbAffix.affix === 'prefix') ? adverbAffix.value + word : word + adverbAffix.value;
        adverbs.push(this.splitNonBlendedLetters(adverbForm));
      }
    }

    const verbTries = this.random() * 200;
    for (let v = 0; v < verbTries; v++) {
      const word = this.generateWord();
      const isUnique = !nouns.includes(word) && !verbs.includes(word);

      if (allowDuplicates || isUnique) {
        verbs.push(word);
      }

      // Create derivatives?
      if (this.random() > 0.9 && adjectiveAffix) {
        const adjectiveForm = (adjectiveAffix.affix === 'prefix') ? adjectiveAffix.value + word : word + adjectiveAffix.value;
        adjectives.push(this.splitNonBlendedLetters(adjectiveForm));
      }
    }

    const adjectiveTries = this.random() * 300;
    for (let adj = 0; adj < adjectiveTries; adj++) {
      const wordOptions = {};
      // If there is an affix, give it ~50% chance of adding to non-derivative adjectives.
      if (adjectiveAffix && this.random() > 0.5) wordOptions[adjectiveAffix.affix] = adjectiveAffix.value;
      const word = this.generateWord(wordOptions);
      const isUnique = !nouns.includes(word) && !verbs.includes(word)
        && !adjectives.includes(word);

      if (allowDuplicates || isUnique) {
        adjectives.push(word);
      }

      // Create derivatives?
      if (this.random() > 0.7 && adverbAffix) {
        const adverbForm = (adverbAffix.affix === 'prefix')
          ? adverbAffix.value + word
          : word + adverbAffix.value;
        adverbs.push(this.splitNonBlendedLetters(adverbForm));
      }
    }

    const adverbTries = this.random() * 150;
    for (let adj = 0; adj < adverbTries; adj++) {
      const wordOptions = {};
      // If there is an affix, give it ~70% chance of adding to non-derivative adverbs.
      if (adverbAffix && this.random() > 0.3) wordOptions[adverbAffix.affix] = adverbAffix.value;
      const word = this.generateWord(wordOptions);
      const isUnique = !nouns.includes(word) && !verbs.includes(word)
        && !adjectives.includes(word) && !adverbs.includes(word);

      if (allowDuplicates || isUnique) {
        adverbs.push(word);
      }
    }

    const prepositionTries = this.random() * 50;
    for (let adj = 0; adj < prepositionTries; adj++) {
      const wordOptions = {
        numSyllables: Math.ceil(this.random() * 2),
      };
      const word = this.generateWord(wordOptions);
      const isUnique = !nouns.includes(word) && !verbs.includes(word)
        && !adjectives.includes(word) && !adverbs.includes(word)
        && !prepositions.includes(word);

      if (allowDuplicates || isUnique) {
        prepositions.push(word);
      }
    }

    const conjunctionTries = this.random() * 20;
    for (let adj = 0; adj < conjunctionTries; adj++) {
      const wordOptions = {
        numSyllables: 1,
      };
      const word = this.generateWord(wordOptions);
      const isUnique = !nouns.includes(word) && !verbs.includes(word)
        && !adjectives.includes(word) && !adverbs.includes(word)
        && !prepositions.includes(word) && !conjunctions.includes(word);

      if (allowDuplicates || isUnique) {
        conjunctions.push(word);
      }
    }

    return {
      nouns,
      adjectives,
      adverbs,
      verbs,
      prepositions,
      conjunctions,
    };
  }

  test () {
    const subject = {
      noun: this.lexicon.nouns[Math.floor(this.random() * this.lexicon.nouns.length)],
    };
    const action = {
      verb: this.lexicon.verbs[Math.floor(this.random() * this.lexicon.verbs.length)],
    };
    const object = {};
    const punctuation = (this.random() > 0.85) ? '!' : ((this.random() > 0.7) ? '?' : '.');

    if (this.random() > 0.6) {
      const adjective = Math.floor(this.random() * this.lexicon.adjectives.length);
      subject.adjective = this.lexicon.adjectives[adjective];
    }
    if (this.random() > 0.85) {
      const adverb = Math.floor(this.random() * this.lexicon.adverbs.length);
      action.adverb = this.lexicon.adverbs[adverb];
    }
    return sentenceBuilder({
      subject,
      action,
      object,
      punctuation,
    });
  }
}

module.exports = (random) => new LanguageGenerator(random);