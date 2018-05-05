const ClippedQuadric = function (surfaceCoeffMatrix, clipperCoeffMatrix) {
  this.surfaceCoeffMatrix = surfaceCoeffMatrix;
  this.clipperCoeffMatrix = clipperCoeffMatrix;
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
  this.clipperCoeffMatrix.premul(matrix).mul(matrix.transpose());
  return this;
}

ClippedQuadric.prototype.transformClipper = function (matrix) {
  matrix.invert();
  this.clipperCoeffMatrix.premul(matrix).mul(matrix.transpose());
  return this;
}