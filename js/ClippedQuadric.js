const ClippedQuadric = function (surfaceCoeffMatrix, clipperCoeffMatrix, brdf) {
  this.surfaceCoeffMatrix = surfaceCoeffMatrix;
  this.clipperCoeffMatrix = clipperCoeffMatrix;
  this.brdf = brdf;
}

ClippedQuadric.prototype.setUnitSphere = function () {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  return this;
}

ClippedQuadric.prototype.setUnitCylinder = function () {
  this.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -1);
  this.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  return this;
}

ClippedQuadric.prototype.transform = function (matrix) {
  matrix.invert();
  this.surfaceCoeffMatrix.premul(matrix).mul(matrix.transpose());
  matrix.transpose();
  this.clipperCoeffMatrix.premul(matrix).mul(matrix.transpose());
  return this;
}

ClippedQuadric.prototype.transformClipper = function (matrix) {
  matrix.invert();
  console.log(this.clipperCoeffMatrix.storage);
  this.clipperCoeffMatrix.premul(matrix).mul(matrix.transpose());
  console.log(this.clipperCoeffMatrix.storage);
  return this;
}