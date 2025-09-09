// src/utils/voxelUnits.js

const VOXEL_SIZE_M = 1e-6; // 1 µm

const UNIT_TO_METERS = {
  um: 1e-6,
  mm: 1e-3,
  cm: 1e-2,
  m: 1,
  km: 1e3,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.34,
};

/**
 * Convert a value in a given unit → number of voxels (1 µm each).
 */
export function toVoxels(value, unit) {
  console.log("toVoxels called with:", value, unit);
  unit = unit.toLowerCase();
  if (!(unit in UNIT_TO_METERS)) {
    throw new Error(`Unsupported unit: ${unit}`);
  }
  const meters = value * UNIT_TO_METERS[unit];
  return Math.round(meters / VOXEL_SIZE_M);
}

/**
 * Convert a voxel count → value in the requested unit.
 */
export function fromVoxels(voxels, unit) {
  console.log("fromVoxels called with:", voxels, unit);
  unit = unit.toLowerCase();
  if (!(unit in UNIT_TO_METERS)) {
    throw new Error(`Unsupported unit: ${unit}`);
  }
  const meters = voxels * VOXEL_SIZE_M;
  return meters / UNIT_TO_METERS[unit];
}
