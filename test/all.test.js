import {
  encodeUvoxid,
  decodeUvoxid,
  uvoxidToBase32,
  sphericalPatchArea,
  linearDistance,
  haversineDistance,
  cubeVoxels,
  sphereVoxels,
  cylinderVoxels,
  sphericalDelta,
  equalWithinTolerance,
  snapToTolerance,
  toVoxels,
  fromVoxels,
} from "../src/index.js";

const EARTH_RADIUS_UM = 6_371_000_000_000n;

describe("UVoxID-JS integration tests", () => {
  test("encode/decode symmetry", () => {
    const addr = encodeUvoxid(EARTH_RADIUS_UM, 0n, 0n);
    const [r, lat, lon] = decodeUvoxid(addr);

    expect(r).toBe(Number(EARTH_RADIUS_UM));
    expect(lat).toBe(0);
    expect(lon).toBe(0);
  });

  test("base32 encoding includes prefix", () => {
    const addr = encodeUvoxid(EARTH_RADIUS_UM, 0n, 0n);
    const b32 = uvoxidToBase32(addr);
    expect(b32.startsWith("uvoxid:")).toBe(true);
  });

test("spherical patch area ~1°x1° at equator", () => {
  const area = sphericalPatchArea(Number(EARTH_RADIUS_UM), 0, 1, 0, 1);

  const expected = 1.23e10;        // ≈ 12,300 km²
  const tolerance = expected * 0.02; // allow 2% wiggle

  expect(Math.abs(area - expected)).toBeLessThan(tolerance);
});


  test("linear vs haversine distance are consistent", () => {
    const miami = encodeUvoxid(EARTH_RADIUS_UM, BigInt(25.76e6), BigInt(-80.19e6));
    const nyc   = encodeUvoxid(EARTH_RADIUS_UM, BigInt(40.71e6), BigInt(-74.01e6));

    const lin = linearDistance(miami, nyc);
    const hav = haversineDistance(miami, nyc);

    // They should agree within ~10 km
    expect(Math.abs(lin - hav)).toBeLessThan(10_000);
  });

  test("voxel geometry counts make sense", () => {
    expect(cubeVoxels(1e-3)).toBe(1e9); // 1mm cube
    expect(sphereVoxels(1e-3)).toBeGreaterThan(1e9);
    expect(cylinderVoxels(1e-3, 1e-3)).toBeGreaterThan(1e9);
  });

  test("orientation delta between two points", () => {
    const miami = encodeUvoxid(EARTH_RADIUS_UM, BigInt(25.76e6), BigInt(-80.19e6));
    const nyc   = encodeUvoxid(EARTH_RADIUS_UM, BigInt(40.71e6), BigInt(-74.01e6));

    const delta = sphericalDelta(miami, nyc);
    expect(delta.dlatDeg).toBeCloseTo(15, 0);
    expect(delta.dlonDeg).toBeCloseTo(6, 0);
  });

  test("tolerance equality and snapping", () => {
    const uv1 = encodeUvoxid(EARTH_RADIUS_UM, BigInt(25.76e6), BigInt(-80.19e6));
    const uv2 = encodeUvoxid(EARTH_RADIUS_UM, BigInt(25.760001e6), BigInt(-80.190001e6));

    expect(equalWithinTolerance(uv1, uv2, 6)).toBe(true);
    expect(snapToTolerance(uv1, 6)).toContain("uvoxid:");
  });

  test("voxel unit conversions round-trip", () => {
    const vox = toVoxels(1, "mm");
    const mm = fromVoxels(vox, "mm");
    expect(mm).toBeCloseTo(1, 6);
  });
});
