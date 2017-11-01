import {randomArrayValue} from './helpers';

const MAX_RETRIES = 10;
const MAX_SYLLABLES = 6;

class LanguageGenerator {
  constructor (random) {
    this.random = random;
    this.randomArrayValue = (array) => randomArrayValue(array, this.random);
    this.phonology = this.generatePhonology();
    this.phonotactics = this.generatePhonotactics();
  }

  generatePhonology () {
    const possibleConsonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
      possibleVowels = ['a', 'e', 'i', 'o', 'u'],
      consonants = [],
      vowels = [];

    possibleConsonants.forEach(letter => {
      if (this.random() > 0.5) consonants.push(letter);
    });
    possibleVowels.forEach(letter => {
      if (this.random() > 0.5) vowels.push(letter);
    });

    return {
      consonants,
      vowels,
    };
  }

  generatePhonotactics () {
    const onset = [],
      nucleus = [],
      coda = [],
      overlapRestrictions = [];
    const maxSyllables = Math.ceil(this.random() * MAX_SYLLABLES);
    const blendConsonants = this.random() > 0.75;
    const blendVowels = this.random() > 0.5;

    if (this.random() > 0.5) onset.push(null);
    if (this.random() > 0.5) coda.push(null);

    this.phonology.consonants.forEach(letter => {
      if (this.random() > 0.5) onset.push(letter);
      if (this.random() > 0.5) nucleus.push(letter);
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
      if (this.random() > 0.5) nucleus.push(letter);
      if (this.random() > 0.5) coda.push(letter);

      this.phonology.consonants.forEach(pairedLetter => {
        if (this.random() < 0.1) overlapRestrictions.push(letter + pairedLetter);
      });
      this.phonology.vowels.forEach(pairedLetter => {
        if (this.random() < 0.2) overlapRestrictions.push(letter + pairedLetter);
      });
    });

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
    const numberOfSyllables = numSyllables || Math.ceil(this.random() * this.phonotactics.maxSyllables);
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
          const breakVowel = this.phonology.vowels.includes(letter)
            && this.phonology.vowels.includes(nextLetter)
            && ! this.phonotactics.blendVowels;

          if (breakConsonants || breakVowels) {
            fixedWord += '\'';
          }
        }
      }

      return fixedWord;
    }

    return word;
  }

  test () {
    return this.generateSyllable();
  }
}

module.exports = (random) => new LanguageGenerator(random);