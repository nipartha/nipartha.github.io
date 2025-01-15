// asg0.js
// Demonstrates basic vector operations without relying on unimplemented cuon-matrix.js methods.

let canvas, ctx;

/**
 * main() is called as soon as the page loads (onload in <body>).
 * It sets up the 2D context and draws the initial vectors.
 */
function main() {
  // Retrieve the <canvas> element
  canvas = document.getElementById('cnv1');
  if (!canvas) {
    console.error('Failed to retrieve the <canvas> element');
    return;
  }

  // Get 2D rendering context
  ctx = canvas.getContext('2d');

  // Draw the initial state (v1 in red, v2 in blue)
  handleDrawEvent();
}

/**
 * Clears the canvas by filling it with black.
 */
function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws a Vector3 'v' as a line from the canvas center in 'color'.
 * We multiply coordinates by 20 to make them more visible.
 */
function drawVector(v, color) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const scale = 20;

  // Because Y in canvas increases downward, invert v's Y for a standard math orientation
  const xEnd = cx + (v.elements[0] * scale);
  const yEnd = cy - (v.elements[1] * scale);

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(cx, cy);
  ctx.lineTo(xEnd, yEnd);
  ctx.stroke();
}

/**
 * Reads v1 and v2 from the input fields, then draws them in red and blue.
 */
function handleDrawEvent() {
  clearCanvas();

  // Grab input values
  const v1x = parseFloat(document.getElementById('v1x').value);
  const v1y = parseFloat(document.getElementById('v1y').value);
  const v2x = parseFloat(document.getElementById('v2x').value);
  const v2y = parseFloat(document.getElementById('v2y').value);

  // Construct vectors (z=0 by default)
  let v1 = new Vector3([v1x, v1y, 0]);
  let v2 = new Vector3([v2x, v2y, 0]);

  // Draw them
  drawVector(v1, 'red');   // original v1
  drawVector(v2, 'blue');  // original v2
}

/**
 * Called by the second Draw button to perform selected operations on v1 and v2.
 */
function handleDrawOperationEvent() {
  // Clear and re-draw the original vectors
  clearCanvas();

  // Grab input values
  const v1x = parseFloat(document.getElementById('v1x').value);
  const v1y = parseFloat(document.getElementById('v1y').value);
  const v2x = parseFloat(document.getElementById('v2x').value);
  const v2y = parseFloat(document.getElementById('v2y').value);
  const operation = document.getElementById('operation').value;
  const scalarVal = parseFloat(document.getElementById('scalar').value);

  // Reconstruct original vectors
  let v1 = new Vector3([v1x, v1y, 0]);
  let v2 = new Vector3([v2x, v2y, 0]);

  // Draw them in red & blue
  drawVector(v1, 'red');
  drawVector(v2, 'blue');

  // We'll draw the result in green
  let v3, v4;

  switch (operation) {
    case 'add': {
      // Manually compute v1 + v2
      let sum = new Vector3([
        v1.elements[0] + v2.elements[0],
        v1.elements[1] + v2.elements[1],
        v1.elements[2] + v2.elements[2],
      ]);
      drawVector(sum, 'green');
      console.log('v1 + v2 =', sum.elements);
      break;
    }

    case 'sub': {
      // Manually compute v1 - v2
      let diff = new Vector3([
        v1.elements[0] - v2.elements[0],
        v1.elements[1] - v2.elements[1],
        v1.elements[2] - v2.elements[2],
      ]);
      drawVector(diff, 'green');
      console.log('v1 - v2 =', diff.elements);
      break;
    }

    case 'mul': {
      // Multiply each vector by scalar
      let v1Scaled = new Vector3([
        v1.elements[0] * scalarVal,
        v1.elements[1] * scalarVal,
        v1.elements[2] * scalarVal,
      ]);
      let v2Scaled = new Vector3([
        v2.elements[0] * scalarVal,
        v2.elements[1] * scalarVal,
        v2.elements[2] * scalarVal,
      ]);
      drawVector(v1Scaled, 'green');
      drawVector(v2Scaled, 'green');
      console.log(`v1 * ${scalarVal} =`, v1Scaled.elements);
      console.log(`v2 * ${scalarVal} =`, v2Scaled.elements);
      break;
    }

    case 'div': {
      if (scalarVal === 0) {
        console.error('Cannot divide by zero.');
        return;
      }
      // Divide each vector by scalar
      let v1Div = new Vector3([
        v1.elements[0] / scalarVal,
        v1.elements[1] / scalarVal,
        v1.elements[2] / scalarVal,
      ]);
      let v2Div = new Vector3([
        v2.elements[0] / scalarVal,
        v2.elements[1] / scalarVal,
        v2.elements[2] / scalarVal,
      ]);
      drawVector(v1Div, 'green');
      drawVector(v2Div, 'green');
      console.log(`v1 / ${scalarVal} =`, v1Div.elements);
      console.log(`v2 / ${scalarVal} =`, v2Div.elements);
      break;
    }

    case 'angle': {
      // Use dot product & magnitudes
      let angleDeg = angleBetween(v1, v2);
      console.log('Angle:', angleDeg.toFixed(3));
      break;
    }

    case 'magnitude': {
      let magV1 = magnitudeOf(v1);
      let magV2 = magnitudeOf(v2);
      console.log('Magnitude v1:', magV1.toFixed(3));
      console.log('Magnitude v2:', magV2.toFixed(3));
      break;
    }

    case 'normalize': {
      // Each normalized vector is drawn in green
      let normV1 = normalizeVector(v1);
      let normV2 = normalizeVector(v2);
      drawVector(normV1, 'green');
      drawVector(normV2, 'green');
      console.log('norm(v1) =', normV1.elements);
      console.log('norm(v2) =', normV2.elements);
      break;
    }

    case 'area': {
      let areaVal = areaTriangle(v1, v2);
      console.log('Area of triangle:', areaVal.toFixed(3));
      break;
    }

    default:
      console.log('No valid operation selected.');
  }
}

/** 
 * Manual dot product for 2D (z ignored).
 */
function dotProduct(a, b) {
  return a.elements[0]*b.elements[0] + 
         a.elements[1]*b.elements[1];
}

/**
 * Compute the angle (in degrees) between two vectors (treated as 2D).
 */
function angleBetween(a, b) {
  let dotVal = dotProduct(a, b);
  let magVal = magnitudeOf(a) * magnitudeOf(b);
  if (magVal === 0) return 0;

  let cosTheta = dotVal / magVal;
  cosTheta = Math.max(-1, Math.min(1, cosTheta)); // clamp for float errors
  let rad = Math.acos(cosTheta);
  return rad * (180.0 / Math.PI);
}

/**
 * Compute the magnitude of a 2D vector (ignoring z).
 */
function magnitudeOf(v) {
  let x = v.elements[0];
  let y = v.elements[1];
  return Math.sqrt(x*x + y*y);
}

/**
 * Create a new Vector3 that is the normalized copy of v (2D).
 */
function normalizeVector(v) {
  let m = magnitudeOf(v);
  if (m === 0) {
    return new Vector3([0, 0, 0]);
  }
  return new Vector3([
    v.elements[0] / m,
    v.elements[1] / m,
    0
  ]);
}

/**
 * Cross product of 2D vectors (treated as 3D with z=0) only affects z.
 * We only need the magnitude for area, so let's compute x,y,z but we care about z mostly.
 */
function crossProduct(a, b) {
  // (x1, y1, 0) x (x2, y2, 0) => (0, 0, x1*y2 - y1*x2)
  let x1 = a.elements[0], y1 = a.elements[1];
  let x2 = b.elements[0], y2 = b.elements[1];
  let zVal = x1*y2 - y1*x2;

  // We'll just store the result in a new Vector3
  return new Vector3([0, 0, zVal]);
}

/**
 * area = 0.5 * || v1 x v2 || 
 */
function areaTriangle(a, b) {
  let c = crossProduct(a, b);
  // magnitude is just absolute value of z
  let crossMag = Math.abs(c.elements[2]);
  return 0.5 * crossMag;
}
