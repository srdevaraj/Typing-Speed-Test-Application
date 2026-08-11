import "./TypingTest.css";
import { getCharacterStatus } from "../../utils/typingUtils";

export default function TypingText({ passage, typedText }) {
  return (
    <div className="typing-text">
      {passage.split("").map((character, index) => {
        const status = getCharacterStatus(
          character,
          typedText[index]
        );

        return (
          <span
            key={`${character}-${index}`}
            className={`typing-character ${status}`}
          >
            {character === " " ? "\u00A0" : character}
          </span>
        );
      })}
    </div>
  );
}