export default function TypingInput({
  value,
  onChange,
  disabled,
  inputRef,
}) {
  return (
    <textarea
      ref={inputRef}
      className="typing-input"
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      disabled={disabled}
      placeholder="Start typing here..."
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />
  );
}