/**
 * Convert a hex color (#RRGGBB) to HSL format (hsl(h, s%, l%))
 * @param {string} hex - The hex color code (e.g., "#4B422B")
 * @returns {string} - The HSL representation (e.g., "hsl(283, 70%, 50%)")
 */
export function hexToHsl(hex:string) {
    // Remove the '#' if it exists
    hex = hex.replace(/^#/, "");

    // Parse r, g, b values from hex
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find max and min values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate lightness
    const l = (max + min) / 2;

    // Calculate saturation
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Calculate hue
    let h = 0;
    if (delta !== 0) {
        if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }
        h = Math.round(h * 60); // Convert to degrees
        if (h < 0) h += 360; // Ensure hue is positive
    }

    // Convert to percentage and round
    const hsl = `hsl(${Math.round(h)}, ${Math.round(s * 80)}%, ${Math.round(l * 100)}%)`;
    return hsl;
}
