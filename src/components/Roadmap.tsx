import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { RoadmapStep } from "../data/roadmap";
import RoadmapStepCard from "./RoadmapStepCard";
import { useReducedMotionPref } from "../hooks/useReducedMotionPref";

type Props = {
    steps: Array<RoadmapStep<any>>;
    completedIds: Set<string>;
    onToggleDone: (id: string) => void;
    query: string;
};

type RectMap = Record<string, DOMRect>;
type Side = "left" | "right";

export default function Roadmap({ steps, completedIds, onToggleDone, query }: Props) {
    const reducedMotion = useReducedMotionPref();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const elMapRef = useRef<Map<string, HTMLDivElement>>(new Map());

    const [openIds, setOpenIds] = useState<Set<string>>(
        () => new Set([steps[0]?.id].filter(Boolean) as string[])
    );
    const [activeId, setActiveId] = useState<string | null>(null);
    const [rects, setRects] = useState<RectMap>({});

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return steps;
        return steps.filter((s) => {
            const hay = [
                s.title,
                s.description,
                Array.isArray(s.tags) ? s.tags.join(" ") : ""
            ]
                .join(" ")
                .toLowerCase();
            return hay.includes(q);
        });
    }, [steps, query]);

    const registerEl = (id: string, el: HTMLDivElement | null) => {
        const map = elMapRef.current;
        if (!el) {
            map.delete(id);
            return;
        }
        map.set(id, el);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const measure = () => {
            const cRect = container.getBoundingClientRect();
            const next: RectMap = {};

            for (const s of filtered) {
                const el = elMapRef.current.get(s.id);
                if (!el) continue;
                const r = el.getBoundingClientRect();

                next[s.id] = new DOMRect(
                    r.left - cRect.left,
                    r.top - cRect.top,
                    r.width,
                    r.height
                );
            }

            setRects(next);
        };

        measure();

        const RO = (window as any).ResizeObserver as typeof ResizeObserver | undefined;
        let ro: ResizeObserver | null = null;

        if (RO) {
            ro = new RO(() => measure());
            ro.observe(container);

            for (const s of filtered) {
                const el = elMapRef.current.get(s.id);
                if (el) ro.observe(el);
            }
        }

        window.addEventListener("scroll", measure, { passive: true });
        window.addEventListener("resize", measure);

        return () => {
            ro?.disconnect();
            window.removeEventListener("scroll", measure);
            window.removeEventListener("resize", measure);
        };
    }, [filtered, openIds]);

    const toggleOpen = (id: string) => {
        setOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const isMobile = useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia?.("(max-width: 820px)")?.matches ?? false;
    }, []);

    // --- ЛИНИИ: коннектор карточка -> ось + одна точка на оси для КАЖДОГО шага ---

    const getAxisX = () => {
        const c = containerRef.current;
        if (!c) return 0;
        return c.clientWidth / 2;
    };

    const getSide = (idx: number): Side => (idx % 2 === 0 ? "left" : "right");

    const cardAnchor = (r: DOMRect, side: Side) => {
        const y = r.y + r.height / 2;
        const x = side === "left" ? r.x + r.width + 10 : r.x - 10;
        return { x, y };
    };

    const axisPoint = (y: number) => ({ x: getAxisX(), y });

    const connectors = useMemo(() => {
        const res: Array<{ key: string; d: string; id: string }> = [];

        for (let i = 0; i < filtered.length; i++) {
            const step = filtered[i];
            const r = rects[step.id];
            if (!r) continue;

            const side = getSide(i);
            const a = cardAnchor(r, side);
            const b = axisPoint(a.y);

            const dist = Math.abs(b.x - a.x);
            const bend = Math.min(160, Math.max(70, dist * 0.6));

            const c1 = { x: a.x + (side === "left" ? bend : -bend), y: a.y };
            const c2 = { x: b.x, y: b.y };

            const d = `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;

            res.push({ key: step.id, d, id: step.id });
        }

        return res;
    }, [filtered, rects]);

    const axisRange = useMemo(() => {
        const ys = filtered
            .map((s) => {
                const r = rects[s.id];
                return r ? r.y + r.height / 2 : null;
            })
            .filter((v): v is number => typeof v === "number");

        if (!ys.length) return null;

        const top = Math.min(...ys) - 140;
        const bottom = Math.max(...ys) + 220;
        return { top, bottom };
    }, [filtered, rects]);

    return (
        <div className="roadmapShell" ref={containerRef}>
            <svg className="connectorOverlay" width="100%" height="100%">
                <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="rgba(245,233,188,0.55)" />
                        <stop offset="1" stopColor="rgba(210,224,255,0.40)" />
                    </linearGradient>

                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="2.2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Ось */}
                {axisRange ? (
                    <path
                        d={`M ${getAxisX()} ${axisRange.top} L ${getAxisX()} ${axisRange.bottom}`}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="2"
                    />
                ) : null}

                {/* Точка на оси ДЛЯ КАЖДОГО шага (одна на шаг) */}
                {filtered.map((s) => {
                    const r = rects[s.id];
                    if (!r) return null;

                    const x = getAxisX();
                    const y = r.y + r.height / 2;

                    const done = completedIds.has(s.id);
                    const hot = activeId === s.id;

                    return (
                        <circle
                            key={s.id}
                            cx={x}
                            cy={y}
                            r={hot ? 7 : 5}
                            fill={done ? "rgba(140,255,210,0.7)" : "rgba(245,233,188,0.65)"}
                            opacity={0.9}
                            filter={hot ? "url(#softGlow)" : undefined}
                        />
                    );
                })}

                {/* Коннекторы карточка -> ось */}
                {connectors.map((p) => {
                    const hot = activeId === p.id;
                    const done = completedIds.has(p.id);

                    return (
                        <motion.path
                            key={p.key}
                            d={p.d}
                            fill="none"
                            stroke={done ? "rgba(140,255,210,0.50)" : "url(#lineGrad)"}
                            strokeWidth={hot ? 3.2 : 2}
                            opacity={hot ? 0.95 : 0.55}
                            filter={hot ? "url(#softGlow)" : undefined}
                            initial={false}
                            animate={reducedMotion ? undefined : { pathLength: 1 }}
                            transition={{ duration: 0.35 }}
                        />
                    );
                })}
            </svg>

            <div className="roadmapGrid">
                {/* midRail можно убрать, но можно и оставить (будет слегка заметно под SVG-осью) */}


                {filtered.map((step, i) => {
                    const side: "left" | "right" | "single" =
                        isMobile ? "single" : i % 2 === 0 ? "left" : "right";

                    const done = completedIds.has(step.id);
                    const open = openIds.has(step.id);
                    const active = activeId === step.id;

                    // КЛЮЧЕВОЕ: фиксируем каждой карточке СВОЮ строку (шахматка по шагам вниз)
                    const gridColumn = side === "single" ? "1 / -1" : side === "left" ? "1" : "3";
                    const gridRow = i + 1;

                    return (
                        <div
                            key={step.id}
                            style={{ gridColumn, gridRow }}
                            onMouseEnter={() => setActiveId(step.id)}
                            onMouseLeave={() => setActiveId((prev) => (prev === step.id ? null : prev))}
                        >
                            <RoadmapStepCard
                                step={step}
                                index={i}
                                side={side}
                                isDone={done}
                                isOpen={open}
                                isActive={active}
                                onToggleOpen={() => toggleOpen(step.id)}
                                onToggleDone={() => onToggleDone(step.id)}
                                registerEl={registerEl}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
