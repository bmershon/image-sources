//Purpose: Based on the extracted image sources, trace back paths from the
  //receiver to the source, checking to make sure there are no occlusions
  //along the way.  Remember, you're always starting by tracing a path from
  //the receiver to the image, and then from the intersection point with
  //that image's corresponding face to the image's parent, and so on
  //all the way until you get back to the original source.
  
  //Fill in the array scene.paths, where each element of the array is itself
  //an array of objects describing vertices along the path, starting
  //with the receiver and ending with the source.  Each object in each path
  //array should contain a field "pos" which describes the position, as well
  //as an element "rcoeff" which stores the reflection coefficient at that
  //part of the path, which will be used to compute decays in "computeInpulseResponse()"
  //Don't forget the direct path from source to receiver!
import rayIntersectFaces.js from "./rayIntersectFaces";

export default function extractPaths() {
  var scene = this;
  scene.paths = [];
  
  //TODO: Finish this. Extract the rest of the paths by backtracing from
  //the image sources you calculated.  Return an array of arrays in
  //scene.paths.  Recursion is highly recommended
  //Each path should start at the receiver and end at the source
  //(or vice versa), so scene.receiver should be the first element 
  //and scene.source should be the last element of every array in 
  //scene.paths
}