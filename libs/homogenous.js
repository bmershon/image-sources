// produces mat3 from a mat4, dropping the translation
mat4.toMat3 = function(out, m) {
  out[0] = m[0];
  out[1] = m[1];
  out[2] = m[2];

  out[4] = m[4];
  out[5] = m[5];
  out[6] = m[6];

  out[8] = m[8];
  out[9] = m[9];
  out[10] = m[10];
};