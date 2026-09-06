// Generated once with Python secrets; kept as a string to preserve all 20 digits.
export const DESIGN_SEED = '35456546222620412887';

export function initializeSeedDesign() {
    const lines = document.getElementById('seed-lines');
    if (!lines) return;
    let state = BigInt(DESIGN_SEED);
    const random = () => {
        state = (state * 6364136223846793005n + 1442695040888963407n) & ((1n << 64n) - 1n);
        return Number(state >> 32n) / 4294967296;
    };
    document.body.dataset.designSeed = DESIGN_SEED;
    // Seeded control points turn a tangled starting point into an orderly fan.
    for (let i = 0; i < 28; i++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const bend = 30 + random() * 150;
        path.setAttribute('d', `M ${38 + i * 2} ${110 + i * 5} C ${bend} ${380 - random() * 60}, ${270 + random() * 80} ${40 + i * 2}, 400 ${170 + i * 4}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'currentColor');
        path.setAttribute('stroke-width', '1');
        path.setAttribute('opacity', String(0.25 + random() * 0.4));
        lines.appendChild(path);
    }
}
