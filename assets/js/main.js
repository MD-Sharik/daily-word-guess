/* Hero animation: types guesses and flips the tiles (CSS-driven). Static final state when reduced motion is on. */
(function () {
  var board = document.getElementById("board");
  if (!board) return;
  var answer = "CRANE";
  var guesses = ["SLATE", "PIOUS", "BRACE", "CRANE"];
  var tiles = [];
  for (var i = 0; i < 25; i++) {
    var t = document.createElement("div");
    t.className = "t anim";
    t.setAttribute("aria-hidden", "true");
    board.appendChild(t);
    tiles.push(t);
  }
  function evaluate(g) {
    var res = ["x", "x", "x", "x", "x"], left = {};
    for (var a = 0; a < 5; a++) {
      if (g[a] === answer[a]) res[a] = "g"; else left[answer[a]] = (left[answer[a]] || 0) + 1;
    }
    for (var b = 0; b < 5; b++) {
      if (res[b] === "g") continue;
      if (left[g[b]] > 0) { res[b] = "y"; left[g[b]]--; }
    }
    return res;
  }
  function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    guesses.forEach(function (g, r) {
      var ev = evaluate(g);
      for (var c = 0; c < 5; c++) { var t = tiles[r * 5 + c]; t.textContent = g[c]; t.className = "t " + ev[c]; }
    });
    return;
  }
  async function play() {
    while (true) {
      tiles.forEach(function (t) { t.textContent = ""; t.className = "t anim"; });
      await wait(700);
      for (var r = 0; r < guesses.length; r++) {
        var w = guesses[r], ev = evaluate(w);
        for (var c = 0; c < 5; c++) {
          var t = tiles[r * 5 + c];
          t.textContent = w[c];
          t.className = "t anim f pop";
          await wait(130);
        }
        await wait(250);
        for (var k = 0; k < 5; k++) {
          var tt = tiles[r * 5 + k];
          tt.classList.add("flip");
          await wait(260);
          tt.className = "t anim flip " + ev[k];
          void tt.offsetWidth;
          tt.classList.remove("flip");
          await wait(120);
        }
        await wait(450);
      }
      await wait(3200);
    }
  }
  play();
})();
