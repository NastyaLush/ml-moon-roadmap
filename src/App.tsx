import React, { useMemo, useState } from "react";
import Background from "./components/Background";
import Roadmap from "./components/Roadmap";
import ProgressBar from "./components/ProgressBar";
import SearchFilter from "./components/SearchFilter";
import { roadmapSteps } from "./data/roadmap";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [query, setQuery] = useState("");
  const [completedArr, setCompletedArr] = useLocalStorage<string[]>(
      "completedStepIds",
      []
  );

  const completedIds = useMemo(() => new Set(completedArr), [completedArr]);

  const onToggleDone = (id: string) => {
    setCompletedArr((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return Array.from(s);
    });
  };

  const total = roadmapSteps.length;
  const completed = completedArr.filter((id) => roadmapSteps.some((s) => s.id === id)).length;

  return (
      <div className="app">
        <Background />

        <header className="header">
          <div className="container">
            <h1 className="h-title">ML way ✨</h1>
            <p className="h-sub">
              Это маленький подарок от твоей Рунятки: чтобы твой путь в Machine Learning был не
              «ещё одним списком», а красивой дорожкой — тихой, ночной и твоей.
              <br />
              Подсказка: <span className="kbd">Пройдено</span> сохраняется только на этом устройстве.
            </p>

            <div className="panel">
              <SearchFilter
                  query={query}
                  onChange={setQuery}
                  hintRight={
                    <>
                      <ProgressBar completed={completed} total={total} />

                    </>
                  }
              />
            </div>
          </div>
        </header>

        <main className="main">
          <div className="container">
            <Roadmap
                steps={roadmapSteps}
                completedIds={completedIds}
                onToggleDone={onToggleDone}
                query={query}
            />
          </div>
        </main>

        <footer className="footer">
          <div className="container">С любовью — и пусть у тебя всегда будет немного лунного света ✦</div>
        </footer>
      </div>
  );
}
