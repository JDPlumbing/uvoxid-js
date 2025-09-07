// src/utils/orientation.js
/**
 * Orientation utilities for UVoxID.
 *
 * Computes differences between two UVoxID positions.
 */

import { decodeUvoxid, encodeUvoxid } from "../core.js";

/**
 * Compute differences between two UVoxID positions.
 *
 * @param {bigint|number} uv1 - first UVoxID (192-bit integer)
 * @param {bigint|number} uv2 - second UVoxID (192-bit integer)
 * @returns {Object} { dr_um, dlat_deg, dlon_deg }
 */
export function sphericalDelta(uv1, uv2) {
  const [r1, lat1, lon1] = decodeUvoxid(uv1);
  const [r2, lat2, lon2] = decodeUvoxid(uv2);

  const drUm = r2 - r1;
  let dlatDeg = (lat2 - lat1) / 1e6;
  let dlonDeg = (lon2 - lon1) / 1e6;

  // Normalize longitude delta into [-180, 180]
  if (dlonDeg > 180) {
    dlonDeg -= 360;
  } else if (dlonDeg < -180) {
    dlonDeg += 360;
  }

  return {
    dr_um: drUm,
    dlat_deg: dlatDeg,
    dlon_deg: dlonDeg,
  };
}

// --- Example (manual run) ---
if (import.meta.url === `file://${process.argv[1]}`) {
  const EARTH_RADIUS_UM = 6_371_000_000_000n;

  // Miami vs. NYC
  const miami = encodeUvoxid(
    EARTH_RADIUS_UM,
    Math.floor(25.76 * 1e6),
    Math.floor(-80.19 * 1e6)
  );
  const nyc = encodeUvoxid(
    EARTH_RADIUS_UM,
    Math.floor(40.71 * 1e6),
    Math.floor(-74.01 * 1e6)
  );

  const delta = sphericalDelta(miami, nyc);
  console.log(delta);
  // → { dr_um: 0, dlat_deg: ~14.95, dlon_deg: ~6.18 }
}
