// returns new extent that is the union of the provided extents
export default function union(extents) {
  var n = extents.length,
      u = [
            [Infinity, -Infinity],
            [Infinity, -Infinity],
            [Infinity, -Infinity]
      ];

  for (let i = 0; i < extents.length; i++) {
    let e = extents[i];
    for (let k = 0; k < 3; k++) {
      u[k][0] = (e[k][0] < u[k]) ? e[k][0] : u[k];
      u[k][1] = (e[k][1] > u[k]) ? e[k][1] : u[k];
    }
  }

  return u;
}