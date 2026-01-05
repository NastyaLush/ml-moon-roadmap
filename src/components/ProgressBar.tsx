import React from "react";
import { motion } from "framer-motion";

type Props = {
    completed: number;
    total: number;
};

export default function ProgressBar({ completed, total }: Props) {
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="progressWrap" role="status" aria-label="Прогресс">
            <div className="progressTop">
                <div className="label">Прогресс пути</div>
                <div className="value">
                    {completed}/{total} • {pct}%
                </div>
            </div>
            <div className="bar" aria-hidden="true">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                />
            </div>
        </div>
    );
}
