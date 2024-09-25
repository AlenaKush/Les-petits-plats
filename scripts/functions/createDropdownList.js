//получаем данные
export function getRecipeData(recipes, dataExtractor) {
    return recipes.reduce((data, recipe) => {
        const extractedData = dataExtractor(recipe);
        return data.concat(Array.isArray(extractedData) ? extractedData : [extractedData]);
    }, []);
}


//создаем лист
export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = [...new Set(items)];  // Преобразуем Set обратно в массив
    const ulElement = document.getElementById(listElementId);  // Ссылка на элемент списка

    ulElement.innerHTML = '';  // Очищаем список перед добавлением новых элементов

    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    // Универсальная функция для управления dropdown'ами
    setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId);
}


//управляем поведением
export function setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId) {
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
            }
        });
    });
}



// Вызываем универсальную функцию для всех кнопок
setupClearInput();

