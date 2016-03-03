// input vec3 objects
// returns array containing x, y, z bounds
export default function extent(vertices) {
  var n = vertices.length,
      b = [
            [Infinity, -Infinity],
            [Infinity, -Infinity],
            [Infinity, -Infinity]
      ];

  for (let i = 0; i < n; i++) {
    let v = vertices[i];
    for (let k = 0; k < 3; k++) {
      b[k][0] = (v[k] < b[k][0]) ? v[k] : b[k][0];
      b[k][1] = (v[k] > b[k][1]) ? v[k] : b[k][1];
    }
  }

  return b;
}
