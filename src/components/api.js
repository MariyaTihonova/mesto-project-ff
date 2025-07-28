const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-42',
  headers: {
    authorization: 'f81b68a9-e064-468a-9e6e-9f668a7a60c1',
    'Content-Type': 'application/json',
  }
};

// Функция для обработки ответа
const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Получение данных пользователя
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers
  })
    .then(handleResponse);
};

// Получение начальных карточек
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers
  })
    .then(handleResponse);
};

// Обновление данных профиля
export const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({name,about})
  })
    .then(handleResponse);
};

// Добавление новой карточки
export const addCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({name,link})
  })
    .then(handleResponse);
};

// Удаление карточки
export const removeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
    })
    .then(handleResponse);
};

// Постановка лайка и снятие
export const toggleLike = (cardId,isLiked) => {
   const endpoint = `${config.baseUrl}/cards/likes/${cardId}`;
   const fetchOptions = {
    headers: config.headers,
    method: isLiked ? "DELETE" : "PUT",
   }
  return fetch(endpoint, fetchOptions)
    .then(handleResponse);
};

// Функция для обновления аватара на сервере
export function updateAvatar(formData) {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: {authorization: config.headers.authorization,},
    body: formData,
  })
    .then(handleResponse);
}