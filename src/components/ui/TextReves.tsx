import { WordRotate } from "../magicui/word-rotate";

export function WordRotateDemo() {
  return (
    <WordRotate
      className="text-center sm:text-start inline-block bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
      words={[
        "Manual Backend Setup",
        "Complex Configurations",
        "Database Struggles",
        "API Building Headaches",
      ]}
      duration={980}
    />
  );
}
