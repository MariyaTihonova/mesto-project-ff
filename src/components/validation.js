// Функция для отображения ошибки
const showError = (formElement, inputElement, errorMessage, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationConfig.errorClass);
}

// Функция для очистки ошибок
const hideError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
  errorElement.textContent = "";
}

const validateForm = (formElement, validationConfig) => {
  const nameInput = formElement.querySelector('.popup__input_type_name');
  const jobInput = formElement.querySelector('.popup__input_type_description');

 // Регулярные выражения для валидации
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\- ]{2,40}$/;
  const jobRegex = /^[a-zA-Zа-яА-ЯёЁ0-9\- ]{2,200}$/;

  // Проверка поля "Имя"
  if (!nameRegex.test(nameInput.value)) {
    showError(formElement, nameInput, "Имя должно быть от 2 до 40 символов и содержать только латинские, кириллические буквы, знаки дефиса и пробелы", validationConfig);
  } else {
    hideError(formElement, nameInput, validationConfig);
  }

  // Проверка поля "О себе"
  if (!jobRegex.test(jobInput.value)) {
    showError(formElement, jobInput, "О себе должно быть от 2 до 200 символов и содержать только латинские, кириллические буквы, знаки дефиса и пробелы", validationConfig);
  } else {
    hideError(formElement, jobInput, validationConfig);
  }

  // Управление активностью кнопки "Сохранить"
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  toggleButtonState(formElement, validationConfig, buttonElement);
};

const toggleButtonState = (formElement, validationConfig, buttonElement) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const isInvalid = hasInvalidInput(inputList);

  buttonElement.disabled = isInvalid;
  if (isInvalid) {
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
      buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      validateForm(formElement, inputElement, validationConfig);
    });
  });
  toggleButtonState(formElement, validationConfig, buttonElement);
};

export const enableValidation = (formElement, validationConfig) => {
  const formList = Array.from(formElement.querySelectorAll(validationConfig.formSelector));
// Проходим по каждой форме и устанавливаем обработчики событий
  formList.forEach((currentFormElement) => {
    setEventListeners(currentFormElement, validationConfig);
  });
};

export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  
    inputList.forEach((inputElement) => {
      hideError(formElement, inputElement, validationConfig);
        inputElement.setCustomValidity(""); 
  });

    const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
    if (buttonElement) {
      buttonElement.disabled = true;
      buttonElement.classList.add(validationConfig.inactiveButtonClass);
    }
};