import { useEffect, useState } from "react";
import LearningEntry from "../components/LearningEntry";
import LearningEntryForm from "../components/LearningEntryForm";
import type { LearningEntryData } from "../types/LearningEntryData";

export default function EntriesPage() {
    const [serverEntries, setServerEntries] = useState<LearningEntryData[]>([]);
    const [loadError, setLoadError] = useState("");

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

  return (
    <main>
      <h1>Entries</h1>
      <LearningEntryForm onSaved={loadServerEntries} />
      <section>
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
      </section>
    </main>
  );
}