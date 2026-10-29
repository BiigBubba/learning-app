import express from "express";
import cors from "cors";

type LearningEntryData = {
  id: number;
  topic: string;
  date: string;
  learned: string;
  confidence: number;
  comment: string;
};

const app = express();
app.use(cors());
const PORT = 3001;

const entries: LearningEntryData[] = [
  {
    id: 1,
    topic: "React Components",
    date: "2026-10-22",
    learned: "Components help us reuse UI code.",
    confidence: 4,
    comment: "I feel confident about this topic.",
  },
  {
    id: 2,
    topic: "React State",
    date: "2026-10-27",
    learned: "State lets the interface react to changes.",
    confidence: 2,
    comment: "I need more practice with this topic.",
  },
  {
    id: 3,
    topic: "Express backend",
    date: "2026-10-29",
    learned: "I learned how to set up a simple Express backend.",
    confidence: 3,
    comment: "I could use some practical experience with this.",
  }
];

app.get("/api/entries", (req, res) => {
  res.json(entries);
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});