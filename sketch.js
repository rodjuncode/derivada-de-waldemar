let original;
let result;

let levels = 7;

let cam;

// function preload() {
//   original = loadImage('assets/img/wal.png');
// }

function setup() {
  createCanvas(600,320);

	cam = createCapture(VIDEO);
	cam.size(width, height);
	cam.hide();
}

function draw() {
  background(50);

  cam.loadPixels();
  original = cam.get(0, 0, width, height);
  result = waldemarDerivative(original,levels);
   
  //image(original, 0, 0);
  //image(result, original.width, 0);
  image(result, 0, 0);

}


function waldemarDerivative(original,levels) {
  
  original.loadPixels();

  // translation from 
  let pre = [];
  for (let i = 0; i < original.width; i++) {
    pre[i] = [];
    for (let j = 0; j < original.height; j++) {
      let index = (i + j * original.width) * 4;
      let pixel = original.pixels[index];
      let preVal = round(map(pixel,0,255,0,levels-1));
      pre[i][j] = preVal;
    }
  }
  
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
    for (let j = 0; j < result.height; j++) {
      let resultVal = round(map(derivative[i][j],0,levels-1,255,0));
      result.set(i, j, resultVal);
    }
  }
  result.updatePixels();

  return result;

}