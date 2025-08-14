import './index.css'; // добавьте импорт главного файла стилей 
import { openModal, closeModal, closeOverlay } from './components/modal.js';
import { enableValidation, clearValidation } from './components/validation.js';
import { createCard, likeCard } from './components/card.js';
import { getUserInfo, getInitialCards, updateUserInfo, addCard, removeCard, updateAvatar } from './components/api.js';

// Конфиг валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// DOM элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileAvatar = document.querySelector('.profile__image');
const placesList = document.querySelector('.places__list');

// Попапы
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar');
const popupConfirm = document.querySelector('.popup_type_confirm');

// Формы
const formEditProfile = popupEditProfile.querySelector('.popup__form');
const formAddCard = popupAddCard.querySelector('.popup__form');
const formEditAvatar = popupEditAvatar.querySelector('.popup__form');

// Элементы профиля
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const closeButtons = document.querySelectorAll('.popup__close');

// Переменные для хранения данных
let userId;
let cardToDelete;

// Включение валидации
enableValidation(validationConfig);

// Функция загрузки начальных данных
function loadInitialData() {
  return Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      userId = userData._id;
      updateProfileInfo(userData);
      renderCards(cards, userId);
    })
    .catch(err => console.log(err));
}

// Функция обновления информации профиля
function updateProfileInfo(userData) {
  profileTitle.textContent = userData.name;
  profileDescription.textContent = userData.about;
  profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
}

// Функция рендеринга карточек
function renderCards(cards, userId) {
  cards.forEach(cardData => {
    const card = createCard(cardData, {
      deleteFunction: handleDeleteCard,
      likeFunction: handleLikeCard,
      onCardClickFunction: handleCardClick
    }, userId);
    placesList.append(card);
  });
}

// Обработчики событий
function handleEditProfileClick() {
  formEditProfile.elements.name.value = profileTitle.textContent;
  formEditProfile.elements.description.value = profileDescription.textContent;
  clearValidation(formEditProfile, validationConfig);
  openModal(popupEditProfile);
}

function handleAddCardClick() {
  formAddCard.reset();
  clearValidation(formAddCard, validationConfig);
  openModal(popupAddCard);
}

function handleEditAvatarClick() {
  formEditAvatar.reset();
  clearValidation(formEditAvatar, validationConfig);
  openModal(popupEditAvatar);
}

function handleCardClick(cardData) {
  const popupImageElement = popupImage.querySelector('.popup__image');
  const popupCaptionElement = popupImage.querySelector('.popup__caption');
  
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaptionElement.textContent = cardData.name;
  
  openModal(popupImage);
}

function handleDeleteCard(cardElement) {
  cardToDelete = cardElement;
  openModal(popupConfirm);
}

function handleLikeCard(likeButton, cardId, isLiked, likeCounter) {
  likeCard(likeButton, cardId, isLiked, likeCounter);
}

// Обработчики отправки форм
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Сохранение...';
  
  updateUserInfo(
    formEditProfile.elements.name.value,
    formEditProfile.elements.description.value
  )
    .then(userData => {
      updateProfileInfo(userData);
      closeModal(popupEditProfile);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Сохранение...';
  
  addCard(
    formAddCard.elements['place-name'].value,
    formAddCard.elements.link.value
  )
    .then(cardData => {
      const card = createCard(cardData, {
        deleteFunction: handleDeleteCard,
        likeFunction: handleLikeCard,
        onCardClickFunction: handleCardClick
      }, userId);
      placesList.prepend(card);
      closeModal(popupAddCard);
      formAddCard.reset();
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleEditAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const originalText = submitButton.textContent;
  
  submitButton.textContent = 'Сохранение...';
  
  updateAvatar(formEditAvatar.elements.avatar.value)
    .then(userData => {
      profileAvatar.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(popupEditAvatar);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
}

function handleConfirmSubmit(evt) {
  evt.preventDefault();
  if (!cardToDelete) return;

  const cardId = cardToDelete.dataset.cardId;
  
  removeCard(cardId)
    .then(() => {
      cardToDelete.remove();
      closeModal(popupConfirm);
    })
    .catch(err => console.log("Ошибка удаления:", err))
    .finally(() => {
      cardToDelete = null; // сброс только после завершения
    })
}

closeButtons.forEach(button => { 
  button.addEventListener('click', function() { 
    const popup = this.closest('.popup'); 
    closeModal(popup); 
  })
})

// Навешивание обработчиков событий
profileEditButton.addEventListener('click', handleEditProfileClick);
profileAddButton.addEventListener('click', handleAddCardClick);
profileAvatar.addEventListener('click', handleEditAvatarClick);

formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formAddCard.addEventListener('submit', handleAddCardSubmit);
formEditAvatar.addEventListener('submit', handleEditAvatarSubmit);
popupConfirm.querySelector('.popup__form').addEventListener('submit', handleConfirmSubmit);

// Закрытие попапов по клику на оверлей
popupEditProfile.addEventListener('click', closeOverlay);
popupAddCard.addEventListener('click', closeOverlay);
popupImage.addEventListener('click', closeOverlay);
popupEditAvatar.addEventListener('click', closeOverlay);
popupConfirm.addEventListener('click', closeOverlay);

// Загрузка начальных данных
loadInitialData();