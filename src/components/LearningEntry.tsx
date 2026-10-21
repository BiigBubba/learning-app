type LearningEntryProps = {
  topic: string;
  date: string;
  learned: string;
  confidence: number;
  comment: string;
};

function LearningEntry({ topic,date,learned,confidence,comment }: LearningEntryProps) {
  return (
    <article>
      <h2>{topic}</h2>
      <p>Date: {date}</p>
      <p>{learned}</p>
      <p>Confidence: {confidence} / 5</p>
      <p>"{comment}"</p>
    </article>
  );
}

export default LearningEntry;

