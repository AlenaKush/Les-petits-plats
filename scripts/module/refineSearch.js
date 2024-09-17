import { currentDisplayedRecipes, updateNumberOfRecipes } from "../functions/displayResults.js";
import { recipeCardElementDOM } from "../functions/recipeCardElementDOM.js";

function setupSearchInput(inputId, listId, clearInputId) {
    const searchInput = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const listItems = list.querySelectorAll('li');
    const clearInput = document.getElementById(clearInputId);

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();

        if (query.length > 0) {
            clearInput.style.display = 'block';
            if (query.length >= 3) {
                listItems.forEach(item => {
                    const itemText = item.textContent.toLowerCase();
                    item.style.display = itemText.includes(query) ? '' : 'none';
                });
            } else {
                listItems.forEach(item => {
                    item.style.display = '';
                });
            }
        } else {
            clearInput.style.display = 'none';
            listItems.forEach(item => {
                item.style.display = '';
            });
        }
    });
}

// Инициализация для ингредиентов
setupSearchInput('ingredient-search', 'ingredients-list', 'clear-ingredient');

// Инициализация для приборов
setupSearchInput('appliance-search', 'appliance-list', 'clear-appliance');

// Инициализация для утвари
setupSearchInput('ustensils-search', 'ustensils-list', 'clear-ustensils');


function setupListClickListener(listId, selectedItemId, dropdownId, filterFunction, buttonId) {
    const listElement = document.getElementById(listId);

    listElement.addEventListener('click', function(event) {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'LI') {
            const selectedItem = clickedElement.textContent.toLowerCase();
            
            // Фильтрация рецептов через переданную функцию
            const filteredRecipes = filterRecipesByQuery(selectedItem, currentDisplayedRecipes, filterFunction);
            displayResults(filteredRecipes, 'recipes_section', recipeCardElementDOM, updateNumberOfRecipes);

            // Отображение выбранного элемента
            const selectedDisplay = document.getElementById(selectedItemId);
            selectedDisplay.textContent = selectedItem;

            // Показ контейнера с выбранным элементом
            const container = document.querySelector(`.selected_item[data-target="${buttonId}"]`);
            container.style.display = 'flex';

            // Скрытие дропдауна
            const dropdown = document.getElementById(dropdownId);
            dropdown.style.display = 'none';
        }
    });
}

// Настройка слушателей для списка ингредиентов
setupListClickListener('ingredients-list', 'selected_ingredient', 'ingredients-dropdown', 'ingredients', 'ingredients-btn');

// Настройка слушателей для списка приборов
setupListClickListener('appliance-list', 'selected_appliance', 'appliance-dropdown', 'appliance', 'appliance-btn');

// Настройка слушателей для списка утвари
setupListClickListener('ustensils-list', 'selected_ustensils', 'ustensils-dropdown', 'ustensils', 'ustensils-btn');


function setupCloseButton(closeBtnId, inputId, filterField) {
    const closeButton = document.getElementById(closeBtnId);
    const inputElement = document.getElementById(inputId);

    if (!closeButton || !inputElement) {
        console.error(`Element with id ${closeBtnId} or ${inputId} not found`);
        return;
    }

    closeButton.addEventListener('click', function() {
        console.log(`Close button ${closeBtnId} clicked`);

        const targetButtonId = closeBtnId.replace('close_', '');
        console.log(`Target button ID: ${targetButtonId}`);

        const selectedItemContainer = document.querySelector(`.selected_item[data-target="${targetButtonId}"]`);
        console.log(`Selected item container:`, selectedItemContainer);

        if (selectedItemContainer) {
            selectedItemContainer.style.display = 'none';

            const query = inputElement.value.toLowerCase();
            console.log(`Filtering with query: ${query}`);

            const filteredResults = filterRecipesByQuery(query, currentDisplayedRecipes, filterField);
            displayResults(filteredResults, 'recipes_section', recipeCardElementDOM, updateNumberOfRecipes);
        } else {
            console.error(`Selected item container for ${targetButtonId} not found`);
        }
    });
}


// Настройка обработчиков для закрытия выбранных элементов
setupCloseButton('close_ingredient', 'ingredient-search', 'ingredients');
setupCloseButton('close_appliance', 'appliance-search', 'appliance');
setupCloseButton('close_ustensils', 'ustensils-search', 'ustensils');


export function filterRecipesByQuery(query, displayedRecipes, field) {
    const filteredRecipes = [];
    query = query.toLowerCase();

    for (let i = 0; i < displayedRecipes.length; i++) {
        const recipe = displayedRecipes[i];

        let matches = false;

        if (field === 'ingredients') {
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                if (ingredient.includes(query)) {
                    matches = true;
                    break;
                }
            }
        } else if (field === 'appliance') {
            const appliance = recipe.appliance.toLowerCase();
            if (appliance.includes(query)) {
                matches = true;
            }
        } else if (field === 'ustensils') {
            for (let j = 0; j < recipe.ustensils.length; j++) {
                const ustensil = recipe.ustensils[j].toLowerCase();
                if (ustensil.includes(query)) {
                    matches = true;
                    break;
                }
            }
        }

        if (matches) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}


export function displayResults(filteredItems, elementId, createElementDOMFunction, updateCountFunction) {
    const containerElement = document.getElementById(elementId);
    containerElement.innerHTML = '';  // Очищаем контейнер перед добавлением новых элементов

    filteredItems.forEach(item => {
        const elementDOM = createElementDOMFunction(item);  // Создание DOM элемента с помощью переданной функции
        containerElement.appendChild(elementDOM);  // Добавление элемента в контейнер
    });

    updateCountFunction(filteredItems.length);  // Обновление количества элементов через переданную функцию
}
