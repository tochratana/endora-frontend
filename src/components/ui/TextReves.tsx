import { WordRotate } from "../magicui/word-rotate";

export function WordRotateDemo() {
  return (
    <WordRotate
      className=" text-start inline bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
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
