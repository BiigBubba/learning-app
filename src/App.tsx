function App() {
  const studentName: string = "Werneri Koski";

  return (
    <main>
      <h1>My Learning</h1>
      <p>Fullstack Project</p>
      <p>Student: {studentName}</p>
      <LearningEntry
        topic="React Components"
        date="2026-10-19"
        learned="Components help divide the UI into reusable parts."
        confidence={3}
        comment="I need to practice more with props and state."
      />

      <LearningEntry
        topic="React and TypeScript basics"
        date="21.10.2026"
        learned="I learned about React components and TypeScript integration."
        confidence={4}
        comment="I'm not fully confident about this yet but practice makes perfect."
      />
    </main>
  );
}

export default App;

import LearningEntry from "./components/LearningEntry";