// return aabb mesh for this extent
export default function(extent) {
  var c, X, Y, Z,
      epsilon = 1e-6, // minimum scaling
      m = mat4.create(),
      lines =  ["COFF",
                "8 6 0",
                "-0.5 -0.5 0.5 0.5 0.5 0.5",
                "0.5 -0.5 0.5 0.5 0.5 0.5",
                "-0.5 0.5 0.5 0.5 0.5 0.5",
                "0.5 0.5 0.5 0.5 0.5 0.5",
                "-0.5 -0.5 -0.5 0.5 0.5 0.5",
                "0.5 -0.5 -0.5 0.5 0.5 0.5",
                "-0.5 0.5 -0.5 0.5 0.5 0.5",
                "0.5 0.5 -0.5 0.5 0.5 0.5",
                "4 0 1 3 2 ",
                "4 5 4 6 7 ",
                "4 4 0 2 6 ",
                "4 1 5 7 3 ",
                "4 2 3 7 6 ",
                "4 4 5 1 0 "],
      node = {};

  node.mesh = new PolyMesh();
  node.mesh.loadFileFromLines(lines);

  c =  [(extent[0][0] + extent[0][1])/2,
        (extent[1][0] + extent[1][1])/2,
        (extent[2][0] + extent[2][1])/2];

  X = Math.max(extent[0][1] - extent[0][0], epsilon);
  Y = Math.max(extent[1][1] - extent[1][0], epsilon);
  Z = Math.max(extent[2][1] - extent[2][0], epsilon);


  node.accumulated = [ X, 0, 0, c[0],
                       0, Y, 0, c[1],
                       0, 0, Z, c[2],
                       0, 0, 0, 1  ]; 

  for (var i = 0; i < 16; i++) {
    m[i] = node.accumulated[i];
  }
  mat4.transpose(m, m);
  node.accumulated = m;

  return node;
}