import React, { useEffect, useMemo, useState } from "react";
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

function safeUrl(url: string) {
    try {
        // допускаем http/https
        const u = new URL(url);
        if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
        return null;
    } catch {
        return null;
    }
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
                                            registerEl,
                                        }: Props) {
    const badgeText = useMemo(() => {
        const parts: string[] = [];
        if (step.duration) parts.push(String(step.duration));
        const dl = difficultyLabel(step.difficulty);
        if (dl) parts.push(dl);
        return parts.length ? parts.join(" • ") : `этап ${index + 1}`;
    }, [index, step.duration, step.difficulty]);

    const tags: string[] = Array.isArray(step.tags) ? step.tags : [];

    const links: Array<{ label: string; url: string }> = Array.isArray(step.links)
        ? step.links.filter((l: any) => l && typeof l.label === "string" && typeof l.url === "string")
        : [];

    const checklist: string[] = Array.isArray(step.checklist)
        ? step.checklist.filter((x: any) => typeof x === "string" && x.trim().length > 0)
        : [];

    // --- local checklist state per step ---
    const storageKey = `roadmap:checklist:${step.id}`;

    const [checked, setChecked] = useState<Record<number, boolean>>({});

    useEffect(() => {
        // загрузка при смене шага
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) {
                setChecked({});
                return;
            }
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") setChecked(parsed);
            else setChecked({});
        } catch {
            setChecked({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step.id]);

    useEffect(() => {
        // сохранение
        try {
            localStorage.setItem(storageKey, JSON.stringify(checked));
        } catch {
            // ignore
        }
    }, [storageKey, checked]);

    const completedCount = useMemo(() => {
        if (!checklist.length) return 0;
        let c = 0;
        for (let i = 0; i < checklist.length; i++) if (checked[i]) c++;
        return c;
    }, [checklist.length, checked]);

    const progressLabel =
        checklist.length > 0 ? `${completedCount}/${checklist.length} пунктов` : null;

    return (
        <div className="cardWrap">
            <motion.div
                ref={(el) => registerEl(step.id, el)}
                className={["card", isActive ? "isActive" : "", isDone ? "isDone" : ""].join(" ")}
                layout={false}
                initial={false}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
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
                            {step.title} {isDone ? <span className="doneHint">✓</span> : null}
                        </h3>

                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <span className="badge">{badgeText}</span>
                            {progressLabel ? <span className="badge">{progressLabel}</span> : null}
                        </div>
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

                            {/* LINKS */}
                            {links.length ? (
                                <div className="section" aria-label="Ресурсы" onClick={(e) => e.stopPropagation()}>
                                    <div className="sectionTitle">Ресурсы</div>
                                    <ul className="linkList">
                                        {links.map((l, idx) => {
                                            const url = safeUrl(l.url);
                                            return (
                                                <li key={`${l.url}-${idx}`}>
                                                    {url ? (
                                                        <a
                                                            className="linkItem"
                                                            href={url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {l.label}
                                                            <span className="linkHint">↗</span>
                                                        </a>
                                                    ) : (
                                                        <span className="linkItem linkItemDisabled">{l.label}</span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ) : null}

                            {/* CHECKLIST */}
                            {checklist.length ? (
                                <div
                                    className="section"
                                    aria-label="Чеклист"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="sectionTitle">Чеклист</div>

                                    <div className="checklist">
                                        {checklist.map((item, i) => (
                                            <label className="checkItem" key={`${step.id}-chk-${i}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!checked[i]}
                                                    onChange={() =>
                                                        setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
                                                    }
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <span className={checked[i] ? "checkText isChecked" : "checkText"}>
                          {item}
                        </span>
                                            </label>
                                        ))}
                                    </div>

                                    <button
                                        className="btn btnSmall"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setChecked({});
                                        }}
                                        title="Сбросить чеклист"
                                        aria-label="Сбросить чеклист"
                                    >
                                        Сбросить
                                    </button>
                                </div>
                            ) : null}

                            {/* TAGS */}
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
