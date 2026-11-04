import { useEffect, useState } from "react";
import LearningEntry from "./components/LearningEntry";
import type { LearningEntryData } from "./types/LearningEntryData";

function App() {
  const studentName: string = "Werneri Koski";

  // Form field state
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [learned, setLearned] = useState("");
  const [confidence, setConfidence] = useState(3);
  const [comment, setComment] = useState("");

  // Feedback state
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  // The one list of entries shown on the page (comes from the backend / MariaDB)
  const [serverEntries, setServerEntries] = useState<LearningEntryData[]>([]);
  const [loadError, setLoadError] = useState("");

  // Used by the "Load from backend" button and to refresh the list after a POST.
  // It rethrows the error so callers can tell "save failed" from "refresh failed".
  async function loadServerEntries() {
    setLoadError("");
    try {
      const response = await fetch("http://localhost:3001/api/entries");
      if (!response.ok) throw new Error("Could not load entries");
      const data: LearningEntryData[] = await response.json();
      setServerEntries(data);
    } catch (error) {
      setLoadError("Could not load entries from the backend.");
      throw error;
    }
  }

  // Load saved entries automatically when the component first appears.
  useEffect(() => {
    let ignore = false;

    async function loadInitialEntries() {
      try {
        const response = await fetch("http://localhost:3001/api/entries");
        if (!response.ok) throw new Error("Could not load entries");
        const data: LearningEntryData[] = await response.json();
        if (!ignore) setServerEntries(data);
      } catch {
        if (!ignore) setLoadError("Could not load entries from the backend.");
      }
    }

    void loadInitialEntries();
    return () => { ignore = true; };
  }, []);

  async function handleAddEntry() {
    setMessage("");
    setErrorMessage("");

    // Validation stays before the request
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
    if (comment.trim() === "") {
      setErrorMessage("Comment cannot be empty.");
      return;
    }

    const newEntry = {
      topic,
      date,
      learned,
      confidence: Number(confidence),
      comment,
    };

    // 1) Save the entry (POST)
    try {
      const response = await fetch("http://localhost:3001/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) throw new Error("Could not save entry");
    } catch {
      setMessage("Saving failed. Please try again.");
      return;
    }

    // 2) Saved successfully: reset the form
    setTopic("");
    setDate("");
    setLearned("");
    setConfidence(3);
    setComment("");

    // 3) Refresh the list from the server (MariaDB generated the id)
    try {
      await loadServerEntries();
      setMessage("Entry saved successfully.");
    } catch {
      setMessage("Entry was saved, but the list could not be refreshed.");
    }
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
        {message && <p>{message}</p>}
      </section>

      <section>
        <h2>Entries from the backend</h2>
        <button
          type="button"
          onClick={() => { void loadServerEntries().catch(() => {}); }}
        >
          Load from backend
        </button>
        {loadError && <p>{loadError}</p>}
        <ul>
          {serverEntries.map((entry) => (
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
