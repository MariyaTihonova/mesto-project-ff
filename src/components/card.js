const template = document.querySelector("#card-template").content;

export function deleteCard(cardElement) {
  cardElement.remove(); // Удаляет элемент карточки из DOM
};

export function likeCard(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

export function createCard(cardData, callbacks) {
  const clonedTemplate = template.querySelector('.card').cloneNode(true);

  // Получаем вложенные элементы
  const titleElement = clonedTemplate.querySelector(".card__title");
  const imageElement = clonedTemplate.querySelector(".card__image");
  const likeButton = clonedTemplate.querySelector('.card__like-button');
  const deleteButton = clonedTemplate.querySelector('.card__delete-button');

  // Устанавливаем значения
  titleElement.textContent = cardData.name;
  imageElement.alt = cardData.name;
  imageElement.src = cardData.link;

  // Добавляем обработчик клика на кнопку удаления
  deleteButton.addEventListener("click", () => {
    callbacks.deleteFunction(clonedTemplate); // Вызываем колбэк с элементом карточки
  });

  // Добавляем обработчик клика для кнопки лайка
  likeButton.addEventListener('click', () => {
    callbacks.likeFunction(likeButton);
  });

  imageElement.addEventListener('click', () => 
    callbacks.onCardClickFunction(cardData));
  return clonedTemplate;
}