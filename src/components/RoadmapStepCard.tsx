import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoadmapStep } from "../data/roadmap";

type Props = {
    step: RoadmapStep<any>;
    index: number;
    side: "left" | "right" | "single";
    isDone: boolean;
    isActive: boolean;
    isOpen: boolean;
    onToggleOpen: () => void;
    onToggleDone: () => void;
    registerEl: (id: string, el: HTMLDivElement | null) => void;
};

function difficultyLabel(v?: string) {
    if (v === "easy") return "легко";
    if (v === "mid") return "средне";
    if (v === "hard") return "сложно";
    return undefined;
}

export default function RoadmapStepCard({
                                            step,
                                            index,
                                            side,
                                            isDone,
                                            isActive,
                                            isOpen,
                                            onToggleOpen,
                                            onToggleDone,
                                            registerEl
                                        }: Props) {
    const badgeText = useMemo(() => {
        const parts: string[] = [];
        if (step.duration) parts.push(String(step.duration));
        const dl = difficultyLabel(step.difficulty);
        if (dl) parts.push(dl);
        return parts.length ? parts.join(" • ") : `этап ${index + 1}`;
    }, [index, step.duration, step.difficulty]);

    const tags: string[] = Array.isArray(step.tags) ? step.tags : [];


    return (
        <div className="cardWrap">
            <motion.div
                ref={(el) => registerEl(step.id, el)}
                className={[
                    "card",
                    isActive ? "isActive" : "",
                    isDone ? "isDone" : ""
                ].join(" ")}
                layout
                initial={false}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                onMouseEnter={() => {/* handled in parent via pointer events */}}
            >
                <div
                    className="cardHead"
                    style={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                    onClick={onToggleOpen}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onToggleOpen();
                    }}
                    aria-expanded={isOpen}
                >
                    <div style={{ display: "grid", gap: 4 }}>
                        <h3 className="cardTitle">
                            {step.title}{" "}
                            {isDone ? <span className="doneHint">✓</span> : null}
                        </h3>
                        <span className="badge">{badgeText}</span>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {isOpen ? (
                        <motion.div
                            className="cardBody"
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                        >
                            <div>{step.description}</div>

                            {tags.length ? (
                                <div className="metaRow" aria-label="Теги">
                                    {tags.map((t) => (
                                        <span className="tag" key={t}>
                      #{t}
                    </span>
                                    ))}
                                </div>
                            ) : null}
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <div className="controls">
                    <label className="checkbox" title="Сохраняется на этом устройстве">
                        <input
                            type="checkbox"
                            checked={isDone}
                            onChange={onToggleDone}
                            onClick={(e) => e.stopPropagation()}
                        />
                        Пройдено
                    </label>

                    <button
                        className="btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleOpen();
                        }}
                        aria-label={isOpen ? "Свернуть" : "Развернуть"}
                        title={isOpen ? "Свернуть" : "Развернуть"}
                    >
                        {isOpen ? "Свернуть" : "Подробнее"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
