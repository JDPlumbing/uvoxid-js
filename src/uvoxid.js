// Encode spherical coordinates into 192-bit UVoxID using BigInt
function encodeUvoxid(r_um, lat_microdeg, lon_microdeg) {
  const lat_enc = BigInt(lat_microdeg + 90_000_000);
  const lon_enc = BigInt(lon_microdeg + 180_000_000);
  const r_enc   = BigInt(r_um);

  return (r_enc << 128n) | (lat_enc << 64n) | lon_enc;
}

function decodeUvoxid(uvoxid) {
  const mask64 = (1n << 64n) - 1n;

  const lon_enc = uvoxid & mask64;
  const lat_enc = (uvoxid >> 64n) & mask64;
  const r_um    = (uvoxid >> 128n) & mask64;

  const lat_microdeg = Number(lat_enc) - 90_000_000;
  const lon_microdeg = Number(lon_enc) - 180_000_000;

  return { r_um: Number(r_um), lat_microdeg, lon_microdeg };
}

module.exports = { encodeUvoxid, decodeUvoxid };
