# uvoxid-js

Universal Voxel Identifier (UVoxID) — JavaScript port.  
A spatial encoding system for representing voxels on Earth (and beyond) with a compact, hierarchical 192-bit identifier.

## Install
```bash
npm install uvoxid-js
```

## Usage
```js
import { encodeUvoxid, decodeUvoxid } from "uvoxid-js";

const earthRadius = 6_371_000_000_000n; // µm
const id = encodeUvoxid(earthRadius, 25_760_000, -80_190_000); // Miami

console.log(id.toString(16)); // hex form
console.log(decodeUvoxid(id)); // [r_um, lat_microdeg, lon_microdeg]
```

## Features
- Encode/decode UVoxID from spherical coords
- Base32/hex/binary formats
- Distance, area, tolerance utilities
- Voxel geometry helpers

## License
MIT
