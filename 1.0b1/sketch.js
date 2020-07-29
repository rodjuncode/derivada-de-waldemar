let original;
let pixelated;
let pixelateSize = 5;
let levels = 7;
let cam;

function setup() {
  createCanvas(600,720);

	cam = createCapture(VIDEO);
	cam.size(width, height/2);
  cam.hide();

}

function draw() {
  background(50);
  
  cam.loadPixels();
  original = cam.get(0, 0, width, height/2);
  

  let pix = pixelate(original, pixelateSize);
  let res = waldemarDerivative(pix,levels);
  
  image(pix, 0, 0);
  image(res, 0, 360);
}

function pixelate(original, pixelateSize) {
  original.loadPixels();

  let pixelated = [];

  // init pixelate
  for (let i = 0; i < original.width; i++) {
    pixelated[i] = [];
    for (let j = 0; j < original.height; j++) {
      pixelated[i][j] = 0;
    }
  }

  for (let outer_i = 0; outer_i < floor(original.width/pixelateSize); outer_i++) {
    for (let outer_j = 0; outer_j < floor(original.height/pixelateSize); outer_j++) {
      let sum = 0;
      let pixelCount = 0;
      let avg = 0;
      // find the avg value of area
      for (let inner_i = outer_i*pixelateSize; inner_i < outer_i*pixelateSize + pixelateSize; inner_i++) {
        for (let inner_j = outer_j*pixelateSize; inner_j < outer_j*pixelateSize + pixelateSize; inner_j++) {
          let index = (inner_i + inner_j * original.width) * 4;
          sum += original.pixels[index];
          pixelCount++;
        }
      }
      avg = round(sum/pixelCount);
      //pixelated[outer_i][outer_j] = avg;
      // fill area with avg value
      for (let inner_i = outer_i*pixelateSize; inner_i < outer_i*pixelateSize + pixelateSize; inner_i++) {
        for (let inner_j = outer_j*pixelateSize; inner_j < outer_j*pixelateSize + pixelateSize; inner_j++) {
          pixelated[inner_i][inner_j] = avg;
        }
      }
    }
  }
  
  // print to result image
  let result = createImage(original.width,original.height);
  result.loadPixels();
  for (let i = 0; i < result.width; i++) {
    for (let j = 0; j < result.height; j++) {
      let resultVal = pixelated[i][j];
      result.set(i, j, resultVal);
    }
  }
  result.updatePixels();

  return result;
}

function waldemarDerivative(original,levels) {
  
  original.loadPixels();

  // contrast
  let maxValue = -1;
  let minValue = 256;
  for (let i = 0; i < original.width; i++) {
    for (let j = 0; j < original.height; j++) {
      let index = (i + j * original.width) * 4;
      let pixel = original.pixels[index];
      if (pixel > maxValue) {
        maxValue = pixel;
      }
      if (pixel < minValue) {
        minValue = pixel;
      }
    }
  }

  // digitalize
  let pre = [];
  for (let i = 0; i < original.width; i++) {
    pre[i] = [];
    for (let j = 0; j < original.height; j++) {
      let index = (i + j * original.width) * 4;
      let pixel = original.pixels[index];
      let preVal = round(map(pixel,minValue,maxValue,0,levels-1));
      pre[i][j] = preVal;
    }
  }

  // derivative
  // original. 000000666665553211111000000
  // derivada. 000000600001002110000100000
  let derivative = [];
  for (let i = 0; i < original.width; i++) {
    derivative[i] = [];
    derivative[i][0] = pre[i][0];
    for (let j = 1; j < original.height; j++) {
      let derivativeVal = abs(pre[i][j]-pre[i][j-1]);
      derivative[i][j] = derivativeVal;
    }
  } 
  
  result = createImage(original.width, original.height);
  result.loadPixels();
  for (let i = 0; i < result.width; i++) {
    for (let j = 0; j < result.height; j+=pixelateSize) {
      let resultVal = map(derivative[i][j],0,levels-1,255,0);
      //let resultVal = derivative[i][j] > 0 ? 0 : 255;
      for (k = 0; k < pixelateSize; k++) {
        result.set(i, j+k, resultVal);
      }
    }
  }
  result.updatePixels();

  return result;

}
