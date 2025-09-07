// src/corrections.js

// --- Earth constants (WGS84 ellipsoid, in µm) ---
export const R_EQ_UM = 6_378_137_000_000;  // equatorial radius in µm
export const R_POL_UM = 6_356_752_000_000; // polar radius in µm

/**
 * Return Earth's radius (in µm) at a given latitude.
 * Uses ellipsoid formula for an oblate spheroid (WGS84).
 */
export function earthRadiusAtLat(latMicrodeg) {
  const latRad = (latMicrodeg / 1e6) * (Math.PI / 180);
  const cosPhi = Math.cos(latRad);
  const sinPhi = Math.sin(latRad);

  const numerator =
    Math.pow(R_EQ_UM * R_EQ_UM * cosPhi, 2) +
    Math.pow(R_POL_UM * R_POL_UM * sinPhi, 2);

  const denominator =
    Math.pow(R_EQ_UM * cosPhi, 2) + Math.pow(R_POL_UM * sinPhi, 2);

  return Math.floor(Math.sqrt(numerator / denominator));
}

/**
 * Apply local terrain correction in µm.
 * TODO: integrate DEM dataset (e.g., SRTM/ETOPO).
 * Currently always returns 0.
 */
export function terrainOffset(latMicrodeg, lonMicrodeg) {
  return 0;
}

/**
 * Check if a voxel at r_um is inside Earth's ellipsoid,
 * including optional local terrain adjustments.
 */
export function isInsideEarth(rUm, latMicrodeg, lonMicrodeg) {
  let surfaceR = earthRadiusAtLat(latMicrodeg);
  surfaceR += terrainOffset(latMicrodeg, lonMicrodeg);
  return rUm <= surfaceR;
}

/**
 * Compute the linear resolution (in meters) of one angular voxel
 * (lat/lon) at a given radius.
 *
 * @param {number} rUm - radius in micrometers
 * @param {number} sigChars - number of significant Base32 characters (default=max=38)
 * @returns {number} linear size in meters
 */
export function angularResolution(rUm, sigChars = 38) {
  const rM = rUm * 1e-6;
  const totalBits = sigChars * 5;
  // assume half the bits go to latitude, half to longitude
  const deltaTheta = (2 * Math.PI) / Math.pow(2, totalBits / 2);
  return rM * deltaTheta;
}

/**
 * Estimate how many cubic 1µm³ voxels fit into one UVoxID voxel at radius r.
 *
 * @param {number} rUm - radius in micrometers
 * @param {number} sigChars - precision in Base32 chars (default=max=38)
 * @returns {number} number of cubic-equivalent voxels represented
 */
export function cubicEquivalentVoxelCount(rUm, sigChars = 38) {
  const angularSize = angularResolution(rUm, sigChars);
  const radialSize = 1e-6; // always 1 µm
  return Math.pow(radialSize / angularSize, 2);
}
