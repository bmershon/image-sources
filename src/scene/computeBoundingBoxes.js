import extent from "../geom/extent";
import union from "../geom/union";

// adding accumulated transforms to all children in scenograph

export default function computeBoundingBoxes() {
  var scene = this;
  bbox(scene);
}

function bbox(node) {
  let vertices, extents;
  
  if (node === null) return;

  if (node.children) {
    extents = node.children.map(function(d) { return bbox(d); });
    
    if ('mesh' in node) {
      extents.push(extent(vertices));
      node.extent = union(extents);
      return node.extent;
    } else {
      return union(extents);
    }

  } else {

    vertices = node.mesh.vertices.map(function (d) {
      let transformed = mat4.create();
      vec3.transformMat4(transformed, d.pos, node.accumulated);
      return transformed;
    });

    node.extent = extent(vertices);
    return node.extent;
  }
}