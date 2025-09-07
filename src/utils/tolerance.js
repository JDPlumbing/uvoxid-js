// src/utils/tolerance.js
/**
 * tolerance.js — utilities for handling tolerances in UVoxID space.
 *
 * In UVoxID, each Base32 character = 5 bits of resolution.
 * Tolerances are applied by truncating the UVoxID to a certain
 * number of significant Base32 characters (sig_chars).
 */

import { uvoxidToB32 } from "../formats.js";

const TOTAL_BITS = 192;
const BITS_PER_CHAR = 5;

/**
 * Truncate a UVoxID integer to a given number of significant Base32 characters.
 *
 * @param {bigint} uvoxid - 192-bit UVoxID integer
 * @param {number} sigChars - number of significant Base32 chars to preserve (1–39)
 * @returns {bigint} truncated UVoxID integer with lower bits zeroed out
 */
export function truncateToTolerance(uvoxid, sigChars) {
  const keepBits = sigChars * BITS_PER_CHAR;
  if (keepBits > TOTAL_BITS) {
    throw new Error(
      `sig_chars too large, max is ${Math.floor(TOTAL_BITS / BITS_PER_CHAR)}`
    );
  }

  const mask =
    (1n << BigInt(keepBits)) - 1n << BigInt(TOTAL_BITS - keepBits);
  return BigInt(uvoxid) & mask;
}

/**
 * Check if two UVoxIDs are equal within a given tolerance.
 *
 * @param {bigint} a - first UVoxID
 * @param {bigint} b - second UVoxID
 * @param {number} sigChars - tolerance level (number of Base32 chars to match)
 * @returns {boolean}
 */
export function equalWithinTolerance(a, b, sigChars) {
  return (
    truncateToTolerance(a, sigChars) === truncateToTolerance(b, sigChars)
  );
}

/**
 * Convert a UVoxID to its Base32 string snapped at given tolerance.
 *
 * @param {bigint} uvoxid - 192-bit UVoxID integer
 * @param {number} sigChars - tolerance level (number of Base32 chars to keep)
 * @returns {string} truncated Base32 string with padding 'A's
 */
export function snapToTolerance(uvoxid, sigChars) {
  const truncated = truncateToTolerance(uvoxid, sigChars);
  const b32 = uvoxidToB32(truncated);
  const prefix = b32.replace("uvoxid:", "").replace(/-/g, "").slice(0, sigChars);
  return `uvoxid:${prefix}${"A".repeat(39 - sigChars)}`;
}

// --- Example (manual run) ---
if (import.meta.url === `file://${process.argv[1]}`) {
  import("../uvoxid.js").then(({ encodeUvoxid }) => {
    const EARTH_RADIUS_UM = 6_371_000_000_000n;

    const uv1 = encodeUvoxid(
      EARTH_RADIUS_UM,
      BigInt(Math.floor(25.76 * 1e6)),
      BigInt(Math.floor(-80.19 * 1e6))
    );
    const uv2 = encodeUvoxid(
      EARTH_RADIUS_UM,
      BigInt(Math.floor(25.760001 * 1e6)),
      BigInt(Math.floor(-80.190001 * 1e6))
    );

    console.log("Exact equal:", uv1 === uv2);
    console.log(
      "Equal at 6 sig chars (~mm scale):",
      equalWithinTolerance(uv1, uv2, 6)
    );
    console.log("Snapped uv1 @ 6 chars:", snapToTolerance(uv1, 6));
    console.log("Snapped uv2 @ 6 chars:", snapToTolerance(uv2, 6));
  });
}
