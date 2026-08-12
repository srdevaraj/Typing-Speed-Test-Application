import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_TEST_DURATION,
} from "../constants/testConfig";

import {
  getRandomPassage,
} from "../data/passages";

import {
  calculateAccuracy,
} from "../utils/calculateAccuracy";

import {
  calculateWPM,
} from "../utils/calculateWPM";

import {
  countCharacters,
} from "../utils/typingUtils";

import useTimer from "./useTimer";

export default function useTypingTest() {
  const [duration, setDuration] =
    useState(
      DEFAULT_TEST_DURATION
    );

  const [passage, setPassage] =
    useState(getRandomPassage());

  const [typedText, setTypedText] =
    useState("");

  const [isStarted, setIsStarted] =
    useState(false);

  const [isFinished, setIsFinished] =
    useState(false);

  const finishTest =
    useCallback(() => {
      setIsFinished(true);
      setIsStarted(false);
    }, []);

  const {
    timeLeft,
    elapsedTime,
  } = useTimer(
    duration,
    isStarted && !isFinished,
    finishTest
  );

  /**
   * Finish if the entire passage
   * has been typed.
   */
  useEffect(() => {
    if (
      typedText.length >=
      passage.length
    ) {
      finishTest();
    }
  }, [
    typedText,
    passage,
    finishTest,
  ]);

  const {
    correct,
    incorrect,
  } = useMemo(() => {
    return countCharacters(
      typedText,
      passage
    );
  }, [
    typedText,
    passage,
  ]);

  const wpm = useMemo(() => {
    return calculateWPM(
      correct,
      elapsedTime
    );
  }, [
    correct,
    elapsedTime,
  ]);

  const accuracy = useMemo(() => {
    return calculateAccuracy(
      correct,
      incorrect
    );
  }, [
    correct,
    incorrect,
  ]);

  const handleTyping = useCallback(
    (value) => {
      if (isFinished) {
        return;
      }

      if (!isStarted) {
        setIsStarted(true);
      }

      /**
       * Don't allow typing beyond
       * passage length.
       */
      setTypedText(
        value.slice(
          0,
          passage.length
        )
      );
    },
    [
      isFinished,
      isStarted,
      passage.length,
    ]
  );

  const restartTest =
    useCallback(() => {
      setTypedText("");
      setPassage(
        getRandomPassage()
      );
      setIsStarted(false);
      setIsFinished(false);
    }, []);

  const changeDuration =
    useCallback(
      (newDuration) => {
        setDuration(newDuration);
        setTypedText("");
        setPassage(
          getRandomPassage()
        );
        setIsStarted(false);
        setIsFinished(false);
      },
      []
    );

  return {
    passage,
    typedText,

    duration,
    timeLeft,
    elapsedTime,

    isStarted,
    isFinished,

    correctCharacters: correct,
    incorrectCharacters: incorrect,

    wpm,
    accuracy,

    handleTyping,
    restartTest,
    changeDuration,
  };
}