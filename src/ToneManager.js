import {
  MAX_TONE_LEVEL,
  MIN_TONE_LEVEL,
  TONE_THRESHOLD,
  TONE_ADJUST_AMOUNT,
  EXCITED,
  POSITIVE,
  NEUTRAL,
  NEGATIVE,
  FEARFUL,
} from './constants';

import wordGroups from './WordManager';

class ToneManager {
  constructor (random) {
    this.random = random;
    this.toneLevel = 0.5;

    this.toneThreshold = (MAX_TONE_LEVEL - MIN_TONE_LEVEL) / 4;
  }

  get currentTone () {
    if (MIN_TONE_LEVEL <= this.toneLevel && this.toneLevel < MIN_TONE_LEVEL + this.toneThreshold) {
      return FEARFUL;
    }
    if (MIN_TONE_LEVEL + this.toneThreshold <= this.toneLevel && this.toneLevel < MIN_TONE_LEVEL + (2 * this.toneThreshold)) {
      return NEGATIVE;
    }
    // if (MIN_TONE_LEVEL + (2 * this.toneThreshold) <= this.toneLevel && this.toneLevel < MAX_TONE_LEVEL - (2 * this.toneThreshold)) {
    //   return NEUTRAL;
    // }
    if (MAX_TONE_LEVEL - (2 * this.toneThreshold) <= this.toneLevel && this.toneLevel <= MAX_TONE_LEVEL + this.toneThreshold) {
      return POSITIVE;
    }
    if (MAX_TONE_LEVEL - this.toneThreshold < this.toneLevel && this.toneLevel <= MAX_TONE_LEVEL) {
      return EXCITED;
    }

    // Fallback if something goes wrong.
    return NEUTRAL;
  }

  chooseTonallyAppropriateWord (wordGroup) {
    // 5% chance that the word will be one tone level lower/higher
    const willBeTonallyAppropriate = this.random() <= 0.95;

    if (willBeTonallyAppropriate) {
      if (this.random() < 0.01) this.shakeThingsUp();

      switch (this.currentTone) {
        case EXCITED: {
          const doAdjustTone = this.random() < 0.2;
          if (doAdjustTone) {
            const adjustAmount = TONE_ADJUST_AMOUNT * (this.random() >= 0.25 ? -1 : 1);
            this.adjustToneLevel(adjustAmount);
          }
          return this.getExcitedWord(wordGroup);
        }
        case POSITIVE: {
          const doAdjustTone = this.random() < 0.4;
          if (doAdjustTone) {
            const adjustAmount = TONE_ADJUST_AMOUNT * (this.random() >= 0.5 ? 1 : -1);
            this.adjustToneLevel(adjustAmount);
          }
          return this.getPositiveWord(wordGroup);
        }
        case NEGATIVE: {
          const doAdjustTone = this.random() < 0.4;
          if (doAdjustTone) {
            const adjustAmount = TONE_ADJUST_AMOUNT * (this.random() >= 0.5 ? -1 : 1);
            this.adjustToneLevel(adjustAmount);
          }
          return this.getNegativeWord(wordGroup);
        }
        case FEARFUL: {
          const doAdjustTone = this.random() < 0.2;
          if (doAdjustTone) {
            const adjustAmount = TONE_ADJUST_AMOUNT * (this.random() >= 0.25 ? 1 : -1);
            this.adjustToneLevel(adjustAmount);
          }
          return this.getFearfulWord(wordGroup);
        }
      }
    } else {
      switch (this.currentTone) {
        case EXCITED: {
          const toneAdjustment = TONE_ADJUST_AMOUNT * (this.random() * 2);
          this.adjustToneLevel(-TONE_ADJUST_AMOUNT);
          return this.getPositiveWord(wordGroup);
        }
        case POSITIVE: {
          const toneDirection = (this.random() < 0.5) ? -2 : 1;
          this.adjustToneLevel(TONE_ADJUST_AMOUNT * toneDirection);
          return (toneDirection > 0)
            ? this.getExcitedWord(wordGroup)
            : this.getNegativeWord(wordGroup);
        }
        case NEGATIVE: {
          const toneDirection = (this.random() < 0.5) ? -1 : 2;
          this.adjustToneLevel(TONE_ADJUST_AMOUNT * toneDirection);
          return (toneDirection > 0)
            ? this.getPositiveWord(wordGroup)
            : this.getFearfulWord(wordGroup);
        }
        case FEARFUL: {
          const toneAdjustment = TONE_ADJUST_AMOUNT * (this.random() * 2);
          this.adjustToneLevel(TONE_ADJUST_AMOUNT);
          return this.getNegativeWord(wordGroup);
        }
      }
    }

    // if something goes wrong
    return this.getNeutralWord();
  }

  shakeThingsUp () {
    const adjustAmount = TONE_ADJUST_AMOUNT * (Math.floor(this.random() * 3) + 1);
    if (this.toneLevel >= 0.5) {
      this.toneLevel -= adjustAmount;
    } else {
      this.toneLevel += adjustAmount;
    }
  }

  getNeutralWord (wordGroup) {
    const neutralWords = wordGroups[wordGroup].neutral;
    return neutralWords[Math.floor(this.random() * neutralWords.length)];
  }

  getPositiveWord (wordGroup) {
    const positiveWords = wordGroups[wordGroup].positive;
    return positiveWords[Math.floor(this.random() * positiveWords.length)];
  }

  getExcitedWord (wordGroup) {
    const excitedWords = wordGroups[wordGroup].excited;
    return excitedWords[Math.floor(this.random() * excitedWords.length)];
  }

  getNegativeWord (wordGroup) {
    const negativeWords = wordGroups[wordGroup].negative;
    return negativeWords[Math.floor(this.random() * negativeWords.length)];
  }

  getFearfulWord (wordGroup) {
    const fearfulWords = wordGroups[wordGroup].fearful;
    return fearfulWords[Math.floor(this.random() * fearfulWords.length)];
  }

  adjustToneLevel (adjustment) {
    const newToneLevel = this.toneLevel + adjustment;

    if (this.newToneLevel >= MAX_TONE_LEVEL) {
      this.toneLevel = MAX_TONE_LEVEL;
    } else if (newToneLevel <= MIN_TONE_LEVEL) {
      this.toneLevel = MIN_TONE_LEVEL;
    } else {
      this.toneLevel = newToneLevel;
    }

    return this.toneLevel;
  }
}

module.exports = (random) => new ToneManager(random);
