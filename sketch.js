let original;
let result;

let levels = 7;

function preload() {
  original = loadImage('assets/img/wal.png');
}

function setup() {
  createCanvas(original.width*2,original.width);

  original.loadPixels();

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
  console.log(pre);
  
  //orig.   000000666665553211111000000
  //deriv.  000000600001002110000100000
  let derivative1 = [];
  for (let i = 0; i < original.width; i++) {
    derivative1[i] = [];
    derivative1[i][0] = pre[i][0];
    for (let j = 1; j < original.height; j++) {
      let derivativeVal = abs(pre[i][j]-pre[i][j-1]);
      derivative1[i][j] = derivativeVal;
    }
  }
  console.log(derivative1);

  result = createImage(original.width, original.height);
  result.loadPixels();
  for (let i = 0; i < result.width; i++) {
    for (let j = 0; j < result.height; j++) {
      let resultVal = round(map(derivative1[i][j],0,levels-1,255,0));
      result.set(i, j, resultVal);
    }
  }
  result.updatePixels();
}

function draw() {
  background(50);
  
  image(original, 0, 0);
  image(result, original.width, 0);

}