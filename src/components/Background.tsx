import React from "react";
import Galaxy from "./Galaxy";

export default function Background() {

    return (
        <div className="bgLayer" aria-hidden="true">
            <Galaxy
                starSpeed={2.4}
                density={0.6}
                hueShift={360}
                speed={0.1}
                glowIntensity={0.1}
                saturation={0.8}
                mouseRepulsion={true}
                repulsionStrength={0.5}
                twinkleIntensity={0}
                rotationSpeed={0.05}
                transparent={false}
            />

        </div>
    );
}
