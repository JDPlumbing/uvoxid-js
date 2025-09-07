// src/utils/distance.js
/**
 * Distance utilities for UVoxID.
 *
 * Straight-line (chord) and great-circle (surface) distances.
 */

import { decodeUvoxid } from "../core.js";

export const VOXEL_SIZE_M = 1e-6; // 1 µm

/**
 * Straight-line (chord) distance between two voxels in meters.
 *
 * Uses spherical law of cosines on (r, lat, lon). This avoids Cartesian
 * conversion and keeps everything in spherical-native UVoxID space.
 *
 * Note:
 *  - For small distances (<1 km), this matches human "straightness"
 *    within a few µm when applying tolerance rounding.
 *  - For large scales, this is the actual Euclidean chord through space.
 */
export function linearDistance(voxid1, voxid2) {
  const [r1, lat1Micro, lon1Micro] = decodeUvoxid(voxid1);
  const [r2, lat2Micro, lon2Micro] = decodeUvoxid(voxid2);

  // Convert to meters and radians
  const r1m = r1 * 1e-6;
  const r2m = r2 * 1e-6;
  const lat1 = (lat1Micro / 1e6) * (Math.PI / 180);
  const lon1 = (lon1Micro / 1e6) * (Math.PI / 180);
  const lat2 = (lat2Micro / 1e6) * (Math.PI / 180);
  const lon2 = (lon2Micro / 1e6) * (Math.PI / 180);

  // Central angle between points
  let cosGamma =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  // Clamp to [-1, 1] to avoid NaN from rounding errors
  cosGamma = Math.max(-1.0, Math.min(1.0, cosGamma));

  const gamma = Math.acos(cosGamma);

  // Law of cosines for chord distance
  return Math.sqrt(r1m ** 2 + r2m ** 2 - 2 * r1m * r2m * cosGamma);
}

/**
 * Great-circle (surface) distance in meters.
 *
 * Assumes both voxels lie on the surface of the same sphere,
 * using the average radius of r1 and r2.
 */
export function haversineDistance(voxid1, voxid2) {
  const [r1, lat1Micro, lon1Micro] = decodeUvoxid(voxid1);
  const [r2, lat2Micro, lon2Micro] = decodeUvoxid(voxid2);

  const R = ((r1 + r2) / 2) * 1e-6; // mean radius in meters

  const lat1 = (lat1Micro / 1e6) * (Math.PI / 180);
  const lon1 = (lon1Micro / 1e6) * (Math.PI / 180);
  const lat2 = (lat2Micro / 1e6) * (Math.PI / 180);
  const lon2 = (lon2Micro / 1e6) * (Math.PI / 180);

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
