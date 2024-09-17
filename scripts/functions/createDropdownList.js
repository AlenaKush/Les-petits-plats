export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = new Set(items);  // Создаем уникальный набор элементов
    const ulElement = document.getElementById(listElementId);  // Ссылка на элемент списка

    // Очищаем список перед добавлением новых элементов
    ulElement.innerHTML = '';

    // Добавляем элементы в список
    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    // Универсальная функция для управления dropdown'ами
    setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId);
}

function setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId) {
    const dropdownBtn = document.getElementById(dropdownBtnId);
    const dropdownElement = document.getElementById(dropdownElementId);
    const arrowIcon = document.getElementById(arrowIconId);

    // Управляем видимостью выпадающего списка по клику на кнопку
    dropdownBtn.addEventListener('click', function (event) {
        event.stopPropagation();  // Предотвращаем закрытие при клике на кнопку
        
        if (dropdownElement.style.display === 'none' || dropdownElement.style.display === '') {
            dropdownElement.style.display = 'block';
            arrowIcon.classList.remove('rotate');
        } else {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });

    // Скрываем дропдаун при клике вне его области
    document.addEventListener('click', function (event) {
        if (!dropdownElement.contains(event.target) && event.target !== dropdownBtn) {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });
}

// Универсальная функция для очистки полей ввода и сброса списка элементов
function setupClearInput() {
    const clearIcons = document.querySelectorAll('.clear-input');  // Находим все иконки очистки

    clearIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const inputId = event.target.getAttribute('data-target');
            const inputElement = document.getElementById(inputId);
            const dropdownId = inputElement.parentElement.querySelector('ul').id;

            if (inputElement) {
                // Очищаем поле ввода
                inputElement.value = '';

                // Показываем все элементы списка
                const listItems = document.querySelectorAll(`#${dropdownId} li`);
                listItems.forEach(item => {
                    item.style.display = '';  // Показываем все элементы
                });

                // Если нужно сбросить результаты сортировки или фильтрации
                /* displayResults(currentDisplayedRecipes); */
            }
        });
    });
}



/* 16/09 21-57 import { displayResults, currentDisplayedRecipes } from "./displayResults.js";

export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = new Set(items);  // Создаем уникальный набор элементов
    const ulElement = document.getElementById(listElementId);  // Ссылка на элемент списка

    // Очищаем список перед добавлением новых элементов
    ulElement.innerHTML = '';

    // Добавляем элементы в список
    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    // Управление видимостью выпадающего меню по клику на кнопку
    const dropdownBtn = document.getElementById(dropdownBtnId);
    const dropdownElement = document.getElementById(dropdownElementId);
    const arrowIcon = document.getElementById(arrowIconId);

    // Проверяем текущее состояние и переключаем видимость при клике
    dropdownBtn.addEventListener('click', function(event) {
        // Предотвращаем закрытие дропдауна при клике на него
        event.stopPropagation();
        
        if (dropdownElement.style.display === 'none' || dropdownElement.style.display === '') {
            dropdownElement.style.display = 'block';
            arrowIcon.classList.remove('rotate');
        } else {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });

    // Скрываем дропдаун при клике вне его области
    document.addEventListener('click', function(event) {
        const target = event.target;

        // Проверяем, был ли клик внутри дропдауна или на кнопке
        if (!dropdownElement.contains(target) && target !== dropdownBtn) {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });

    // Предотвращаем скрытие дропдауна при клике на элементы <li>
    ulElement.addEventListener('click', function(event) {
        event.stopPropagation(); // Предотвращаем всплытие клика к document
    });
}

// Универсальная функция для очистки полей ввода и сброса списка элементов
function setupClearInput() {
    const clearIcons = document.querySelectorAll('.clear-input'); // Находим все иконки очистки

    clearIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const inputId = event.target.getAttribute('data-target');
            const inputElement = document.getElementById(inputId);
            const dropdownId = inputElement.parentElement.querySelector('ul').id;

            if (inputElement) {
                // Очищаем поле ввода
                inputElement.value = '';

                // Показываем все элементы списка (восстанавливаем видимость)
                const listItems = document.querySelectorAll(`#${dropdownId} li`);
                listItems.forEach(item => {
                    item.style.display = ''; // Показываем все элементы
                });

                // Дополнительно можно сбросить сортировку рецептов, если это требуется
            }
        });
    });
}
*/
// Вызываем универсальную функцию для всех кнопок
setupClearInput();


/*// Универсальная функция для создания выпадающих списков
export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = new Set(items);  // Создаем уникальный набор элементов
    const ulElement = document.getElementById(listElementId);  // Ссылка на элемент списка

    // Очищаем список перед добавлением новых элементов
    ulElement.innerHTML = '';

    // Добавляем элементы в список
    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    // Управление видимостью выпадающего меню по клику на кнопку
    const dropdownBtn = document.getElementById(dropdownBtnId);
    const dropdownElement = document.getElementById(dropdownElementId);
    const arrowIcon = document.getElementById(arrowIconId);


    // Проверяем текущее состояние и переключаем видимость при клике
    dropdownBtn.addEventListener('click', function() {
        if (dropdownElement.style.display === 'none') {
            dropdownElement.style.display = 'block';
            arrowIcon.classList.remove('rotate'); 
        } else {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });
}*/