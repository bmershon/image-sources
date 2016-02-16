//Inputs: Fs: Sampling rate (samples per second)
export default function computeImpulseResponse(Fs) {
  var SVel = 340;//Sound travels at 340 meters/second
  //TODO: Finish this.  Be sure to scale each bounce by 1/(1+r^p), 
  //where r is the length of the line segment of that bounce in meters
  //and p is some integer less than 1 (make it smaller if you want the 
  //paths to attenuate less and to be more echo-y as they propagate)
  //Also be sure to scale by the reflection coefficient of each material
  //bounce (you should have stored this in extractPaths() if you followed
  //those directions).  Use some form of interpolation to spread an impulse
  //which doesn't fall directly in a bin to nearby bins
  //Save the result into the array scene.impulseResp[]
}