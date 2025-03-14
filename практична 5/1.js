const apiUrl = "https://reqres.in/api/users";
const userListElement = document.getElementById("user-list");
const errorMessageElement = document.getElementById("error-message");
const loadButton = document.getElementById("load-data");
const loadCachedButton = document.getElementById("load-cached-data");

// Функція для виводу повідомлень у консоль браузера
function logToConsole(message) {
  console.log(message); // Виводимо повідомлення у вкладку "Консоль" браузера
}

// Функція для валідації структури отриманих даних
function validateUserData(users) {
  return users.every(user =>
    user.hasOwnProperty("first_name") &&
    user.hasOwnProperty("last_name")
  );
}

// Функція для завантаження даних з API
async function fetchUsers() {
  logToConsole("Запит даних з API...");
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP помилка: ${response.status}`);
    }

    const data = await response.json();

    // Перевірка структури JSON
    if (!data || !Array.isArray(data.data)) {
      throw new Error("Неправильна структура даних");
    }

    // Валідація даних
    if (!validateUserData(data.data)) {
      throw new Error("Дані користувачів не відповідають очікуванням");
    }

    // Відображення імен користувачів на сторінці
    userListElement.innerHTML = "";
    data.data.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.first_name} ${user.last_name}`;
      userListElement.appendChild(li);
    });

    // Збереження у localStorage та sessionStorage
    localStorage.setItem("users", JSON.stringify(data.data));
    sessionStorage.setItem("users", JSON.stringify(data.data));

    logToConsole("Дані успішно отримано та збережено.");
    errorMessageElement.textContent = ""; // Очистити повідомлення про помилку
  } catch (error) {
    logToConsole(`Помилка: ${error.message}`);
    errorMessageElement.textContent = `Помилка: ${error.message}`;
  }
}

// Функція для завантаження кешованих даних
function loadCachedUsers() {
  logToConsole("Спроба завантажити кешовані дані...");
  const cachedData = localStorage.getItem("users");

  if (!cachedData) {
    logToConsole("Немає кешованих даних.");
    errorMessageElement.textContent = "Немає кешованих даних";
    return;
  }

  try {
    const users = JSON.parse(cachedData);

    // Перевірка структури даних з кешу
    if (!validateUserData(users)) {
      throw new Error("Кешовані дані некоректні");
    }

    // Відображення імен користувачів на сторінці
    userListElement.innerHTML = "";
    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.first_name} ${user.last_name}`;
      userListElement.appendChild(li);
    });

    logToConsole("Кешовані дані успішно завантажено.");
    errorMessageElement.textContent = ""; // Очистити повідомлення про помилку
  } catch (error) {
    logToConsole(`Помилка при завантаженні кешу: ${error.message}`);
    errorMessageElement.textContent = `Помилка при завантаженні кешу: ${error.message}`;
  }
}

// Обробники подій для кнопок
loadButton.addEventListener("click", fetchUsers);
loadCachedButton.addEventListener("click", loadCachedUsers);