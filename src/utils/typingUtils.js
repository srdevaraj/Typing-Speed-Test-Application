export const getCharacterStatus = (expectedCharacter, typedCharacter) => {
  if (typedCharacter === undefined) {
    return "pending";
  }

  if (expectedCharacter === typedCharacter) {
    return "correct";
  }

  return "incorrect";
};

export const countCharacters = (typedText, passage) => {
  let correct = 0;
  let incorrect = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === passage[i]) {
      correct++;
    } else {
      incorrect++;
    }
  }

  return {
    correct,
    incorrect
  };
};