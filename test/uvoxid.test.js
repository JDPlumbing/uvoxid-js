const { encodeUvoxid, decodeUvoxid } = require('../src/uvoxid');

test('round trip encode/decode', () => {
  const encoded = encodeUvoxid(6371000000000, 0, 0);
  const decoded = decodeUvoxid(encoded);
  expect(decoded.r_um).toBe(6371000000000);
  expect(decoded.lat_microdeg).toBe(0);
  expect(decoded.lon_microdeg).toBe(0);
});
