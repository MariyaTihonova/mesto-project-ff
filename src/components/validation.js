// Функция для отображения ошибки 
function showInputError(formElement, inputElement, errorMessage, validationConfig) { 
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); 
  inputElement.classList.add(validationConfig.inputErrorClass); 
  errorElement.textContent = errorMessage; 
  errorElement.classList.add(validationConfig.errorClass); 
}

// Функция для очистки ошибок 
function hideInputError(formElement, inputElement, validationConfig) { 
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`); 
  inputElement.classList.remove(validationConfig.inputErrorClass); 
  errorElement.classList.remove(validationConfig.errorClass); 
  errorElement.textContent = ""; 
}

// Проверка наличия невалидного поля
function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

// Функция для управления состоянием кнопки
const disableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
}

const enableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
}

// Переключение состояния кнопки
function toggleButtonState(inputList, buttonElement, validationConfig) {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton
  } else {
    enableSubmitButton
  }
}

//Проверяем валидность поля
const isValid = (formElement, inputElement, validationConfig) => {
  if(inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
     showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
  } else {
     hideInputError(formElement, inputElement, validationConfig);
  }
}

// Установка обработчиков событий
function setEventListeners(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  // Проверка, что элементы существуют
  if (!inputList.length || !buttonElement) return;  // Если нет полей или кнопки

  toggleButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      isValid(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    })
  })
}

// Включение валидации всех форм
export function enableValidation(validationConfig) {
  const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig);
  })
}

// Очистка ошибок валидации
export function clearValidation(formElement, validationConfig) {
  const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, validationConfig);
    inputElement.setCustomValidity("");
  })

  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  disableSubmitButton(buttonElement, validationConfig);
}