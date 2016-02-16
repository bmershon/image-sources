//Given a ray described by an initial point P0 and a direction V both in
//world coordinates, check to see 
//if it intersects the polygon described by "vertices," an array of vec3
//values describing the location of the polygon vertices in its child frame.
//mvMatrix is a matrix describing how to transform "vertices" into world coordinates
//which you will have to do to get the correct intersection in world coordinates.
//Be sure to compute the plane normal only after you have transformed the points,
//and be sure to only compute intersections which are inside of the polygon
//(you can assume that all polygons are convex and use the area method)
export default function rayIntersectPolygon(P0, V, vertices, mvMatrix) {
  //TODO: Fill this in
  
  //Step 1: Make a new array of vec3s which holds "vertices" transformed 
  //to world coordinates (hint: vec3 has a function "transformMat4" which is useful)

  
  //Step 2: Compute the plane normal of the plane spanned by the transformed vertices
  
  //Step 3: Perform ray intersect plane
  
  
  //Step 4: Check to see if the intersection point is inside of the transformed polygon
  //You can assume that the polygon is convex.  If you use the area test, you can
  //allow for some wiggle room in the two areas you're comparing (e.g. absolute difference
  //not exceeding 1e-4)
  
  
  //Step 5: Return the intersection point if it exists or null if it's outside
  //of the polygon or if the ray is perpendicular to the plane normal (no intersection)
  
  return {t:1e9, P:vec3.fromValues(0, 0, 0)}; //These are dummy values, but you should return 
  //both an intersection point and a parameter t.  The parameter t will be used to sort
  //intersections in order of occurrence to figure out which one happened first
}