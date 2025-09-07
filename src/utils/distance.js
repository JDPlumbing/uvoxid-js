import { decodeUvoxid } from "../uvoxid.js";

const VOXEL_SIZE_M = 1e-6; // 1 µm

/** Straight-line (chord) distance between two voxels in meters. */
export function linearDistance(voxid1, voxid2) {
  const [r1, lat1Micro, lon1Micro] = decodeUvoxid(voxid1);
  const [r2, lat2Micro, lon2Micro] = decodeUvoxid(voxid2);

  const r1_m = r1 * 1e-6;
  const r2_m = r2 * 1e-6;
  const lat1 = (lat1Micro / 1e6) * Math.PI / 180;
  const lon1 = (lon1Micro / 1e6) * Math.PI / 180;
  const lat2 = (lat2Micro / 1e6) * Math.PI / 180;
  const lon2 = (lon2Micro / 1e6) * Math.PI / 180;

  const cosGamma =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

  const gamma = Math.acos(Math.max(-1.0, Math.min(1.0, cosGamma)));

  return Math.sqrt(r1_m ** 2 + r2_m ** 2 - 2 * r1_m * r2_m * Math.cos(gamma));
}

/** Great-circle (surface) distance in meters. */
export function haversineDistance(voxid1, voxid2) {
  const [r1, lat1Micro, lon1Micro] = decodeUvoxid(voxid1);
  const [r2, lat2Micro, lon2Micro] = decodeUvoxid(voxid2);

  const R = ((r1 + r2) / 2) * 1e-6;

  const lat1 = (lat1Micro / 1e6) * Math.PI / 180;
  const lon1 = (lon1Micro / 1e6) * Math.PI / 180;
  const lat2 = (lat2Micro / 1e6) * Math.PI / 180;
  const lon2 = (lon2Micro / 1e6) * Math.PI / 180;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
