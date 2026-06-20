// Question generators with normal/hard difficulty
// Used by MathMine, EndlessMarathon, BossBattle

export function genMathProblem(difficulty = "normal") {
  if (difficulty === "hard") return genMathHard();
  return genMathNormal();
}

function genMathNormal() {
  const ops = ["+", "-", "+", "-", "×", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, ans;
  if (op === "+") {
    a = Math.floor(Math.random() * 80) + 10;
    b = Math.floor(Math.random() * 60) + 5;
    ans = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 80) + 20;
    b = Math.floor(Math.random() * (a - 5)) + 1;
    ans = a - b;
  } else if (op === "×") {
    a = Math.floor(Math.random() * 11) + 2;
    b = Math.floor(Math.random() * 11) + 2;
    ans = a * b;
  } else {
    b = Math.floor(Math.random() * 11) + 2;
    const q = Math.floor(Math.random() * 11) + 2;
    a = b * q;
    ans = q;
  }
  return buildChoices(a, b, op, ans, 10);
}

function genMathHard() {
  // 3-digit add/sub, 15×15 multiply, division, occasional 3-operand
  const r = Math.random();
  let a, b, op, ans, display;
  if (r < 0.2) {
    // multi-step: a + b - c or similar
    const x = Math.floor(Math.random() * 90) + 10;
    const y = Math.floor(Math.random() * 50) + 5;
    const z = Math.floor(Math.random() * 30) + 1;
    const ops2 = ["+", "-"];
    const o1 = ops2[Math.floor(Math.random() * 2)];
    const o2 = ops2[Math.floor(Math.random() * 2)];
    const r1 = o1 === "+" ? x + y : x - y;
    ans = o2 === "+" ? r1 + z : r1 - z;
    if (ans < 0) ans = Math.abs(ans);
    display = `${x} ${o1} ${y} ${o2} ${z}`;
    return buildChoicesDisplay(display, ans, 15);
  } else if (r < 0.5) {
    op = Math.random() < 0.5 ? "+" : "-";
    a = Math.floor(Math.random() * 900) + 100; // 100-999
    b = Math.floor(Math.random() * 400) + 50;
    if (op === "-" && b > a) [a, b] = [b, a];
    ans = op === "+" ? a + b : a - b;
  } else if (r < 0.8) {
    op = "×";
    a = Math.floor(Math.random() * 14) + 2; // 2-15
    b = Math.floor(Math.random() * 14) + 2;
    ans = a * b;
  } else {
    op = "÷";
    b = Math.floor(Math.random() * 13) + 3; // 3-15
    const q = Math.floor(Math.random() * 18) + 3; // 3-20
    a = b * q;
    ans = q;
  }
  return buildChoices(a, b, op, ans, 15);
}

function buildChoices(a, b, op, ans, deltaRange) {
  const distractors = new Set([ans]);
  let guard = 0;
  while (distractors.size < 4 && guard++ < 50) {
    let delta = Math.floor(Math.random() * (deltaRange * 2 + 1)) - deltaRange;
    if (delta === 0) delta = 1;
    const d = ans + delta;
    if (d >= 0 && d !== ans) distractors.add(d);
  }
  return { a, b, op, ans, display: `${a} ${op} ${b}`, choices: Array.from(distractors).sort(() => Math.random() - 0.5) };
}

function buildChoicesDisplay(display, ans, deltaRange) {
  const distractors = new Set([ans]);
  let guard = 0;
  while (distractors.size < 4 && guard++ < 50) {
    let delta = Math.floor(Math.random() * (deltaRange * 2 + 1)) - deltaRange;
    if (delta === 0) delta = 1;
    const d = ans + delta;
    if (d >= 0 && d !== ans) distractors.add(d);
  }
  return { display, ans, choices: Array.from(distractors).sort(() => Math.random() - 0.5) };
}
