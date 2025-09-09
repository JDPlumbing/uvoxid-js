import { decodeUvoxid } from "../index.js";

/** Compute differences between two UVoxID positions. */
export function sphericalDelta(uv1, uv2) {
  console.log("sphericalDelta called with:", uv1, uv2);
  const [r1, lat1, lon1] = decodeUvoxid(uv1);
  const [r2, lat2, lon2] = decodeUvoxid(uv2);

  const drUm = r2 - r1;
  let dlatDeg = (lat2 - lat1) / 1e6;
  let dlonDeg = (lon2 - lon1) / 1e6;

  if (dlonDeg > 180) dlonDeg -= 360;
  else if (dlonDeg < -180) dlonDeg += 360;

  return { drUm, dlatDeg, dlonDeg };
}
