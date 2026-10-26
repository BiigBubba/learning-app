import { useState } from "react";
import LearningEntry from "./components/LearningEntry";
import type { LearningEntryData } from "./types/LearningEntryData";

const firstEntry: LearningEntryData = {
  id: 1,
  topic: "React Components",
  date: "2026-10-26",
  learned: "Components help divide the UI into reusable parts.",
  confidence: 4,
  comment: "I feel confident about this topic.",
};

const secondEntry: LearningEntryData = {
  id: 2,
  topic: "React and TypeScript basics",
  date: "2026-10-21",
  learned: "I learned about React components and TypeScript integration.",
  confidence: 4,
  comment: "I'm not fully confident about this yet but practice makes perfect.",
};

const initialEntries: LearningEntryData[] = [firstEntry, secondEntry];

function App() {
  const studentName: string = "Werneri Koski";

  const [entries, setEntries] = useState<LearningEntryData[]>(initialEntries);

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [learned, setLearned] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [comment, setComment] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  function handleAddEntry() {
    if (topic.trim() === "" || learned.trim() === "") {
      setErrorMessage("Topic and what you learned cannot be empty.");
      return;
    }
    if (date === "") {
      setErrorMessage("Please choose a date.");
      return;
    }
    if (!Number.isInteger(confidence) || confidence < 1 || confidence > 5) {
      setErrorMessage("Confidence must be a whole number from 1 to 5.");
      return;
    }

    const newEntry: LearningEntryData = {
      id: Date.now(),
      topic: topic.trim(),
      date,
      learned: learned.trim(),
      confidence,
      comment: comment.trim(),
    };

    setEntries((currentEntries) => [...currentEntries, newEntry]);

    setTopic("");
    setDate("");
    setLearned("");
    setConfidence(3);
    setComment("");
    setErrorMessage("");
  }

  return (
    <main>
      <h1>My Learning</h1>
      <p>Fullstack Project</p>
      <p>Student: {studentName}</p>

      <section>
        <h2>Add a new learning entry</h2>

        <div>
          <label htmlFor="topic">Topic</label>
          <input
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="learned">What I learned</label>
          <textarea
            id="learned"
            value={learned}
            onChange={(event) => setLearned(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confidence">Confidence (1-5)</label>
          <select
            id="confidence"
            value={confidence}
            onChange={(event) => setConfidence(Number(event.target.value))}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
        </div>

        {errorMessage !== "" && <p role="alert">{errorMessage}</p>}

        <button type="button" onClick={handleAddEntry}>
          Add entry
        </button>
      </section>

      <section>
        <h2>Entries</h2>
        <ul>
          {entries.map((entry) => (
            <li key={entry.id}>
              <LearningEntry entry={entry} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
