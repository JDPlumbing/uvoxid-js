import { encodeUvoxid, decodeUvoxid } from "../src/index.js";

test("round trip encode/decode", () => {
  const encoded = encodeUvoxid(6371000000000n, 0n, 0n);
  const [r, lat, lon] = decodeUvoxid(encoded);

  expect(r).toBe(6371000000000);
  expect(lat).toBe(0);
  expect(lon).toBe(0);
});
