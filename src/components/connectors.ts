export type Point = { x: number; y: number };

export type ConnectorPath = {
    fromId: string;
    toId: string;
    d: string;
};

export function makeSmoothPath(a: Point, b: Point) {
    const dist = Math.abs(b.x - a.x);
    const bend = Math.min(180, Math.max(90, dist * 0.5));
    const c1 = { x: a.x + (a.x < b.x ? bend : -bend), y: a.y };
    const c2 = { x: b.x + (a.x < b.x ? -bend : bend), y: b.y };
    return `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
}
