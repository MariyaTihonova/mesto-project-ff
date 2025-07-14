//Класс, который будет добавлять окну состояние «открыто»
const popupOpenedClass = 'popup_is-opened';


//Ф-я открытия модального окна
export function openModal(modalWindow) {
    modalWindow.classList.add(popupOpenedClass);
     //Закрытие по Esc
     document.addEventListener('keydown', handleEscClose);
   }

   //Ф-я закрытия модального окна
 export function closeModal(modalWindow) {
    modalWindow.classList.remove(popupOpenedClass);
     //Удаление обработчика событий
     document.removeEventListener('keydown', handleEscClose);
   }

//Обработчик нажатия клавиши Esc
 function handleEscClose(event) {
     if (event.key === 'Escape') {
       const openedPopup = document.querySelector(".popup_is-opened");
     if (openedPopup) {
       closeModal(openedPopup);
     }
   }
  }

//Закрытие по оверлей
export function closeOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.currentTarget);
  }
}