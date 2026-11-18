import { useEffect, useState } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { loadEntries } from "../api/entries";
import LearningEntry from "../components/LearningEntry";
import LearningEntryForm from "../components/LearningEntryForm";

export default function EntriesPage() {
  const entries = useLearningStore((state) => state.entries);
  const [loadError, setLoadError] = useState("");

  async function handleLoadEntries() {
    setLoadError("");

    try {
      await loadEntries();
    } catch {
      setLoadError("Could not load entries. Please try again.");
    }
  }

  useEffect(() => {
    void handleLoadEntries();
  }, []);

  return (
    <main>
      <h1>Entries</h1>
      <LearningEntryForm />
      <section>
        <h2>Entries from the backend</h2>
        <button type="button" onClick={() => void handleLoadEntries()}>
          Load from backend
        </button>
        {loadError && <p role="alert">{loadError}</p>}

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