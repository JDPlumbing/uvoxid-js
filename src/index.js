/**
 * UVoxID-JS: Universal Voxel Identifier
 *
 * Central export for all UVoxID modules.
 *
 * Usage:
 *   import { encodeUvoxid, sphericalPatchArea } from "uvoxid-js";
 */

// --- Core ---
console.log("loading uvoxid.js");
import { encodeUvoxid as _encodeUvoxid, decodeUvoxid as _decodeUvoxid } from "./uvoxid.js";

export function encodeUvoxid(...args) {
  console.log("encodeUvoxid called with:", args);
  return _encodeUvoxid(...args);
}

export function decodeUvoxid(uvoxid) {
  console.log("decodeUvoxid called with:", uvoxid, typeof uvoxid);
  const result = _decodeUvoxid(uvoxid);
  console.log("decodeUvoxid result:", result);
  if (!Array.isArray(result) || result.length !== 3) {
    throw new Error(`decodeUvoxid returned bad result for input ${uvoxid}`);
  }
  return result;
}

// --- Other exports ---
console.log("loading formats.js");
export * from "./formats.js";

console.log("loading corrections.js");
export * from "./corrections.js";

console.log("loading area.js");
export * from "./utils/area.js";

console.log("loading distance.js");
export * from "./utils/distance.js";

console.log("loading geometry.js");
export * from "./utils/geometry.js";

console.log("loading orientation.js");
export * from "./utils/orientation.js";

console.log("loading tolerance.js");
export * from "./utils/tolerance.js";

console.log("loading voxelUnits.js");
export * from "./utils/voxelUnits.js";
