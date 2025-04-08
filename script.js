// Получаем элементы DOM
const startTimeInput = document.getElementById('start-time');
const onTimeInput = document.getElementById('on-time');
const offTimeInput = document.getElementById('off-time');
const calculateBtn = document.getElementById('calculate-btn');
const resetBtn = document.getElementById('reset-btn');
const resultOnP = document.getElementById('result-on');
const resultOffP = document.getElementById('result-off');
const errorMessageP = document.getElementById('error-message'); // Параграф для ошибок

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

    return `${days} дней ${hours} часов ${minutes} минут ${seconds} секунд`;
}

// Основная функция расчета
function calculateDurations() {
    // Очищаем предыдущие результаты и скрываем блок ошибки
    resultOnP.textContent = '';
    resultOffP.textContent = '';
    errorMessageP.textContent = ''; // Очищаем текст ошибки
    errorMessageP.classList.remove('visible'); // Скрываем блок ошибки

    // Получаем значения из полей ввода
    const startTimeValue = startTimeInput.value;
    const onTimeValue = onTimeInput.value;
    const offTimeValue = offTimeInput.value;

    // Проверка на заполненность полей
    if (!startTimeValue || !onTimeValue || !offTimeValue) {
        errorMessageP.textContent = 'Ошибка: Пожалуйста, заполните все поля дат и времени.';
        errorMessageP.classList.add('visible'); // Показываем блок ошибки
        return;
    }

    try {
        // Преобразуем строки в объекты Date
        const startDate = new Date(startTimeValue);
        const onDate = new Date(onTimeValue);
        const offDate = new Date(offTimeValue);

        // Проверка на валидность дат
        if (isNaN(startDate) || isNaN(onDate) || isNaN(offDate)) {
            errorMessageP.textContent = 'Ошибка: Неверный формат одной или нескольких дат.';
            errorMessageP.classList.add('visible'); // Показываем блок ошибки
            return;
        }

        // Рассчитываем разницу в миллисекундах
        const diffOnMs = onDate.getTime() - startDate.getTime();
        const diffOffMs = offDate.getTime() - startDate.getTime();

        // Проверка, что время включения/выключения не раньше времени старта
        if (diffOnMs < 0) {
            errorMessageP.textContent = 'Ошибка: Время включения не может быть раньше времени запуска.';
            errorMessageP.classList.add('visible'); // Показываем блок ошибки
            // Очищаем потенциально неправильные результаты, если нужно
            // resultOnP.textContent = '';
            // resultOffP.textContent = '';
            return;
        }
        if (diffOffMs < 0) {
            errorMessageP.textContent = 'Ошибка: Время выключения не может быть раньше времени запуска.';
            errorMessageP.classList.add('visible'); // Показываем блок ошибки
            // resultOnP.textContent = ''; // Можно оставить результат до включения, если он корректен
            // resultOffP.textContent = '';
            return;
        }
        // Дополнительно: проверка, что выключение не раньше включения (опционально)
        if (offDate.getTime() < onDate.getTime()){
            console.warn("Предупреждение: Время выключения раньше времени включения.");
            // Можно вывести это как предупреждение в консоль или даже в блок ошибки,
            // добавив к существующему тексту или заменив его.
            // errorMessageP.textContent += ' Предупреждение: Время выключения раньше времени включения.';
            // errorMessageP.classList.add('visible');
        }

        // Форматируем и выводим результаты
        resultOnP.textContent = `Время до включения: ${formatDuration(diffOnMs)}`;
        resultOffP.textContent = `Время до выключения: ${formatDuration(diffOffMs)}`;

    } catch (error) {
        console.error("Произошла ошибка при расчете:", error);
        errorMessageP.textContent = 'Произошла непредвиденная ошибка при расчете.';
        errorMessageP.classList.add('visible'); // Показываем блок ошибки
    }
}

// Функция сброса
function resetCalculator() {
    startTimeInput.value = '';
    onTimeInput.value = '';
    offTimeInput.value = '';
    resultOnP.textContent = '';
    resultOffP.textContent = '';
    errorMessageP.textContent = ''; // Очищаем текст ошибки
    errorMessageP.classList.remove('visible'); // Скрываем блок ошибки
}

// --- Добавляем слушатели событий ---
calculateBtn.addEventListener('click', calculateDurations);
resetBtn.addEventListener('click', resetCalculator);