
const template = document.querySelector('#card-template').content;

function removeCard(cardElement) {
  cardElement.remove(); // Удаляет элемент карточки из DOM
}

function createCard(cardData, onDelete) {
  const clonedTemplate = template.querySelector('.card').cloneNode(true);

  // Получаем вложенные элементы
  const titleElement = clonedTemplate.querySelector(".card__title");
  const imageElement = clonedTemplate.querySelector(".card__image");

  // Устанавливаем значения
  titleElement.textContent = cardData.name;
  imageElement.alt = cardData.name;
  imageElement.src = cardData.link;

  // Добавляем обработчик клика на карточку
  const deleteIcon = clonedTemplate.querySelector(".card__delete-button");
  deleteIcon.addEventListener("click", () => {
    onDelete(clonedTemplate); // Вызываем колбэк с элементом карточки
  });

  return clonedTemplate;
}

// Перебор карточек
const placesList = document.querySelector(".places__list");

initialCards.forEach((cardData) => {
  const card = createCard(cardData, removeCard); // Передаём removeCard в качестве колбека
  placesList.appendChild(card);
});

