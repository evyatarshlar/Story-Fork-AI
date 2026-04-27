import { useState, useEffect, useRef } from "react";

// --------------- Sound synthesis (Web Audio API) ---------------

function playWinSound(): void {
    const AudioCtx =
        window.AudioContext ??
        ((window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext);
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Short ascending fanfare: C4 → E4 → G4 → C5
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "square";
        osc.frequency.value = freq;

        const t0 = ctx.currentTime + i * 0.13;
        const t1 = t0 + 0.18;
        gain.gain.setValueAtTime(0, t0);
        gain.gain.linearRampToValueAtTime(0.22, t0 + 0.01);
        gain.gain.linearRampToValueAtTime(0, t1);

        osc.start(t0);
        osc.stop(t1 + 0.01);
    });

    // Close context after notes are done
    setTimeout(() => ctx.close(), 1500);
}

function playLoseSound(): void {
    const AudioCtx =
        window.AudioContext ??
        ((window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext);
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // Descending "bassa" glide
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(370, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.75);

    gain.gain.setValueAtTime(0.26, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.85);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.9);

    setTimeout(() => ctx.close(), 1500);
}

// --------------- Hook ---------------

export interface EndingEffectsState {
    showConfetti: boolean;
    showDarkFlash: boolean;
}

/**
 * Detects the first moment the user reaches an ending node and:
 *  - win  → plays fanfare + shows confetti for 5 s
 *  - lose → plays "bassa" tone + shows dark-flash overlay for 1.2 s
 *
 * Logic is fully separated from UI: components read the returned booleans.
 */
export function useEndingEffects(
    isEnding: boolean,
    isWinningEnding: boolean
): EndingEffectsState {
    const [showConfetti, setShowConfetti] = useState(false);
    const [showDarkFlash, setShowDarkFlash] = useState(false);

    // Tracks the previous value of isEnding to detect the false→true edge
    const prevIsEndingRef = useRef(isEnding);

    useEffect(() => {
        const wasEnding = prevIsEndingRef.current;
        prevIsEndingRef.current = isEnding;

        // Only fire on the transition false → true
        if (!isEnding || wasEnding) return;

        if (isWinningEnding) {
            playWinSound();
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        } else {
            playLoseSound();
            setShowDarkFlash(true);
            const timer = setTimeout(() => setShowDarkFlash(false), 1200);
            return () => clearTimeout(timer);
        }
    }, [isEnding, isWinningEnding]);

    return { showConfetti, showDarkFlash };
}
