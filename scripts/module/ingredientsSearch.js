import { currentDisplayedRecipes } from "../functions/displayResults.js";
import { recipeCardElementDOM } from "../functions/recipeCardElementDOM.js";
import { updateNumberOfRecipes } from "../functions/displayResults.js";

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
                // Фильтрация элементов списка
                for (let i = 0; i < listItems.length; i++) {
                    const item = listItems[i];
                    const itemText = item.textContent.toLowerCase();
                    item.style.display = itemText.includes(query) ? '' : 'none';
                }
            } else {
                // Отображаем все элементы, если длина запроса меньше 3 символов
                listItems.forEach(item => {
                    item.style.display = '';
                });
            }
        } else {
            clearInput.style.display = 'none';
            // Показываем все элементы, если поле ввода очищено
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



/*import { currentDisplayedRecipes } from "../functions/displayResults.js";
import { recipeCardElementDOM } from "../functions/recipeCardElementDOM.js";
import { updateNumberOfRecipes } from "../functions/displayResults.js";

const searchInputIngredients = document.getElementById('ingredient-search');
const ingredientsList = document.getElementById('ingredients-list');
const ingredientsItems = ingredientsList.querySelectorAll('li');

searchInputIngredients.addEventListener('input', function () {
    const queryIngredients = searchInputIngredients.value.toLowerCase();
    const clearInput = document.getElementById('clear-ingredient');

    if (queryIngredients.length > 0) {
        clearInput.style.display = 'block';
        if (queryIngredients.length >= 3) {
          
            for (let i = 0; i < ingredientsItems.length; i++) {
                const item = ingredientsItems[i];
                const itemText = item.textContent.toLowerCase();
                if (itemText.includes(queryIngredients)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            }
        } else {
            ingredientsItems.forEach(item => {
                item.style.display = '';
            });
        }
    } else {
        clearInput.style.display = 'none';
        ingredientsItems.forEach(item => {
            item.style.display = '';
        });
    }
});*/



function setupListClickListener(listId, selectedItemId, selectedContainerClass, dropdownId, filterFunction) {
    const listElement = document.getElementById(listId);
    
    listElement.addEventListener('click', function(event) {
        const clickedElement = event.target;

        if (clickedElement.tagName === 'LI') {
            const selectedItem = clickedElement.textContent.toLowerCase();
            
            // Фильтрация рецептов через переданную функцию
            const filteredRecipes = filterFunction(selectedItem, currentDisplayedRecipes);
            displayResults(filteredRecipes);

            // Отображение выбранного элемента
            const selectedDisplay = document.getElementById(selectedItemId);
            selectedDisplay.textContent = selectedItem;

            // Показ контейнера с выбранным элементом
            const container = document.querySelector(selectedContainerClass);
            container.style.display = 'flex';

            // Скрытие дропдауна
            const dropdown = document.getElementById(dropdownId);
            dropdown.style.display = 'none';
        }
    });
}



/*
// Пример функции фильтрации по ингредиентам (эту функцию нужно реализовать)
function filterRecipesByIngredients(ingredient, recipes) {
    // Фильтрация рецептов по ингредиентам (пример)
    return recipes.filter(recipe =>
        recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient)
    );
}

// Пример функции фильтрации по приборам (эту функцию нужно реализовать)
function filterRecipesByAppliance(appliance, recipes) {
    // Фильтрация рецептов по приборам (пример)
    return recipes.filter(recipe => recipe.appliance.toLowerCase() === appliance);
}

// Пример функции фильтрации по утвари (эту функцию нужно реализовать)
function filterRecipesByUstensils(ustensil, recipes) {
    // Фильтрация рецептов по утвари (пример)
    return recipes.filter(recipe =>
        recipe.ustensils.some(u => u.toLowerCase() === ustensil)
    );
}
*/
// Настройка слушателей для списка ингредиентов
setupListClickListener('ingredients-list', 'selected_ingredient', '.selected_item', 'ingredients-dropdown', filterRecipesByIngredients);

// Настройка слушателей для списка приборов
setupListClickListener('appliance-list', 'selected_appliance', '.selected_item', 'appliance-dropdown', filterRecipesByAppliance);

// Настройка слушателей для списка утвари
setupListClickListener('ustensils-list', 'selected_ustensils', '.selected_item', 'ustensils-dropdown', filterRecipesByUstensils);



/*
// Обработчик клика на иконке очистки
document.getElementById('clear-input').addEventListener('click', function() {
    searchInputIngredients.value = ''; // Очистить поле ввода
    searchInputIngredients.dispatchEvent(new Event('input')); // Запустить событие input для обновления отображения
});*/

/*
ingredientsList.addEventListener('click', function(event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === 'LI') {
        const ingredient = clickedElement.textContent.toLowerCase();
        const filteredRecipes = filterRecipesByIngredients(ingredient, currentDisplayedRecipes);
        displayResults(filteredRecipes);


        const selectedIngredient = document.getElementById('selected_ingredient');
        selectedIngredient.textContent = ingredient;
        const conteiner = document.querySelector('.selected_item');
        conteiner.style.display = 'flex';

        const dropdown =document.getElementById('ingredients-dropdown');
        dropdown.style.display = 'none';

        
        
    }
});*/




/*
const close = document.getElementById('close_ingredient');

// Обработчик клика
close.addEventListener('click', function() {
    // Скрываем элемент с классом 'selected_item'
    const selectedItem = document.querySelector('.selected_item');
    if (selectedItem) {
        selectedItem.style.display = 'none';

        const queryIngredients = searchInputIngredients.value.toLowerCase();
        const filteredIngredients = filterRecipesByIngredients(queryIngredients, currentDisplayedRecipes);
        displayResults(filteredIngredients)
    }

});*/



function setupCloseButton(closeBtnId, selectedContainerClass, filterFunction, inputId) {
    const closeButton = document.getElementById(closeBtnId);
    const inputElement = document.getElementById(inputId);
    
    closeButton.addEventListener('click', function() {
        // Скрываем контейнер с выбранным элементом
        const selectedItemContainer = document.querySelector(selectedContainerClass);
        if (selectedItemContainer) {
            selectedItemContainer.style.display = 'none';

            // Получаем текущее значение из поля ввода
            const query = inputElement.value.toLowerCase();

            // Применяем фильтрацию с использованием переданной функции
            const filteredResults = filterFunction(query, currentDisplayedRecipes);
            displayResults(filteredResults);
        }
    });
}



// Настройка обработчиков для закрытия выбранных элементов
setupCloseButton('close_ingredient', '.selected_item', filterRecipesByIngredients, 'ingredient-search');
setupCloseButton('close_appliance', '.selected_item', filterRecipesByAppliance, 'appliance-search');
setupCloseButton('close_ustensils', '.selected_item', filterRecipesByUstensils, 'ustensils-search');

/*
export function filterRecipesByIngredients(query, displayedRecipes) {
    const filteredRecipes = [];
    query = query.toLowerCase();

    for (let i = 0; i < displayedRecipes.length; i++) {
        const recipe = displayedRecipes[i];

        let matchesIngredients = false;
        for (let j = 0; matchesIngredients !== true && j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
            if (ingredient.includes(query)) {
                matchesIngredients = true;
            }
        }

        if (matchesIngredients) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}*/

export function filterRecipesByQuery(query, displayedRecipes, field) {
    const filteredRecipes = [];
    query = query.toLowerCase();

    for (let i = 0; i < displayedRecipes.length; i++) {
        const recipe = displayedRecipes[i];

        let matches = false;

        if (field === 'ingredients') {
            // Фильтрация по ингредиентам
            for (let j = 0; matches !== true && j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                if (ingredient.includes(query)) {
                    matches = true;
                }
            }
        } else if (field === 'appliance') {
            // Фильтрация по приборам
            const appliance = recipe.appliance.toLowerCase();
            if (appliance.includes(query)) {
                matches = true;
            }
        } else if (field === 'ustensils') {
            // Фильтрация по утвари
            for (let j = 0; matches !== true && j < recipe.ustensils.length; j++) {
                const ustensil = recipe.ustensils[j].toLowerCase();
                if (ustensil.includes(query)) {
                    matches = true;
                }
            }
        }

        if (matches) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}


/*
export function displayResults(filteredRecipes) {
    const searchResults = document.getElementById('recipes_section');
    searchResults.innerHTML = '';

    filteredRecipes.forEach(recipe => {
        const card = recipeCardElementDOM(recipe);
        searchResults.appendChild(card);
    });

    updateNumberOfRecipes(filteredRecipes.length);
}*/

export function displayResults(filteredItems, elementId, createElementDOMFunction, updateCountFunction) {
    const containerElement = document.getElementById(elementId);
    containerElement.innerHTML = '';  // Очищаем контейнер перед добавлением новых элементов

    filteredItems.forEach(item => {
        const elementDOM = createElementDOMFunction(item);  // Создание DOM элемента с помощью переданной функции
        containerElement.appendChild(elementDOM);  // Добавление элемента в контейнер
    });

    updateCountFunction(filteredItems.length);  // Обновление количества элементов через переданную функцию
}

