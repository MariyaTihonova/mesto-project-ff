import './index.css'; // добавьте импорт главного файла стилей
import { initialCards } from './scripts/cards.js'; // импорт картинок
import { openModal, closeModal, closeOverlay } from './components/modal.js'; // импорт модалок
import { likeCard, createCard } from './components/card.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, removeCard, updateAvatar } from './components/api.js'
import { enableValidation, clearValidation } from './components/validation.js';

// Контейнер с карточками
const placesList = document.querySelector('.places__list');
// Редактирование профиля
const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const jobInput = formEditProfile.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
// Назначение
const formNewPlace = document.forms["new-place"];
const cardNameInput = formNewPlace.querySelector('.popup__input_type_card-name');
const urlInput = formNewPlace.querySelector('.popup__input_type_url');
const imagePopup =   document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');

const addButton =  document.querySelector('.profile__add-button'); // Кнопка доб-ия карточек
const addPopup =   document.querySelector('.popup_type_new-card'); // Доб-ие карточки

const editButton =  document.querySelector('.profile__edit-button'); // Ред-ие профиля
const popUps = document.querySelectorAll(".popup"); // Попапы
const editPopup =   document.querySelector('.popup_type_edit'); // Ред-ие
const confirmPopup = document.querySelector(".popup_type_confirm");
const confirmButton = confirmPopup.querySelector(".popup_button");
const closeButtons = document.querySelectorAll('.popup__close');
const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarInput = document.querySelector('#avatar-input');
const profileAvatar = document.querySelector('.profile__image'); // Элемент, отображающий аватар
const formEditAvatar = avatarPopup.querySelector('.popup__form');

let userId;
let cardIdForDeletion = null;
let selectedCardElement = null;

function openCardPopup({link, name}) {
  popupCaption.textContent = name;
  popupImage.alt = name;
  popupImage.src = link;
  openModal(imagePopup);
}

const cardCallbacks = {
  deleteFunction: deleteCard,
  likeFunction: likeCard,
  onCardClickFunction: openCardPopup,
}

// Обработчик для добавления нового места
function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault();
  const name = cardNameInput.value;
  const link = urlInput.value;
  const submitButton = evt.target.querySelector(".popup__button"); // Блокируем кнопку

    setLoadingState(submitButton, true, "Сохранение...");

  // Отправляем данные
  addCard(name, link)
    .then((cardData) => {
      const cardElement = createCard(cardData, cardCallbacks, userId); // Передаем userId 
      placesList.prepend(cardElement); // Используем placesList для подстановки карточки
      formNewPlace.reset(); // Использование formNewPlace для сброса формы
      closeModal(addPopup); // Закрытие попапа добавления карточек
    })
    .catch((err) => {
      console.error("Ошибка при добавлении карточки:", err);
    })
    .finally(() => {
      setLoadingState(submitButton, false);
    });
}

// Обработчик для редактирования профиля
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const name = nameInput.value; // Используем переменную nameInput
  const about = jobInput.value; // Используем переменную jobInput
  const submitButton = evt.target.querySelector(".popup__button"); // Блокируем кнопку
  const originalText = submitButton.textContent;
  setLoadingState(submitButton, true, "Сохранение...");

  updateUserInfo(name, about)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editPopup);
    })
    .catch((err) => {
      console.error("Ошибка при обновлении профиля:", err);
    })
    .finally(() => {
      setLoadingState(submitButton, false, originalText);
    });
}

function setLoadingState(button, isLoading, text = "Сохранить") {
  button.textContent = isLoading ? text : "Сохранить";
  button.disabled = isLoading;
}

// Слушатели событий
editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig)
  openModal(editPopup);
})

addButton.addEventListener("click", () => {
  formNewPlace.reset();
  clearValidation(formNewPlace, validationConfig)
  openModal(addPopup);
})

// Предотвращение отправки формы при нажатии Esc в попапах
popUps.forEach((popup) => {
  const closeCross = popup.querySelector(".popup_close");
    if (closeCross) {
    closeCross.addEventListener("click", () => {
    closeModal(popup);
    });
  }
  popup.addEventListener("click", closeOverlay);
  // Добавляем модификатор popup_is-animated модальному окну
  popup.classList.add("popup_is-animated");
})

// Подключение формы к обработчикам
formNewPlace.addEventListener("submit", handleNewPlaceFormSubmit);
formEditProfile.addEventListener("submit", handleEditFormSubmit);

// Показать все карточки
initialCards.forEach((cardData) => {
  const card = createCard(cardData, cardCallbacks); // Передаём removeCard в качестве колбека
  placesList.appendChild(card);
})

closeButtons.forEach(button => {
  button.addEventListener('click', function() {
    const popup = this.closest('.popup');
    closeModal(popup);
  });
});

// Включение валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

enableValidation(validationConfig);

// Функции отрисовки карточек
function renderCards(cardsData) {
  cardsData.forEach((cardData) => {
    const card = createCard(cardData, cardCallbacks);
    placesList.appendChild(card);
  })
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    if (userData.avatar) {
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
    } else {
    profileAvatar.style.backgroundImage = '';
    }
    renderCards(cards);
  })
  .catch((err) => {
    console.error("Ошибка обновления:", err);
  });

// Ф-ия для удаления карточки
function deleteCard (cardElement, cardId) {
  cardIdForDeletion = cardId;
  selectedCardElement = cardElement;
  openModal(confirmPopup);
}

const handleConfirm = (evt) => {
  evt.preventDefault();
  // Блокируем кнопку подтверждения
  const confirmButton = confirmPopup.querySelector(".popup__button"); // Найдите кнопку внутри попапа
  setLoadingState(confirmButton, true, "Удаление...");
  // Отправляем запрос на сервер для удаления карточки
  removeCard(cardIdForDeletion)
    .then(() => {
  // Удаляем карточку из DOM
    selectedCardElement.remove();
    closeModal(confirmPopup); // Закрываем попап подтверждения
    })
    .catch((error) => {
      console.error(`Ошибка при удалении карточки: ${error}`);
    })
    .finally(() => {
      // Восстанавливаем текст и состояние кнопки
       setLoadingState(confirmButton, false, "Да");
    });
};

confirmPopup.addEventListener("submit", handleConfirm);

// Функция для открытия попапа редактирования аватара
function openAvatarPopup() {
  openModal(avatarPopup);
}

// Слушатель для кнопки редактирования аватара
document.querySelector('.profile__edit-avatar-button').addEventListener('click', openAvatarPopup);

// Обработчик формы редактирования аватара
formEditAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const file = avatarInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('avatar', file); // Добавляем файл в FormData

// Вызываем функцию обновления аватара
updateAvatar(formData)
  .then((data) => {
// Обновляем аватар в интерфейсе, если сервер возвращает обновленный объект пользователя
    profileAvatar.style.backgroundImage = `url('${data.avatar}')`; // Обновляем отображение аватара
    closeModal(avatarPopup); // Закрываем попап после обновления
    })
  .catch((error) => {
    console.error('Ошибка при обновлении аватара:', error);
    });
  } else {
    console.error('Не выбран файл для загрузки.');
  }
});
