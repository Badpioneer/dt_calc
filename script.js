// Получаем элементы DOM
const startTimeInput = document.getElementById('start-time');
const onTimeInput = document.getElementById('on-time');
const offTimeInput = document.getElementById('off-time');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const resultOnP = document.getElementById('result-on');
const resultOffP = document.getElementById('result-off');
const errorMessageP = document.getElementById('error-message');

// --- Функции ---

// Форматирует разницу времени в миллисекундах в строку "дни-часы-минуты-секунды"
function formatDuration(ms) {
  if (ms < 0) {
    ms = 0;
  }

  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  // ================== ИЗМЕНЕНИЕ ФОРМАТА ВЫВОДА ==================
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  // ============================================================
}

// Основная функция расчета
function calculateDurations() {
  // Очищаем предыдущие результаты и скрываем блок ошибки
  resultOnP.textContent = '';
  resultOffP.textContent = '';
  errorMessageP.textContent = '';
  errorMessageP.classList.remove('visible');

  // Получаем значения из полей ввода
  const startTimeValue = startTimeInput.value;
  const onTimeValue = onTimeInput.value;
  const offTimeValue = offTimeInput.value;

  // Проверка на заполненность полей
  if (!startTimeValue || !onTimeValue || !offTimeValue) {
    // Используем текст ошибки на английском
    errorMessageP.textContent = 'Error: Please fill in all date and time fields.';
    errorMessageP.classList.add('visible');
    return;
  }

  try {
    // Преобразуем строки в объекты Date
    const startDate = new Date(startTimeValue);
    const onDate = new Date(onTimeValue);
    const offDate = new Date(offTimeValue);

    // Проверка на валидность дат
    if (isNaN(startDate) || isNaN(onDate) || isNaN(offDate)) {
        errorMessageP.textContent = 'Error: Invalid date format detected.';
        errorMessageP.classList.add('visible');
        return;
    }

    // Рассчитываем разницу в миллисекундах
    const diffOnMs = onDate.getTime() - startDate.getTime();
    const diffOffMs = offDate.getTime() - startDate.getTime();

    // Проверка, что время включения/выключения не раньше времени старта
     if (diffOnMs < 0) {
        errorMessageP.textContent = 'Error: "Draw from" time cannot be earlier than "Activation time".';
        errorMessageP.classList.add('visible');
        return;
     }
     if (diffOffMs < 0) {
        errorMessageP.textContent = 'Error: "Draw before" time cannot be earlier than "Activation time".';
        errorMessageP.classList.add('visible');
        return;
     }

    // Проверка, что время выключения не раньше времени включения
    if (offDate.getTime() < onDate.getTime()){
        errorMessageP.textContent = 'Error: "Draw before" time cannot be earlier than "Draw from" time.';
        errorMessageP.classList.add('visible');
        return;
    }

    // Если все проверки пройдены, форматируем и выводим результаты
    const formattedDurationOn = formatDuration(diffOnMs);
    const formattedDurationOff = formatDuration(diffOffMs);

    // ================== ИЗМЕНЕНИЕ ПРЕФИКСОВ РЕЗУЛЬТАТА ==================
    resultOnP.textContent = `Min draw time: ${formattedDurationOn}`;
    resultOffP.textContent = `Max draw time: ${formattedDurationOff}`;
    // ===================================================================

  } catch (error) {
    console.error("Calculation error:", error);
    errorMessageP.textContent = 'An unexpected error occurred during calculation.';
    errorMessageP.classList.add('visible');
  }
}

// Функция сброса
function resetCalculator() {
  startTimeInput.value = '';
  onTimeInput.value = '';
  offTimeInput.value = '';
  resultOnP.textContent = '';
  resultOffP.textContent = '';
  errorMessageP.textContent = '';
  errorMessageP.classList.remove('visible');
}

// --- Добавляем слушатели событий ---
calculateBtn.addEventListener('click', calculateDurations);
resetBtn.addEventListener('click', resetCalculator);
