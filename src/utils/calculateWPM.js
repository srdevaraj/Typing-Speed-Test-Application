import { WORDS_PER_MINUTE_DIVISOR } from "../constants/testConfig";

export const calculateWPM = (correctCharacters, elapsedSeconds) => {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  const minutes = elapsedSeconds / 60;

  return Math.round(
    (correctCharacters / WORDS_PER_MINUTE_DIVISOR) / minutes
  );
};