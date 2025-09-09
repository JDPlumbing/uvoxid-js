// src/uvoxid.js

// Encode spherical coordinates into 192-bit UVoxID using BigInt
// src/uvoxid.js
export function encodeUvoxid(r_um, lat_microdeg, lon_microdeg) {
  console.log("encodeUvoxid called with:", r_um, lat_microdeg, lon_microdeg);
  const lat_enc = BigInt(lat_microdeg) + 90_000_000n;
  const lon_enc = BigInt(lon_microdeg) + 180_000_000n;
  const r_enc   = BigInt(r_um);

  return (r_enc << 128n) | (lat_enc << 64n) | lon_enc;
}

export function decodeUvoxid(uvoxid) {
  console.log("decodeUvoxid called with:", uvoxid, typeof uvoxid);
  if (uvoxid === undefined || uvoxid === null) {
    console.error("decodeUvoxid: received invalid input:", uvoxid);
    return [NaN, NaN, NaN];
  }

  try {
    const mask64 = (1n << 64n) - 1n;

    const lon_enc = uvoxid & mask64;
    const lat_enc = (uvoxid >> 64n) & mask64;
    const r_um    = (uvoxid >> 128n) & mask64;

    const lat_microdeg = Number(lat_enc) - 90_000_000;
    const lon_microdeg = Number(lon_enc) - 180_000_000;

    return [Number(r_um), lat_microdeg, lon_microdeg];
  } catch (err) {
    console.error("decodeUvoxid: failed to decode", uvoxid, err);
    return [NaN, NaN, NaN];
  }
}
