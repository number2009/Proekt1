document.addEventListener("DOMContentLoaded", function () {
  const startButtonHeart = document.getElementById("startButtonHeart");
  const greenScreen = document.getElementById("greenScreen");
  const clickPrompt = document.getElementById("clickPrompt");
  const clickPromptTitle = document.getElementById("clickPromptTitle");
  const videoElement = document.querySelector(".video");
  const typingElement = document.querySelector(".titre");

  // --- Код для эффекта печатания текста ---
  const textsAndTimes = {
    "ту ту ту ту ту ту": 3,
    "Время медленно шагает": 2,
    "и всего один раз в год": 2,
    "день рождения бывает": 1.5,
    "и его ребенок ждет": 1.5,

    "он мечтательно вздыхает": 2,
    "и тихонько напиваааееет": 3.5,
    "": 2,
    "с днем рождения ТЕБЯ": 2,
    "с днем рождения  ТЕБЯ": 1.5,
    "С ДНЕМ РОЖДЕНИЯ!": 1,
    "С ДНЕМ РОЖДЕНИЯ!!": 0.6,
    "С ДНЕМ РОЖДЕНИЯ!!!": 0.6,
    "ТЕБЯ<=": 1,

    "ту ту ту ту ту ту ту": 2.5,
  };
  const textArray = Object.entries(textsAndTimes);
  let currentTextArrayIndex = 0;
  let isTypingActive = false;

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
  // --- Конец кода для эффекта печатания текста ---

  startButtonHeart.addEventListener("click", function () {
    // Скрываем зеленый экран, сердце И текст-подсказку
    greenScreen.classList.add("hidden");
    startButtonHeart.classList.add("hidden"); // Скрываем сердце
    clickPrompt.classList.add("hidden");    //Скрываем текст-подсказку
    clickPromptTitle.classList.add('hidden');

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
      "images/i.svg", // Замените на пути к вашим изображениям
      "images/i.svg",
      "images/i.svg",
      "images/i.svg",
    ];

    circles.forEach((circle) => {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      circle.style.backgroundImage = `url(${randomImage})`;
    });

    // Запускаем видео
    if (videoElement) {
      videoElement.play();
    }

    // --- ЗАПУСК ПЕЧАТАНИЯ ТЕКСТА ТОЛЬКО ПОСЛЕ НАЖАТИЯ КНОПКИ ---
    typingElement.textContent = ""; // Очищаем "Loading..."
    currentTextArrayIndex = 0;    // Сбрасываем индекс, чтобы начать с первого текста
    isTypingActive = false;       // Сбрасываем флаг активности

    if (textArray.length > 0) {
      const [firstText, firstTime] = textArray[currentTextArrayIndex];
      typeWriter(firstText, firstTime, startNextTyping);
    }
  });
});
