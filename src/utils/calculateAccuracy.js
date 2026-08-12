export const calculateAccuracy = (
  correctCharacters,
  incorrectCharacters
) => {
  const totalCharacters =
    correctCharacters +
    incorrectCharacters;

  if (totalCharacters === 0) {
    return 100;
  }

  return Number(
    (
      (correctCharacters /
        totalCharacters) *
      100
    ).toFixed(2)
  );
};