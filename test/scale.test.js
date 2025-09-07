const { encodeUvoxid } = require('../src/uvoxid');
const { uvoxidToBase32 } = require('../src/formats');
const { uvoxidScale } = require('../src/scale');

test('scale should give µm resolution at full precision', () => {
  const addr = encodeUvoxid(6371000000000, 0, 0); // Earth surface, lat/lon=0
  const b32 = uvoxidToBase32(addr);
  const [resM, info] = uvoxidScale(b32);

  expect(resM).toBeCloseTo(1e-6, 10); // 1 µm
  expect(info).toContain("µm");
});

test('scale should degrade with truncated Base32 string', () => {
  const addr = encodeUvoxid(6371000000000, 0, 0);
  const b32 = uvoxidToBase32(addr);

  const truncated = b32.slice(0, -10); // fewer chars = coarser resolution
  const [resM] = uvoxidScale(truncated);

  expect(resM).toBeGreaterThan(1e-6);
});
