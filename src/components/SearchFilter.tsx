import React from "react";

type Props = {
    query: string;
    onChange: (v: string) => void;
    hintRight?: React.ReactNode;
};

export default function SearchFilter({ query, onChange, hintRight }: Props) {
    return (
        <div className="row">
            <div className="input" title="Поиск по этапам">
                <span style={{ opacity: 0.75 }}>🔎</span>
                <input
                    value={query}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Поиск по этапам (например: метрики, бустинг, продакшен)…"
                />
                {query ? (
                    <button
                        className="btn"
                        onClick={() => onChange("")}
                        aria-label="Очистить поиск"
                        title="Очистить"
                    >
                        ×
                    </button>
                ) : null}
            </div>

            {hintRight ?? null}
        </div>
    );
}
