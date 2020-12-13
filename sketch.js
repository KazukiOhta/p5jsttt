let pointer;
let bit_of_o;
let bit_of_x;

// Basic Functions
function setup() {
  createCanvas(600, 600);
  reset();
}

function draw() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      fillbychar(lookupBoard(i, j));
      stroke(255);
      strokeWeight(4);
      rect(200 * j, 200 * i, 200, 200);
    }
  }
  fillbychar("O");
  noStroke();
  ellipse(100 + 200 * pointer.x, 100 + 200 * pointer.y, 20);
}

// KeyPress Functions
function keyPressed() {
  if (37 <= keyCode && keyCode <= 40) {
    // arrows
    arrowKey();
  }
  if (key == " ") {
    confirmKey();
  }
  if (keyCode == 8 || keyCode == 13) {
    // back space or enter key
    resetKey();
  }
}

function arrowKey() {
  if (keyCode === LEFT_ARROW) {
    pointer.x += -1;
  }
  if (keyCode === RIGHT_ARROW) {
    pointer.x += +1;
  }
  if (keyCode === UP_ARROW) {
    pointer.y += -1;
  }
  if (keyCode === DOWN_ARROW) {
    pointer.y += +1;
  }
  pointer.x = constrain(pointer.x, 0, 2);
  pointer.y = constrain(pointer.y, 0, 2);
}

function confirmKey() {
  if (lookupBoard(pointer.y, pointer.x) == "_") {
    appendBoard(pointer.y, pointer.x, "o");
    stateBasedAction();
  } else {
  }
}

function resetKey() {
  reset();
}

// Utility Functions

function fillbychar(c) {
  if (c == "_") {
    fill(220, 220, 220);
    return;
  }
  if (c == "o") {
    fill(200, 200, 255);
    return;
  }
  if (c == "x") {
    fill(255, 200, 200);
    return;
  }
  if (c == "O") {
    fill(0, 0, 255);
    return;
  }
  if (c == "X") {
    fill(255, 0, 0);
    return;
  }
  fill(0, 0, 0);
}

// Bit Board Functions
function lookupBoard(i, j) {
  mask = (1 << (3 * i + j));
  if ((bit_of_o & mask) != 0) {
    return "o";
  }
  if ((bit_of_x & mask) != 0) {
    return "x";
  }
  return "_";
}

function appendBoard(i, j, c) {
  mask = (1 << (3 * i + j));
  full = (1 << 9) - 1;
  bit_of_o &= full - mask;
  bit_of_x &= full - mask;
  if (c == "o") {
    bit_of_o |= mask;
  }
  if (c == "x") {
    bit_of_x |= mask;
  }
}

// Game Ending Procedure Functions
function gameset() {
  j = judge(bit_of_o, bit_of_x);
  if (j == "o") {
    bit_of_o = 0b111111111;
    bit_of_x = 0;
  }
  if (j == "x") {
    bit_of_o = 0;
    bit_of_x = 0b111111111;
  }
  if (j == "draw") {
    bit_of_o = 0;
    bit_of_x = 0;
  }
}

// Game Processing Functions
function stateBasedAction() {
  j = judge(bit_of_o, bit_of_x);
  if (j == "inplay") {
    AI();
    j = judge(bit_of_o, bit_of_x);
    if (j == "inplay") {
      return;
    }
  }
  gameset();
}

function judge(bo, bx) {
  bingos = [0b111000000, 0b000111000, 0b000000111, 0b100100100,
    0b010010010, 0b001001001, 0b100010001, 0b001010100
  ];
  for (let i = 0; i < 8; i++) {
    bingo = bingos[i];
    if ((bo & bingo) == bingo) {
      return "o";
    }
    if ((bx & bingo) == bingo) {
      return "x";
    }
  }
  full = 0b111111111;
  if ((bo | bx) == full) {
    return "draw";
  }
  return "inplay";
}

function reset() {
  pointer = createVector(1, 1);
  bit_of_o = 0;
  bit_of_x = 0;
}

// Thinking Routine Functions

function AI() {
  available = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (lookupBoard(i, j) == "_") {
        available.push([i, j])
      }
    }
  }
  m = random(available);
  appendBoard(m[0], m[1], "x");
}
