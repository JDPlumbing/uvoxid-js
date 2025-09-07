// src/index.js
/**
 * UVoxID-JS: Universal Voxel Identifier
 * 
 * Central export for all UVoxID modules.
 * 
 * Usage:
 *   import { encodeUvoxid, sphericalPatchArea } from "uvoxid-js";
 */

// --- Core ---
export * from "./uvoxid.js";
export * from "./formats.js";
export * from "./corrections.js";

// --- Utils ---
export * from "./utils/area.js";
export * from "./utils/distance.js";
export * from "./utils/geometry.js";
export * from "./utils/orientation.js";
export * from "./utils/tolerance.js";
export * from "./utils/voxelUnits.js";

