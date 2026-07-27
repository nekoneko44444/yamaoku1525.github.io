(function () {
  "use strict";

  var canvas = document.getElementById("craft-game");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".game-tab"));
  var startCard = document.getElementById("start-card");
  var startButton = document.getElementById("start-game");
  var resetButton = document.getElementById("reset-game");
  var retryButton = document.getElementById("result-retry");
  var gamePanel = document.getElementById("game-panel");
  var gameKicker = document.getElementById("game-kicker");
  var gameTitle = document.getElementById("game-title");
  var gameInstruction = document.getElementById("game-instruction");
  var difficulty = document.getElementById("difficulty");
  var coachMessage = document.getElementById("coach-message");
  var bestScore = document.getElementById("best-score");
  var playStatus = document.getElementById("play-status");
  var resultStrip = document.getElementById("result-strip");
  var resultScore = document.getElementById("result-score");
  var resultTitle = document.getElementById("result-title");
  var resultCopy = document.getElementById("result-copy");
  var startTitle = document.getElementById("start-title");
  var startCopy = document.getElementById("start-copy");

  var W = canvas.width;
  var H = canvas.height;
  var game = "tofu";
  var started = false;
  var drawing = false;
  var startPoint = null;
  var currentPoint = null;
  var chopPoints = [];
  var result = null;
  var bests = { tofu: null, chopsticks: null };

  var GAME_COPY = {
    tofu: {
      kicker: "TOFU CUT",
      title: "お豆腐を、ぴったり半分に。",
      instruction: "白いお豆腐を横切るように、指かマウスで一本の線を引きます。",
      difficulty: "やさしい",
      coach: "お豆腐の上を、端から端へすーっと引いてね。",
      startTitle: "一刀入魂、でものんびり。",
      startCopy: "線は何度でも引き直せます。",
      startButton: "豆腐を切る",
      aria: "豆腐を半分に切るゲーム画面"
    },
    chopsticks: {
      kicker: "CHOPSTICK SPLIT",
      title: "割り箸を、まっすぐ最後まで。",
      instruction: "上の丸い印から、割れ目に沿ってゆっくり下へなぞります。",
      difficulty: "ふつう",
      coach: "最初はそっと。真ん中を見ながら、下までゆっくり割ってね。",
      startTitle: "力まないのが、きれいに割るコツ。",
      startCopy: "上の印から下へ、一本の道をなぞります。",
      startButton: "割り箸を割る",
      aria: "割り箸をまっすぐ割るゲーム画面"
    }
  };

  function safeLoadBest() {
    try {
      ["tofu", "chopsticks"].forEach(function (key) {
        var value = Number(window.localStorage.getItem("nekomono-best-" + key));
        if (value >= 0 && value <= 100) bests[key] = value;
      });
    } catch (error) {
      // The games still work when storage is unavailable.
    }
  }

  function safeSaveBest(key, value) {
    try {
      window.localStorage.setItem("nekomono-best-" + key, String(value));
    } catch (error) {
      // Ignore private-mode and storage policy failures.
    }
  }

  function pointFromEvent(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (W / rect.width),
      y: (event.clientY - rect.top) * (H / rect.height)
    };
  }

  function roundedRect(x, y, width, height, radius) {
    var r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function drawPaperBackground() {
    var gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, "#fffdf4");
    gradient.addColorStop(1, "#fff6d9");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.strokeStyle = "rgba(230, 190, 82, .16)";
    ctx.lineWidth = 1;
    for (var x = 20; x < W; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (var y = 18; y < H; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.fillStyle = "rgba(255, 154, 181, .18)";
    ctx.beginPath();
    ctx.arc(70, 60, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(127, 207, 141, .18)";
    ctx.beginPath();
    ctx.arc(W - 68, H - 58, 48, 0, Math.PI * 2);
    ctx.fill();
  }

  function polygonArea(points) {
    var sum = 0;
    for (var i = 0; i < points.length; i += 1) {
      var a = points[i];
      var b = points[(i + 1) % points.length];
      sum += a.x * b.y - b.x * a.y;
    }
    return Math.abs(sum) / 2;
  }

  function sideOfLine(point, a, b) {
    return (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x);
  }

  function lineIntersection(p1, p2, a, b) {
    var s1 = sideOfLine(p1, a, b);
    var s2 = sideOfLine(p2, a, b);
    var denominator = s1 - s2;
    var t = Math.abs(denominator) < 0.0001 ? 0 : s1 / denominator;
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    };
  }

  function clipPolygon(points, a, b, keepPositive) {
    var output = [];
    for (var i = 0; i < points.length; i += 1) {
      var current = points[i];
      var next = points[(i + 1) % points.length];
      var currentInside = keepPositive
        ? sideOfLine(current, a, b) >= 0
        : sideOfLine(current, a, b) <= 0;
      var nextInside = keepPositive
        ? sideOfLine(next, a, b) >= 0
        : sideOfLine(next, a, b) <= 0;

      if (currentInside) output.push(current);
      if (currentInside !== nextInside) {
        output.push(lineIntersection(current, next, a, b));
      }
    }
    return output;
  }

  function fillPolygon(points, fill, stroke) {
    if (points.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  function drawSparkles(score) {
    if (score < 88) return;
    var spots = [
      [118, 122, "#ff9ab5"],
      [646, 126, "#ffd95a"],
      [102, 392, "#7fcf8d"],
      [664, 378, "#8fd4ff"]
    ];
    spots.forEach(function (spot, index) {
      var size = 8 + (index % 2) * 4;
      ctx.save();
      ctx.translate(spot[0], spot[1]);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = spot[2];
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.restore();
    });
  }

  function drawTofu() {
    drawPaperBackground();

    ctx.save();
    ctx.fillStyle = "rgba(59, 43, 35, .10)";
    ctx.beginPath();
    ctx.ellipse(W / 2 + 8, 330, 260, 94, 0, 0, Math.PI * 2);
    ctx.fill();

    var plate = ctx.createRadialGradient(W / 2, 280, 20, W / 2, 300, 275);
    plate.addColorStop(0, "#ffffff");
    plate.addColorStop(0.78, "#f8fbf8");
    plate.addColorStop(1, "#d8e8df");
    ctx.fillStyle = plate;
    ctx.strokeStyle = "#3b2b23";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(W / 2, 300, 265, 104, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    var tofu = [
      { x: 190, y: 152 },
      { x: 570, y: 152 },
      { x: 570, y: 338 },
      { x: 190, y: 338 }
    ];

    ctx.save();
    ctx.translate(0, 12);
    fillPolygon(tofu, "rgba(92, 66, 39, .18)");
    ctx.restore();

    if (result && result.pieces) {
      fillPolygon(result.pieces[0], "#fffdf5", "#3b2b23");
      fillPolygon(result.pieces[1], "#fff7df", "#3b2b23");
      drawSparkles(result.score);
    } else {
      var tofuGradient = ctx.createLinearGradient(190, 152, 570, 338);
      tofuGradient.addColorStop(0, "#ffffff");
      tofuGradient.addColorStop(0.5, "#fffdf5");
      tofuGradient.addColorStop(1, "#f5ebd1");
      fillPolygon(tofu, tofuGradient, "#3b2b23");
      ctx.strokeStyle = "rgba(184, 156, 115, .35)";
      ctx.lineWidth = 2;
      for (var i = 0; i < 7; i += 1) {
        ctx.beginPath();
        ctx.arc(248 + i * 48, 215 + (i % 2) * 52, 2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (startPoint && currentPoint) {
      ctx.save();
      ctx.strokeStyle = result ? "#df786d" : "#ff7298";
      ctx.lineWidth = 8;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(255, 114, 152, .26)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
      ctx.restore();
    }

    if (!drawing && !result) {
      ctx.fillStyle = "rgba(59, 43, 35, .62)";
      ctx.font = "800 18px 'Yu Gothic', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("お豆腐を横切るように、一本の線を引いてね", W / 2, 422);
    }
  }

  function drawChopsticks() {
    drawPaperBackground();

    ctx.save();
    ctx.fillStyle = "rgba(59, 43, 35, .09)";
    roundedRect(212, 52, 336, 410, 34);
    ctx.fill();
    ctx.restore();

    var split = result ? Math.min(34, 8 + (100 - result.score) * 0.2) : 0;
    var bottomLeft = 374 - split;
    var bottomRight = 386 + split;
    var wood = ctx.createLinearGradient(270, 0, 490, 0);
    wood.addColorStop(0, "#bb7b35");
    wood.addColorStop(0.18, "#f0be73");
    wood.addColorStop(0.5, "#ffd997");
    wood.addColorStop(0.82, "#e2a45c");
    wood.addColorStop(1, "#9f622e");

    var left = [
      { x: 304, y: 76 },
      { x: 378, y: 76 },
      { x: bottomLeft, y: 438 },
      { x: 294 - split * 0.35, y: 438 }
    ];
    var right = [
      { x: 382, y: 76 },
      { x: 456, y: 76 },
      { x: 466 + split * 0.35, y: 438 },
      { x: bottomRight, y: 438 }
    ];

    fillPolygon(left, wood, "#3b2b23");
    fillPolygon(right, wood, "#3b2b23");

    ctx.save();
    ctx.strokeStyle = "rgba(100, 57, 25, .24)";
    ctx.lineWidth = 2;
    [325, 348, 412, 435].forEach(function (x, index) {
      ctx.beginPath();
      ctx.moveTo(x, 96);
      ctx.quadraticCurveTo(x + (index % 2 ? 8 : -8), 250, x + 2, 420);
      ctx.stroke();
    });
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "#78502f";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(380, 90);
    ctx.lineTo(380, 430);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "#ff9ab5";
    ctx.strokeStyle = "#3b2b23";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(380, 91, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(380, 91, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (chopPoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = result ? "#5f3c26" : "#ff7298";
      ctx.lineWidth = result ? 6 : 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(chopPoints[0].x, chopPoints[0].y);
      for (var i = 1; i < chopPoints.length; i += 1) {
        ctx.lineTo(chopPoints[i].x, chopPoints[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    if (result) {
      drawSparkles(result.score);
    } else if (!drawing) {
      ctx.fillStyle = "rgba(59, 43, 35, .62)";
      ctx.font = "800 18px 'Yu Gothic', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("上のピンクの印から、まっすぐ下へなぞってね", W / 2, 476);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    if (game === "tofu") drawTofu();
    else drawChopsticks();
  }

  function scoreMessage(score, kind) {
    if (score >= 96) {
      return {
        title: kind === "tofu" ? "ほぼ完全な半分こ！" : "気持ちいい、すぱっと割り！",
        copy: "ねこ耳店主もびっくり。今日の手仕事は名人級です。",
        coach: "わあ、きれい！ これは小屋の名人認定だね。"
      };
    }
    if (score >= 84) {
      return {
        title: "きれいな手仕事です",
        copy: kind === "tofu" ? "左右の大きさがよくそろいました。" : "割れ目がまっすぐ、最後までつながりました。",
        coach: "いい手つき！ 力の抜き方がちょうどよかったよ。"
      };
    }
    if (score >= 65) {
      return {
        title: "なかなかの仕上がり",
        copy: "あと少しだけ中心を意識すると、もっときれいになりそう。",
        coach: "おしい！ もう一回なら、きっともっとそろうよ。"
      };
    }
    return {
      title: "手づくりらしい味わい",
      copy: kind === "tofu" ? "大胆な一刀でした。ゆっくり中心を狙ってみよう。" : "少し力が入ったかも。細い線をなぞる気持ちで。",
      coach: "大丈夫、失敗も小屋の楽しみ。のんびりやり直そう。"
    };
  }

  function publishResult(score, detail) {
    var message = scoreMessage(score, game);
    resultScore.textContent = score;
    resultTitle.textContent = message.title;
    resultCopy.textContent = detail || message.copy;
    coachMessage.textContent = message.coach;
    resultStrip.classList.add("is-visible");
    resultStrip.classList.toggle("is-great", score >= 88);
    playStatus.textContent = "完成！ " + score + "点でした。";

    if (bests[game] === null || score > bests[game]) {
      bests[game] = score;
      safeSaveBest(game, score);
    }
    updateBest();
  }

  function judgeTofu() {
    if (!startPoint || !currentPoint) return;
    var dx = currentPoint.x - startPoint.x;
    var dy = currentPoint.y - startPoint.y;
    if (Math.hypot(dx, dy) < 70) {
      startPoint = null;
      currentPoint = null;
      playStatus.textContent = "もう少し長く、端から端へ線を引いてみてね。";
      coachMessage.textContent = "短い線だと切れないみたい。お豆腐を横切ってみよう。";
      draw();
      return;
    }

    var tofu = [
      { x: 190, y: 152 },
      { x: 570, y: 152 },
      { x: 570, y: 338 },
      { x: 190, y: 338 }
    ];
    var positive = clipPolygon(tofu, startPoint, currentPoint, true);
    var negative = clipPolygon(tofu, startPoint, currentPoint, false);
    var areaA = polygonArea(positive);
    var areaB = polygonArea(negative);
    var total = areaA + areaB;

    if (areaA < 100 || areaB < 100 || total < 1000) {
      startPoint = null;
      currentPoint = null;
      playStatus.textContent = "線がお豆腐を横切るように、もう一度引いてね。";
      coachMessage.textContent = "お豆腐の外から反対側まで、すーっと一本だよ。";
      draw();
      return;
    }

    var smallerRatio = Math.min(areaA, areaB) / total;
    var error = Math.abs(0.5 - smallerRatio);
    var score = Math.max(0, Math.min(100, Math.round(100 - error * 320)));
    var percentA = Math.round((areaA / total) * 100);
    var percentB = 100 - percentA;
    result = { score: score, pieces: [positive, negative] };
    publishResult(score, "切り分けは " + percentA + "： " + percentB + "。半分に近いほど高得点です。");
    draw();
  }

  function judgeChopsticks() {
    if (chopPoints.length < 2) return;
    var last = chopPoints[chopPoints.length - 1];
    var progress = Math.max(0, Math.min(1, (last.y - 91) / (438 - 91)));

    if (progress < 0.83) {
      playStatus.textContent = "あと少し。割れ目を下までつないでみてね。";
      coachMessage.textContent = "途中で止まっているよ。指を離さず、いちばん下まで。";
      chopPoints = [];
      draw();
      return;
    }

    var useful = chopPoints.filter(function (point) {
      return point.y >= 91 && point.y <= 448;
    });
    var deviations = useful.map(function (point) {
      return Math.abs(point.x - 380);
    });
    var average = deviations.reduce(function (sum, value) {
      return sum + value;
    }, 0) / Math.max(1, deviations.length);
    var maximum = Math.max.apply(Math, deviations);
    var score = Math.max(0, Math.min(100, Math.round(102 - average * 1.45 - maximum * 0.34)));

    result = { score: score, average: average, maximum: maximum };
    publishResult(score, "中心からの平均ぶれは " + average.toFixed(1) + "。小さいほどきれいに割れます。");
    draw();
  }

  function beginPointer(event) {
    if (!started || result) return;
    var point = pointFromEvent(event);
    if (game === "chopsticks" && Math.hypot(point.x - 380, point.y - 91) > 58) {
      playStatus.textContent = "ピンクの丸から始めてね。";
      coachMessage.textContent = "割り箸のいちばん上、ピンクの印に指を置いてみよう。";
      return;
    }

    drawing = true;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Pointer capture is an enhancement, not a requirement.
    }

    if (game === "tofu") {
      startPoint = point;
      currentPoint = point;
      playStatus.textContent = "そのまま反対側へ、すーっと。";
    } else {
      chopPoints = [point];
      playStatus.textContent = "真ん中を見ながら、ゆっくり下へ。";
    }
    draw();
  }

  function movePointer(event) {
    if (!drawing || !started || result) return;
    var point = pointFromEvent(event);
    if (game === "tofu") {
      currentPoint = point;
    } else {
      var last = chopPoints[chopPoints.length - 1];
      if (!last || point.y >= last.y - 7) {
        chopPoints.push(point);
      }
      var deviation = Math.abs(point.x - 380);
      if (deviation > 52) {
        playStatus.textContent = "少し中心へ戻してみよう。";
      }
    }
    draw();
  }

  function endPointer() {
    if (!drawing) return;
    drawing = false;
    if (game === "tofu") judgeTofu();
    else judgeChopsticks();
  }

  function updateBest() {
    bestScore.textContent = bests[game] === null ? "--" : String(bests[game]);
  }

  function resetRound(showStart) {
    started = !showStart;
    drawing = false;
    startPoint = null;
    currentPoint = null;
    chopPoints = [];
    result = null;
    resultStrip.classList.remove("is-visible", "is-great");
    resultScore.textContent = "--";
    resultTitle.textContent = "結果はここに出ます";
    resultCopy.textContent = game === "tofu"
      ? "左右の大きさが近いほど高得点です。"
      : "中心からのぶれが小さいほど高得点です。";
    playStatus.textContent = showStart ? "スタートを押してね。" : "さあ、やってみよう。";
    coachMessage.textContent = GAME_COPY[game].coach;
    startCard.classList.toggle("is-hidden", !showStart);
    draw();
  }

  function selectGame(nextGame) {
    game = nextGame;
    var copy = GAME_COPY[game];

    tabs.forEach(function (tab) {
      var active = tab.dataset.game === game;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active) gamePanel.setAttribute("aria-labelledby", tab.id);
    });

    gameKicker.textContent = copy.kicker;
    gameTitle.textContent = copy.title;
    gameInstruction.textContent = copy.instruction;
    difficulty.textContent = copy.difficulty;
    startTitle.textContent = copy.startTitle;
    startCopy.textContent = copy.startCopy;
    startButton.textContent = copy.startButton;
    canvas.setAttribute("aria-label", copy.aria);
    updateBest();
    resetRound(true);
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      selectGame(tab.dataset.game);
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      var direction = event.key === "ArrowRight" ? 1 : -1;
      var nextIndex = (index + direction + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      selectGame(tabs[nextIndex].dataset.game);
    });
  });

  startButton.addEventListener("click", function () {
    started = true;
    startCard.classList.add("is-hidden");
    playStatus.textContent = game === "tofu"
      ? "お豆腐を横切る線を引いてね。"
      : "上のピンクの印から始めてね。";
    canvas.focus();
    draw();
  });

  resetButton.addEventListener("click", function () {
    resetRound(false);
    canvas.focus();
  });

  retryButton.addEventListener("click", function () {
    resetRound(false);
    canvas.focus();
  });

  canvas.addEventListener("pointerdown", beginPointer);
  canvas.addEventListener("pointermove", movePointer);
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);

  safeLoadBest();
  selectGame("tofu");
})();
