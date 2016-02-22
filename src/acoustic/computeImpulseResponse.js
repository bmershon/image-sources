// rate - sampling rate (samples per second)
export default function computeImpulseResponse(rate) {
  var scene = this,
      n = scene.paths.length,
      p = scene.p || 1e-6,
      N,
      index = [],
      response = [],
      time = [];
  
  const s = 340.0; //Sound travels at 340 meters/second

  for (let i = 0; i < n; i++)  {
    let path = scene.paths[i],
        m = path.length,
        magnitude = 1.0,
        total = 0.0,
        a, b = path[m - 1];

    // traverse path from source to receiver
    for (let k = m - 2; k >= 0; k--) {
      let d;

      a = path[k];
      d = vec3.distance(a.pos, b.pos);
      magnitude *= a.rcoeff * 1.0 / Math.pow(1.0 + d, p);
      total += d;
      b = a;
    }
    response.push(magnitude);
    time.push(total/s);
  }

  index = time.map(function(t) {
    return Math.floor(t * rate);
  });

  N = index.length;

  scene.impulseResp = new Float32Array(index[N - 1] + 1);

  for (let i = 0; i < N; i++) {
    scene.impulseResp[index[i]] += response[i];
  }

  return this;
}