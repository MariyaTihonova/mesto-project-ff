import './index.css'; // добавьте импорт главного файла стилей
import { initialCards } from './scripts/cards.js'; // импорт картинок
import { openModal, closeModal, closeOverlay } from './components/modal.js'; // импорт модалок
import { deleteCard, likeCard, createCard } from './components/card.js';

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
// Контейнер с карточками
const placesList = document.querySelector('.places__list');

const addButton =  document.querySelector('.profile__add-button'); // Кнопка доб-ия карточек
const addPopup =   document.querySelector('.popup_type_new-card'); // Доб-ие карточки

const editButton =  document.querySelector('.profile__edit-button'); // Ред-ие профиля
const popUps = document.querySelectorAll(".popup"); // Попапы
const editPopup =   document.querySelector('.popup_type_edit'); // Ред-ие


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

function handleNewPlaceFormSubmit(evt) {
  evt.preventDefault();
  const name = cardNameInput.value;
  const link = urlInput.value;

  const cardElement = createCard({name, link}, cardCallbacks);
  placesList.prepend(cardElement);
  closeModal(addPopup);
}

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(editPopup);
}

editButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(editPopup);
})

addButton.addEventListener("click", () => {
  formNewPlace.reset();
  openModal(addPopup);
})

popUps.forEach((popup) => {
  const closeCross = popup.querySelector(".popup_close");
  closeCross.addEventListener("click", () => {
    closeModal(popup);
  })
  popup.addEventListener("click", closeOverlay);
// Добавляем модификатор popup_is-animated модальному окну 
  popup.classList.add("popup_is-animated");
})

formNewPlace.addEventListener("submit", handleNewPlaceFormSubmit);

formEditProfile.addEventListener("submit", handleEditFormSubmit);

// показать все карточки
initialCards.forEach((cardData) => {
  const card = createCard(cardData, cardCallbacks); // Передаём removeCard в качестве колбека
  placesList.appendChild(card);
});