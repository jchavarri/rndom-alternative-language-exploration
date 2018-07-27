// Generated by BUCKLESCRIPT VERSION 4.0.1, PLEASE EDIT WITH CARE
'use strict';

var $$Array = require("bs-platform/lib/js/array.js");
var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");

var kSampleStepSize = 1.0 / (11 - 1.0);

function a(aA1, aA2) {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
}

function b(aA1, aA2) {
  return 3.0 * aA2 - 6.0 * aA1;
}

function c(aA1) {
  return 3.0 * aA1;
}

function calcBezier(aT, aA1, aA2) {
  return ((a(aA1, aA2) * aT + b(aA1, aA2)) * aT + 3.0 * aA1) * aT;
}

function getSlope(aT, aA1, aA2) {
  return 3.0 * a(aA1, aA2) * aT * aT + 2.0 * b(aA1, aA2) * aT + 3.0 * aA1;
}

function binarySubdivide(_$staropt$star, _$staropt$star$1, _$staropt$star$2, aX, _aA, _aB, mX1, mX2) {
  while(true) {
    var aB = _aB;
    var aA = _aA;
    var $staropt$star = _$staropt$star$2;
    var $staropt$star$1 = _$staropt$star$1;
    var $staropt$star$2 = _$staropt$star;
    var currentT = $staropt$star$2 !== undefined ? $staropt$star$2 : 0.0;
    var currentX = $staropt$star$1 !== undefined ? $staropt$star$1 : 0.0;
    var i = $staropt$star !== undefined ? $staropt$star : 0;
    var match = Math.abs(currentX) > 0.0000001 && (i + 1 | 0) < 10;
    if (match) {
      var currentT$1 = aA + (aB - aA) / 2.0;
      var currentX$1 = calcBezier(currentT$1, mX1, mX2) - aX;
      var i$1 = i + 1 | 0;
      if (currentX$1 > 0.0) {
        _aB = currentT$1;
        _$staropt$star$2 = i$1;
        _$staropt$star$1 = currentX$1;
        _$staropt$star = currentT$1;
        continue ;
      } else {
        _aA = currentT$1;
        _$staropt$star$2 = i$1;
        _$staropt$star$1 = currentX$1;
        _$staropt$star = currentT$1;
        continue ;
      }
    } else {
      return currentT;
    }
  };
}

function newtonRaphsonIterate(_$staropt$star, aX, _aGuessT, mX1, mX2) {
  while(true) {
    var aGuessT = _aGuessT;
    var $staropt$star = _$staropt$star;
    var i = $staropt$star !== undefined ? $staropt$star : 0;
    var match = i < 4;
    if (match) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope !== 0.0) {
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        var aGuessT$1 = aGuessT - currentX / currentSlope;
        var i$1 = i + 1 | 0;
        _aGuessT = aGuessT$1;
        _$staropt$star = i$1;
        continue ;
      } else {
        return aGuessT;
      }
    } else {
      return aGuessT;
    }
  };
}

function linearEasing(x) {
  return x;
}

function bezier(mX1, mY1, mX2, mY2) {
  var match = !(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1);
  if (match) {
    return Pervasives.failwith("bezier x values must be in [0, 1] range");
  } else {
    var match$1 = mX1 === mY1 && mX2 === mY2;
    if (match$1) {
      return linearEasing;
    } else {
      var sampleValues = $$Array.init(11, (function (i) {
              return calcBezier(i * kSampleStepSize, mX1, mX2);
            }));
      var getTForX = function (aX) {
        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = 10;
        while(currentSample !== lastSample && Caml_array.caml_array_get(sampleValues, currentSample) <= aX) {
          intervalStart += kSampleStepSize;
          currentSample = currentSample + 1 | 0;
        };
        currentSample = currentSample - 1 | 0;
        var dist = (aX - Caml_array.caml_array_get(sampleValues, currentSample)) / (Caml_array.caml_array_get(sampleValues, currentSample + 1 | 0) - Caml_array.caml_array_get(sampleValues, currentSample));
        var guessForT = intervalStart + dist * kSampleStepSize;
        var initialSlope = getSlope(guessForT, mX1, mX2);
        var match = initialSlope >= 0.001;
        var match$1 = initialSlope === 0.0;
        if (match) {
          return newtonRaphsonIterate(undefined, aX, guessForT, mX1, mX2);
        } else if (match$1) {
          return guessForT;
        } else {
          return binarySubdivide(undefined, undefined, undefined, aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
      };
      return (function (x) {
          if (x !== 0.0) {
            if (x !== 1.0) {
              return calcBezier(getTForX(x), mY1, mY2);
            } else {
              return 1.0;
            }
          } else {
            return 0.0;
          }
        });
    }
  }
}

var newtonIterations = 4;

var newtonMinSlope = 0.001;

var subdivisionPrecision = 0.0000001;

var subdivisionMaxIterations = 10;

var kSplineTableSize = 11;

exports.newtonIterations = newtonIterations;
exports.newtonMinSlope = newtonMinSlope;
exports.subdivisionPrecision = subdivisionPrecision;
exports.subdivisionMaxIterations = subdivisionMaxIterations;
exports.kSplineTableSize = kSplineTableSize;
exports.kSampleStepSize = kSampleStepSize;
exports.a = a;
exports.b = b;
exports.c = c;
exports.calcBezier = calcBezier;
exports.getSlope = getSlope;
exports.binarySubdivide = binarySubdivide;
exports.newtonRaphsonIterate = newtonRaphsonIterate;
exports.linearEasing = linearEasing;
exports.bezier = bezier;
/* No side effect */
