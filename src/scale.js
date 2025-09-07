const { base32ToUvoxid } = require("./formats");

function uvoxidScale(uvoxidStr) {
  const uvoxid = base32ToUvoxid(uvoxidStr);

  // BigInt bit length
  const bitlen = uvoxid.toString(2).length;
  const unusedBits = 192 - bitlen;

  const baseResM = 1e-6;
  const resM = baseResM * (2 ** unusedBits);

  let scale;
  if (resM >= 1_000) {
    scale = `${(resM / 1000).toFixed(2)} km`;
  } else if (resM >= 1) {
    scale = `${resM.toFixed(2)} m`;
  } else if (resM >= 0.01) {
    scale = `${(resM * 100).toFixed(2)} cm`;
  } else if (resM >= 0.001) {
    scale = `${(resM * 1000).toFixed(2)} mm`;
  } else if (resM >= 1e-6) {
    scale = `${(resM * 1e6).toFixed(2)} µm`;
  } else if (resM >= 1e-9) {
    scale = `${(resM * 1e9).toFixed(2)} nm`;
  } else {
    scale = `${resM.toExponential(2)} m`;
  }

  return [resM, `~${scale} resolution`];
}

module.exports = { uvoxidScale };
