/**
 * Area utilities for UVoxID.
 *
 * These functions work with decoded UVoxIDs (r, lat, lon)
 * to compute surface areas on spheres and planar patches.
 */

import { decodeUvoxid, encodeUvoxid } from "../index.js";
import { base32ToUvoxid } from "../formats.js"; // ensure this exists

// --- Normalizer: accepts many input forms ---
function normalizeUvoxid(input) {
  console.log("normalizeUvoxid called with:", input);

  if (typeof input === "bigint") return input;
  if (typeof input === "number") return BigInt(input);

  if (Array.isArray(input)) {
    if (input.length === 3) {
      return encodeUvoxid(input[0], input[1], input[2]);
    }
    throw new Error(`Array input must have 3 elements, got: ${input}`);
  }

  if (typeof input === "string") {
    if (input.startsWith("uvoxid:")) {
      return base32ToUvoxid(input);
    }
    if (/^0x[0-9a-f]+$/i.test(input)) return BigInt(input);
    if (/^\d+$/.test(input)) return BigInt(input);
    throw new Error(`Unsupported string format: ${input}`);
  }

  throw new Error(`Unsupported input type: ${typeof input}`);
}

/**
 * Compute the area (in m²) of a spherical quadrilateral patch on a sphere
 * bounded by lat/lon coordinates.
 *
 * @param {number} rUm - radius in micrometers
 * @param {number} lat1Deg - lower latitude bound (degrees)
 * @param {number} lat2Deg - upper latitude bound (degrees)
 * @param {number} lon1Deg - lower longitude bound (degrees)
 * @param {number} lon2Deg - upper longitude bound (degrees)
 * @returns {number} area in square meters
 */
export function sphericalPatchArea(rUm, lat1Deg, lat2Deg, lon1Deg, lon2Deg) {
  const rM = rUm * 1e-6; // convert µm → m

  // convert degrees to radians
  const lat1 = (lat1Deg * Math.PI) / 180;
  const lat2 = (lat2Deg * Math.PI) / 180;
  const lon1 = (lon1Deg * Math.PI) / 180;
  const lon2 = (lon2Deg * Math.PI) / 180;

  // A = R² * Δλ * (sin φ2 − sin φ1)
  const deltaLon = Math.abs(lon2 - lon1);
  return rM ** 2 * deltaLon * Math.abs(Math.sin(lat2) - Math.sin(lat1));
}

/**
 * Approximate area (in m²) spanned between two UVoxIDs on the same sphere.
 *
 * @param {bigint|number|string|Array} uv1 - UVoxID
 * @param {bigint|number|string|Array} uv2 - UVoxID
 * @returns {number} surface patch area in square meters
 */
export function areaBetweenVoxels(uv1, uv2) {
  const norm1 = normalizeUvoxid(uv1);
  const norm2 = normalizeUvoxid(uv2);

  console.log("normalized:", norm1, typeof norm1, norm2, typeof norm2);

  const [r1, lat1Micro, lon1Micro] = decodeUvoxid(norm1);
  const [r2, lat2Micro, lon2Micro] = decodeUvoxid(norm2);

  if (r1 !== r2) {
    throw new Error("Both voxels must be on the same spherical shell (same radius).");
  }

  const lat1 = lat1Micro / 1e6;
  const lat2 = lat2Micro / 1e6;
  const lon1 = lon1Micro / 1e6;
  const lon2 = lon2Micro / 1e6;

  return sphericalPatchArea(r1, lat1, lat2, lon1, lon2);
}

// --- Example (manual run with Node only) ---
// if (typeof process !== "undefined" &&
//     typeof process.argv !== "undefined" &&
//     import.meta.url.startsWith("file://") &&
//     process.argv[1] &&
//     import.meta.url === `file://${process.argv[1]}`) {
//   const EARTH_RADIUS_UM = 6_371_000_000_000n; // Earth radius in µm
//   const area = sphericalPatchArea(Number(EARTH_RADIUS_UM), 0, 1, 0, 1);
//   console.log(`1°x1° patch at equator ≈ ${area.toExponential(2)} m²`);
// }
