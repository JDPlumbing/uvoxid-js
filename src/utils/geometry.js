// src/utils/geometry.js
/**
 * Geometry utilities for UVoxID.
 * Pure voxel math: no materials, no mass, just counts and volumes.
 */

export const VOXEL_SIZE_M = 1e-6;            // each radial step = 1 µm
export const VOXEL_VOLUME_M3 = VOXEL_SIZE_M ** 3; // ~1e-18 m³

/**
 * Return the volume of a single voxel in cubic meters.
 * @returns {number}
 */
export function voxelVolumeM3() {
  return VOXEL_VOLUME_M3;
}

/**
 * Return number of voxels in a cube of given side length (meters).
 * @param {number} sideM - side length in meters
 * @returns {number} number of voxels
 */
export function cubeVoxels(sideM) {
  return Math.floor((sideM / VOXEL_SIZE_M) ** 3);
}

/**
 * Return number of voxels in a sphere of given radius (meters).
 * @param {number} radiusM - radius in meters
 * @returns {number} number of voxels
 */
export function sphereVoxels(radiusM) {
  const volumeM3 = (4 / 3) * Math.PI * radiusM ** 3;
  return Math.floor(volumeM3 / VOXEL_VOLUME_M3);
}

/**
 * Return number of voxels in a cylinder.
 * @param {number} radiusM - radius in meters
 * @param {number} heightM - height in meters
 * @returns {number} number of voxels
 */
export function cylinderVoxels(radiusM, heightM) {
  const volumeM3 = Math.PI * radiusM ** 2 * heightM;
  return Math.floor(volumeM3 / VOXEL_VOLUME_M3);
}
