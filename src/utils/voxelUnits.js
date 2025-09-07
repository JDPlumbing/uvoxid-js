// voxelUnits.js

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

function toVoxels(value, unit) {
  unit = unit.toLowerCase();
  if (!(unit in UNIT_TO_METERS)) {
    throw new Error(`Unsupported unit: ${unit}`);
  }
  const meters = value * UNIT_TO_METERS[unit];
  return Math.round(meters / VOXEL_SIZE_M);
}

function fromVoxels(voxels, unit) {
  unit = unit.toLowerCase();
  if (!(unit in UNIT_TO_METERS)) {
    throw new Error(`Unsupported unit: ${unit}`);
  }
  const meters = voxels * VOXEL_SIZE_M;
  return meters / UNIT_TO_METERS[unit];
}

module.exports = { toVoxels, fromVoxels };
