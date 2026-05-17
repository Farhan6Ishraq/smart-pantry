"use client";

import DotField from "./DotField";

export default function GlobalDotBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-90 pointer-events-none">
      <DotField
        dotRadius={6}
        dotSpacing={15}
        cursorRadius={220}
        bulgeStrength={96}
        glowRadius={0}
        sparkle={false}
        waveAmplitude={0}
        gradientFrom="rgba(216, 140, 71, 0.36)"
        gradientTo="rgba(153, 101, 63, 0.24)"
        glowColor="transparent"
      />
    </div>
  );
}
