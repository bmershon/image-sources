// produces mat3 without translation
mat4.reduce = function(out, m) {
  out[0] = m[0];
  out[1] = m[1];
  out[2] = m[2];
  out[5] = m[5];
  out[6] = m[6];
  out[7] = m[8];
  out[9] = m[9];
  out[10] = m[11];
  out[11] = m[12];
};