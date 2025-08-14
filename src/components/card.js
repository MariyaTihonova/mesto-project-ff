import { toggleLike } from "./api"; 
 
const template = document.querySelector("#card-template").content; 
 
export function createCard(cardData, callbacks, usersId) { 
  const clonedTemplate = template.querySelector('.card').cloneNode(true);
  clonedTemplate.dataset.cardId = cardData._id;
 
  // Получаем вложенные элементы 
  const titleElement = clonedTemplate.querySelector(".card__title"); 
  const imageElement = clonedTemplate.querySelector(".card__image"); 
  const likeButton = clonedTemplate.querySelector('.card__like-button'); 
  const deleteButton = clonedTemplate.querySelector('.card__delete-button'); 
  const likeCounter = clonedTemplate.querySelector(".card__like-counter"); 
 
if (!cardData || !cardData.owner) { 
  console.error('cardData or owner is undefined:', cardData); 
  return; 
  } 
const ownerId = cardData.owner._id; // Присваиваем значение ownerId 
 
// Проверка, является ли текущий пользователь владельцем карточки 
if (ownerId !== usersId) { 
  deleteButton.style.display = 'none'; 
} else { 
// Добавляем обработчик клика на кнопку удаления 
  deleteButton.addEventListener("click", () => { 
  callbacks.deleteFunction(clonedTemplate); // Вызываем колбэк с элементом карточки 
  }); 
} 
   
const isLiked = cardData.likes.some(like => like._id === usersId); 
 
  // Устанавливаем значения 
  titleElement.textContent = cardData.name; 
  imageElement.alt = cardData.name; 
  imageElement.src = cardData.link; 
  likeCounter.textContent = cardData.likes.length || ""; 
 
  // Добавляем обработчик клика для кнопки лайка 
  likeButton.addEventListener('click', () => { 
    callbacks.likeFunction(likeButton, cardData._id, isLiked, likeCounter); 
  }); 
 
  imageElement.addEventListener('click', () =>  
    callbacks.onCardClickFunction(cardData)); 
  return clonedTemplate; 
} 
 
export function likeCard(likeButton, cardId, isLiked, likeCounter) { 
// Вызываем API на сервере 
  toggleLike(cardId, isLiked) 
    .then((updatedCard) => { 
      likeCounter.textContent = updatedCard.likes.length; 
      likeButton.classList.toggle("card__like-button_is-active"); 
    }) 
    .catch((error) => console.log(`Не удалось поставить лайк: ${error}`)); 
}
