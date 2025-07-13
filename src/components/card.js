const template = document.querySelector('#card-template').content;

export function deleteCard(cardElement) {
  cardElement.remove(); // Удаляет элемент карточки из DOM
};

export function likeCard(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

export function createCard(cardData, onDelete, deleteFunction, likeFunction) {
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
    onDelete(clonedTemplate); // Вызываем колбэк с элементом карточки
    deleteFunction(clonedTemplate);
  });

  // Добавляем обработчик клика для кнопки лайка
  likeButton.addEventListener('click', () => {
    likeFunction(likeButton);
  });

  return clonedTemplate;
}