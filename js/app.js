document.addEventListener("DOMContentLoaded", function () {
  const startButtonHeart = document.getElementById("startButtonHeart");
  const greenScreen = document.getElementById("greenScreen");
  const clickPrompt = document.getElementById("clickPrompt");
  const clickPromptTitle = document.getElementById("clickPromptTitle");
  const videoElement = document.querySelector(".video");
  const typingElement = document.querySelector(".titre");
  const happyGui = document.getElementById("c");

  const container = document.querySelector(".container");
  const characters = "LOVE";
  const columnCount = 40; // Количество колонок
  const symbolsPerColumn = 20; // Количество символов в колонке
  let cooldownCount = 0;

  function createColumn() {
    const column = document.createElement("div");
    column.classList.add("drop-column");
    column.style.left = Math.random() * 100 + "vw";
    column.style.animationDuration = Math.random() * 3 + 2 + "s";

    for (let i = 0; i < symbolsPerColumn; i++) {
      const symbol = document.createElement("span");
      symbol.classList.add("symbol");
      symbol.textContent =
        characters[Math.floor(Math.random() * characters.length)];
      symbol.style.color = "blueviolet";
      column.appendChild(symbol);
    }

    container.appendChild(column);

    column.addEventListener("animationend", () => {
      column.remove();
      createColumn();
    });
  }

  for (let i = 0; i < columnCount; i++) {
    createColumn();
  }

  // --- Код для эффекта печатания текста ---
  const textsAndTimes = {
    "ту ту ту ту ту ту": 3,
    "Время медленно шагает": 2,
    "и всего один раз в год": 2,
    "день рождения бывает": 1.5,
    "и его ребенок ждет": 2,

    "он мечтательно вздыхает": 2.5,
    "и тихонько напиваааееет": 3.5,
    "": 3,
    "с днем рождения ТЕБЯ": 2.5,
    "с днем рождения  ТЕБЯ": 1.5,
    "С ДНЕМ РОЖДЕНИЯ!": 1,
    "С ДНЕМ РОЖДЕНИЯ!!": 0.6,
    "С ДНЕМ РОЖДЕНИЯ!!!": 0.6,
    "ТЕБЯ<3": 1,

    "ту ту ту ту ту ту ту": 3,
  };
  const textArray = Object.entries(textsAndTimes);
  let currentTextArrayIndex = 0;
  let isTypingActive = false;
  let typingStarted = false; // Флаг для отслеживания начала печати

  function typeWriter(text, timeInSeconds, callback) {
    if (isTypingActive) return;
    isTypingActive = true;

    let charIndex = 0;
    let currentText = "";
    const speedMsPerChar = (timeInSeconds * 1000) / text.length;

    typingElement.textContent = ""; // Очищаем предыдущий текст перед печатью нового
    typingElement.style.borderRight = "3px solid #333"; // Устанавливаем курсор

    function type() {
      if (charIndex < text.length) {
        currentText += text.charAt(charIndex);
        typingElement.textContent = currentText;
        charIndex++;
        setTimeout(type, speedMsPerChar);
      } else {
        // Текст напечатан, вызываем callback (следующий текст или завершение)
        if (callback) {
          setTimeout(callback, 500); // Пауза перед следующим текстом
        } else {
          isTypingActive = false; // Если нет callback, значит это конец анимации
        }
      }
    }
    type();
  }

  function startNextTyping() {
    isTypingActive = false; // Сбрасываем флаг, позволяя следующей анимации начаться
    currentTextArrayIndex++; // Переходим к следующему тексту в массиве

    if (currentTextArrayIndex < textArray.length) {
      const [nextText, nextTime] = textArray[currentTextArrayIndex];
      // Печатаем следующий текст, передавая startNextTyping как callback для следующего шага
      typeWriter(nextText, nextTime, startNextTyping);
    } else {
      typingElement.style.borderRight = "none"; // Убираем курсор после завершения всех текстов
      console.log("Все тексты напечатаны!");
    }
  }

  // Функция для запуска печати текста
  function startTypingAnimation() {
    if (typingStarted) return; // Если печать уже началась, выходим
    
    typingStarted = true;
    typingElement.textContent = ""; // Очищаем "Loading..."
    currentTextArrayIndex = 0; // Сбрасываем индекс, чтобы начать с первого текста
    isTypingActive = false; // Сбрасываем флаг активности

    if (textArray.length > 0) {
      const [firstText, firstTime] = textArray[currentTextArrayIndex];
      typeWriter(firstText, firstTime, startNextTyping);
    }
  }

  // Функция для проверки времени видео
  function checkVideoTime() {
    if (videoElement && videoElement.currentTime >= 35 && !typingStarted) {
      startTypingAnimation();
      // Убираем обработчик после запуска печати
      videoElement.removeEventListener("timeupdate", checkVideoTime);
    }
  }
  // --- Конец кода для эффекта печатания текста ---

  startButtonHeart.addEventListener("click", function () {
    // Скрываем зеленый экран, сердце И текст-подсказку
    greenScreen.classList.add("hidden");
    container.classList.add("hidden");
    startButtonHeart.classList.add("hidden"); // Скрываем сердце
    clickPrompt.classList.add("hidden"); //Скрываем текст-подсказку
    clickPromptTitle.classList.add("hidden");

    const backgroundHTML = `
        <div class="area" >
            <ul class="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
    `;
    document.body.insertAdjacentHTML("afterbegin", backgroundHTML);

    // Добавляем изображения в круги
    const circles = document.querySelectorAll(".circles li");
    const images = [
      "images/Image2.jpg",
      "images/Image3.jpg",
      "images/Image4.jpg",
    ];

    circles.forEach((circle) => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      circle.style.backgroundImage = `url(${randomImage})`;
    });

    // Запускаем видео
    if (videoElement) {
      videoElement.play();
      
      // Добавляем обработчик для отслеживания времени видео
      videoElement.addEventListener("timeupdate", checkVideoTime);
    }
  });

  if (videoElement) {
    videoElement.addEventListener("ended", function () {
      videoElement.classList.add("hidden");

      if (cooldownCount < 1) {
        cooldownCount++;
        anim();
      }
    });
  }
});

let w = (c.width = window.innerWidth),
  h = (c.height = window.innerHeight),
  ctx = c.getContext("2d"),
  hw = w / 2;
(hh = h / 2),
  (opts = {
    // change the text in here //
    strings: ["С ДНЕМ", "РОЖДЕНИЯ", "ТЕБЯ!"],
    charSize: 30,
    charSpacing: 35,
    lineHeight: 40,

    cx: w / 2,
    cy: h / 2,

    fireworkPrevPoints: 10,
    fireworkBaseLineWidth: 5,
    fireworkAddedLineWidth: 8,
    fireworkSpawnTime: 200,
    fireworkBaseReachTime: 30,
    fireworkAddedReachTime: 30,
    fireworkCircleBaseSize: 20,
    fireworkCircleAddedSize: 10,
    fireworkCircleBaseTime: 30,
    fireworkCircleAddedTime: 30,
    fireworkCircleFadeBaseTime: 10,
    fireworkCircleFadeAddedTime: 5,
    fireworkBaseShards: 5,
    fireworkAddedShards: 5,
    fireworkShardPrevPoints: 3,
    fireworkShardBaseVel: 4,
    fireworkShardAddedVel: 2,
    fireworkShardBaseSize: 3,
    fireworkShardAddedSize: 3,
    gravity: 0.1,
    upFlow: -0.1,
    letterContemplatingWaitTime: 360,
    balloonSpawnTime: 20,
    balloonBaseInflateTime: 10,
    balloonAddedInflateTime: 10,
    balloonBaseSize: 20,
    balloonAddedSize: 20,
    balloonBaseVel: 0.4,
    balloonAddedVel: 0.4,
    balloonBaseRadian: -(Math.PI / 2 - 0.5),
    balloonAddedRadian: -1,
  }),
  (calc = {
    totalWidth:
      opts.charSpacing *
      Math.max(opts.strings[0].length, opts.strings[1].length),
  }),
  (Tau = Math.PI * 2),
  (TauQuarter = Tau / 4),
  (letters = []);

ctx.font = opts.charSize + "px Verdana";

function Letter(char, x, y) {
  this.char = char;
  this.x = x;
  this.y = y;

  this.dx = -ctx.measureText(char).width / 2;
  this.dy = +opts.charSize / 2;

  this.fireworkDy = this.y - hh;

  var hue = (x / calc.totalWidth) * 360;

  this.color = "hsl(hue,80%,50%)".replace("hue", hue);
  this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
  this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
  this.alphaColor = "hsla(hue,80%,50%,alp)".replace("hue", hue);

  this.reset();
}
Letter.prototype.reset = function () {
  this.phase = "firework";
  this.tick = 0;
  this.spawned = false;
  this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
  this.reachTime =
    (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) |
    0;
  this.lineWidth =
    opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
  this.prevPoints = [[0, hh, 0]];
};
Letter.prototype.step = function () {
  if (this.phase === "firework") {
    if (!this.spawned) {
      ++this.tick;
      if (this.tick >= this.spawningTime) {
        this.tick = 0;
        this.spawned = true;
      }
    } else {
      ++this.tick;

      var linearProportion = this.tick / this.reachTime,
        armonicProportion = Math.sin(linearProportion * TauQuarter),
        x = linearProportion * this.x,
        y = hh + armonicProportion * this.fireworkDy;

      if (this.prevPoints.length > opts.fireworkPrevPoints)
        this.prevPoints.shift();

      this.prevPoints.push([x, y, linearProportion * this.lineWidth]);

      var lineWidthProportion = 1 / (this.prevPoints.length - 1);

      for (var i = 1; i < this.prevPoints.length; ++i) {
        var point = this.prevPoints[i],
          point2 = this.prevPoints[i - 1];

        ctx.strokeStyle = this.alphaColor.replace(
          "alp",
          i / this.prevPoints.length
        );
        ctx.lineWidth = point[2] * lineWidthProportion * i;
        ctx.beginPath();
        ctx.moveTo(point[0], point[1]);
        ctx.lineTo(point2[0], point2[1]);
        ctx.stroke();
      }

      if (this.tick >= this.reachTime) {
        this.phase = "contemplate";

        this.circleFinalSize =
          opts.fireworkCircleBaseSize +
          opts.fireworkCircleAddedSize * Math.random();
        this.circleCompleteTime =
          (opts.fireworkCircleBaseTime +
            opts.fireworkCircleAddedTime * Math.random()) |
          0;
        this.circleCreating = true;
        this.circleFading = false;

        this.circleFadeTime =
          (opts.fireworkCircleFadeBaseTime +
            opts.fireworkCircleFadeAddedTime * Math.random()) |
          0;
        this.tick = 0;
        this.tick2 = 0;

        this.shards = [];

        var shardCount =
            (opts.fireworkBaseShards +
              opts.fireworkAddedShards * Math.random()) |
            0,
          angle = Tau / shardCount,
          cos = Math.cos(angle),
          sin = Math.sin(angle),
          x = 1,
          y = 0;

        for (var i = 0; i < shardCount; ++i) {
          var x1 = x;
          x = x * cos - y * sin;
          y = y * cos + x1 * sin;

          this.shards.push(new Shard(this.x, this.y, x, y, this.alphaColor));
        }
      }
    }
  } else if (this.phase === "contemplate") {
    ++this.tick;

    if (this.circleCreating) {
      ++this.tick2;
      var proportion = this.tick2 / this.circleCompleteTime,
        armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor
        .replace("light", 50 + 50 * proportion)
        .replace("alp", proportion);
      ctx.beginPath();
      ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
      ctx.fill();

      if (this.tick2 > this.circleCompleteTime) {
        this.tick2 = 0;
        this.circleCreating = false;
        this.circleFading = true;
      }
    } else if (this.circleFading) {
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      ++this.tick2;
      var proportion = this.tick2 / this.circleFadeTime,
        armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;

      ctx.beginPath();
      ctx.fillStyle = this.lightAlphaColor
        .replace("light", 100)
        .replace("alp", 1 - armonic);
      ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
      ctx.fill();

      if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
    } else {
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
    }

    for (var i = 0; i < this.shards.length; ++i) {
      this.shards[i].step();

      if (!this.shards[i].alive) {
        this.shards.splice(i, 1);
        --i;
      }
    }

    if (this.tick > opts.letterContemplatingWaitTime) {
      this.phase = "balloon";

      this.tick = 0;
      this.spawning = true;
      this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
      this.inflating = false;
      this.inflateTime =
        (opts.balloonBaseInflateTime +
          opts.balloonAddedInflateTime * Math.random()) |
        0;
      this.size =
        (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;

      var rad =
          opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(),
        vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();

      this.vx = Math.cos(rad) * vel;
      this.vy = Math.sin(rad) * vel;
    }
  } else if (this.phase === "balloon") {
    ctx.strokeStyle = this.lightColor.replace("light", 80);

    if (this.spawning) {
      ++this.tick;
      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      if (this.tick >= this.spawnTime) {
        this.tick = 0;
        this.spawning = false;
        this.inflating = true;
      }
    } else if (this.inflating) {
      ++this.tick;

      var proportion = this.tick / this.inflateTime,
        x = (this.cx = this.x),
        y = (this.cy = this.y - this.size * proportion);

      ctx.fillStyle = this.alphaColor.replace("alp", proportion);
      ctx.beginPath();
      generateBalloonPath(x, y, this.size * proportion);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, this.y);
      ctx.stroke();

      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);

      if (this.tick >= this.inflateTime) {
        this.tick = 0;
        this.inflating = false;
      }
    } else {
      this.cx += this.vx;
      this.cy += this.vy += opts.upFlow;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      generateBalloonPath(this.cx, this.cy, this.size);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.cx, this.cy);
      ctx.lineTo(this.cx, this.cy + this.size);
      ctx.stroke();

      ctx.fillStyle = this.lightColor.replace("light", 70);
      ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);

      if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw)
        this.phase = "done";
    }
  }
};
function Shard(x, y, vx, vy, color) {
  var vel =
    opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();

  this.vx = vx * vel;
  this.vy = vy * vel;

  this.x = x;
  this.y = y;

  this.prevPoints = [[x, y]];
  this.color = color;

  this.alive = true;

  this.size =
    opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
}
Shard.prototype.step = function () {
  this.x += this.vx;
  this.y += this.vy += opts.gravity;

  if (this.prevPoints.length > opts.fireworkShardPrevPoints)
    this.prevPoints.shift();

  this.prevPoints.push([this.x, this.y]);

  var lineWidthProportion = this.size / this.prevPoints.length;

  for (var k = 0; k < this.prevPoints.length - 1; ++k) {
    var point = this.prevPoints[k],
      point2 = this.prevPoints[k + 1];

    ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
    ctx.lineWidth = k * lineWidthProportion;
    ctx.beginPath();
    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(point2[0], point2[1]);
    ctx.stroke();
  }

  if (this.prevPoints[0][1] > hh) this.alive = false;
};
function generateBalloonPath(x, y, size) {
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(
    x - size / 2,
    y - size / 2,
    x - size / 4,
    y - size,
    x,
    y - size
  );
  ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
}

function anim() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);

  ctx.translate(hw, hh);

  let done = true;
  for (let l = 0; l < letters.length; ++l) {
    letters[l].step();
    if (letters[l].phase !== "done") {
      done = false;
    }
  }

  ctx.translate(-hw, -hh);

  if (done) {
    for (let l = 0; l < letters.length; ++l) {
      letters[l].reset();
    }
    showCongratulations();
    // Анимация завершена - ничего не делаем в текущем кадре
  } else {
    window.requestAnimationFrame(anim); // Продолжаем анимацию, если не завершена
  }
}


function showCongratulations() {
  // Создаем белый экран
  const congratulationsScreen = document.createElement("div");
  congratulationsScreen.style.position = "fixed";
  congratulationsScreen.style.top = "0";
  congratulationsScreen.style.left = "0";
  congratulationsScreen.style.width = "100%";
  congratulationsScreen.style.height = "100%";
  congratulationsScreen.style.backgroundColor = "white";
  congratulationsScreen.style.zIndex = "1000"; // Чтобы быть поверх всего

  // Создаем текст поздравления
  const congratulationsText = document.createElement("h1");
  congratulationsText.textContent =
    "Нажми на подарок и напиши (ПОДАРОК В СТУДИЮ!)"; // Ваш текст поздравления
  congratulationsText.style.position = "absolute";
  congratulationsText.style.top = "25%";
  congratulationsText.style.left = "50%";
  congratulationsText.style.transform = "translate(-50%, -50%)"; // Центрируем текст
  congratulationsText.style.width = "400px";
  congratulationsText.style.height = "175px";
  congratulationsText.style.textAlign = "center";
  congratulationsText.style.color = "black"; // Цвет текста

  // Создаем контейнер для изображения
  const imageContainer = document.createElement("div");
  imageContainer.style.position = "absolute";
  imageContainer.style.bottom = "50%";
  imageContainer.style.left = "50%";
  imageContainer.style.transform = "translateX(-50%)";

  // Создаем ссылку для перехода в Telegram
  const telegramLink = document.createElement("a");
  telegramLink.href = "https://t.me/michail_P7"; // Замените на ваш никнейм
  telegramLink.target = "_blank";
  telegramLink.style.display = "flex";
  telegramLink.style.filter = "drop-shadow(4px 5px 8px black)";
  telegramLink.style.textDecoration = "none";
  telegramLink.style.justifyContent = "center";
  telegramLink.style.justifyItems = "center";

  // Создаем само изображение
  const telegramImage = document.createElement("img");
  telegramImage.src = "images/Gift.png"; // Укажите путь к вашему изображению
  telegramImage.alt = "Перейти в Telegram";
  telegramImage.style.width = "100px"; // Размер изображения
  telegramImage.style.height = "100px";
  telegramImage.style.borderRadius = "8px";
  telegramImage.style.transition = "transform 0.3s";

  // Добавляем стили для эффекта при наведении
  telegramImage.onmouseover = function () {
    this.style.transform = "scale(1.2)";
  };
  telegramImage.onmouseout = function () {
    this.style.transform = "scale(1)";
  };

  // Собираем всё вместе
  telegramLink.appendChild(telegramImage);
  imageContainer.appendChild(telegramLink);
  congratulationsScreen.appendChild(congratulationsText);
  congratulationsScreen.appendChild(imageContainer);

  // Добавляем экран на страницу
  document.body.appendChild(congratulationsScreen);
}

for (let i = 0; i < opts.strings.length; ++i) {
  for (var j = 0; j < opts.strings[i].length; ++j) {
    letters.push(
      new Letter(
        opts.strings[i][j],
        j * opts.charSpacing +
          opts.charSpacing / 2 -
          (opts.strings[i].length * opts.charSize) / 2,
        i * opts.lineHeight +
          opts.lineHeight / 2 -
          (opts.strings.length * opts.lineHeight) / 2
      )
    );
  }
}

window.addEventListener("resize", function () {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;

  hw = w / 2;
  hh = h / 2;

  ctx.font = opts.charSize + "px Verdana";
});