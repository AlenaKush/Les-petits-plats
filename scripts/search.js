import { recipes } from "./data/recipes.js";
import { recipeCardElementDOM } from "./functions/recipeCardElementDOM.js";
import { getRecipeData, createDropdownList } from "./functions/createDropdownList.js";

let currentDisplayedRecipes = [];
const searchResults = document.getElementById('recipes_section');

// Storage for selected filters
let selectedFilters = {
    ingredients: [],
    appliance: [],
    ustensils: []
};

//Function for displaying search results
export function displayResults(filteredRecipes) {
    searchResults.innerHTML = '';
    currentDisplayedRecipes.length = 0;
    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        const card = recipeCardElementDOM(recipe);
        searchResults.appendChild(card);
        currentDisplayedRecipes.push(recipe);
    }
    
    updateNumberOfRecipes(filteredRecipes.length);
}

//function to update the number of displayed recipes
export function updateNumberOfRecipes(count) {
    const numberRecipes = document.getElementById('number_recipes');
    numberRecipes.textContent = count + (count > 1 ? ' recettes' : ' recette');
}

//filter recipes
export function filterRecipes(query, allRecipes) {
    const filteredRecipes = [];

    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        let matches = recipeName.includes(query) ||
                      recipeDescription.includes(query);

        if (!matches) {
            for (let j = 0; matches !== true && j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(query)) {
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


//refined faltation
export function filterByAdditionalFilters(filteredRecipes) {
    const refinedRecipes = [];

    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        let matches = true;

        // Check ingredients
        for (let j = 0; matches !== false && j < selectedFilters.ingredients.length; j++) {
            const filter = selectedFilters.ingredients[j];
            let ingredientMatch = false;
            for (let k = 0; ingredientMatch !== true && k < recipe.ingredients.length; k++) {
                if (recipe.ingredients[k].ingredient.toLowerCase() === filter) {
                    ingredientMatch = true;
                }
            }
            if (!ingredientMatch) {
                matches = false;
            }
        }

        // Check appliance
        if (matches) {
            for (let j = 0; matches !== false && j < selectedFilters.appliance.length; j++) {
                if (recipe.appliance.toLowerCase() !== selectedFilters.appliance[j]) {
                    matches = false;
                }
            }
        }

        // Check utensils
        if (matches) {
            for (let j = 0; matches !== false && j < selectedFilters.ustensils.length; j++) {
                if (!recipe.ustensils.includes(selectedFilters.ustensils[j])) {
                    matches = false;
                }
            }
        }

        if (matches) {
            refinedRecipes.push(recipe);
        }
    }

    return refinedRecipes;
}

export function updateSelectedFilters(field, filterValue) {
    if (!selectedFilters[field].includes(filterValue)) {
        selectedFilters[field].push(filterValue); // Добавляет новый элемент, если его ещё нет
        console.log(`Добавлено: ${filterValue} в фильтр: ${field}`); // Лог для контроля
    }
}
/*
export function updateSelectedFilters(field, filterValue) {
    selectedFilters[field] = [filterValue];
}
*/
export function clearSelectedFilters(field) {
    selectedFilters[field] = [];
}

// Main search by query
const searchInput = document.getElementById('input_field');

searchInput.addEventListener('input', function() {
    const queryMain = searchInput.value.toLowerCase();

    let filteredRecipes = [];

    if (queryMain.length >= 3) {
        // If the query length is more than 3 characters, filter by the main query
        filteredRecipes = filterRecipes(queryMain, recipes);
        // Apply additional filters
        filteredRecipes = filterByAdditionalFilters(filteredRecipes);
/* // баг
        const ingredients = getRecipeData(filteredRecipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
        createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');
        const appliances = getRecipeData(filteredRecipes, recipe => recipe.appliance);
        createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');
        const ustensils = getRecipeData(filteredRecipes, recipe => recipe.ustensils);
        createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');
        */
    } else {
        // If the query length is less than 3 characters, show all recipes
        filteredRecipes = recipes;
    }

    displayResults(filteredRecipes);
});


// Function for setting up search in lists
function setupSearchInput(inputId, listId, clearInputId) {
    const searchInput = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const clearInput = document.getElementById(clearInputId);

    // Add input event
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const listItems = list.querySelectorAll('li'); // Используем querySelectorAll

        if (query.length > 0) {
            clearInput.style.display = 'block'; // Показать кнопку очистки, если текст введён

            let hasVisibleItems = false;

            // Фильтруем элементы списка
            for (let i = 0; i < listItems.length; i++) {
                const itemText = listItems[i].textContent.toLowerCase();
                if (query.length >= 3) {
                    // Показываем элемент, если он соответствует запросу
                    listItems[i].style.display = itemText.includes(query) ? '' : 'none';
                } else {
                    // Если запрос меньше 3 символов, показываем все элементы
                    listItems[i].style.display = '';
                }

                // Проверяем, есть ли видимые элементы
                if (listItems[i].style.display !== 'none') {
                    hasVisibleItems = true;
                }
            }

            // Открываем дропдаун, если есть видимые элементы
            list.style.display = hasVisibleItems ? 'block' : 'none';
        } else {
            // Если запрос пустой, скрываем кнопку очистки и показываем все элементы
            clearInput.style.display = 'none';
            for (let i = 0; i < listItems.length; i++) {
                listItems[i].style.display = '';
            }
            list.style.display = 'none'; // Скрываем дропдаун
        }
    });
}



//Очистить значение поиска и показать все элементы списка, когда пользователь нажимает кнопку очистки.
function setupClearButton(inputId, clearInputId) { 
    const searchInput = document.getElementById(inputId);
    const clearInput = document.getElementById(clearInputId);

    clearInput.addEventListener('click', function () {
        // Очистка значения поиска
        searchInput.value = '';
        // Скрытие кнопки очистки
        clearInput.style.display = 'none';

        // Показ всех элементов списка
        const list = document.getElementById(inputId.replace('-search', '-list'));
        const listItems = list.getElementsByTagName('li'); // Получаем все элементы <li>

        // Устанавливаем стиль display в '' для всех элементов списка
        for (let i = 0; i < listItems.length; i++) {
            listItems[i].style.display = ''; // Показ всех элементов
        }

        // Применение фильтров к полному списку рецептов
        let filteredResults = recipes; // Показать все рецепты

        // Применяем дополнительные фильтры, если они установлены
        if (selectedFilters.ingredients.length || selectedFilters.appliance.length || selectedFilters.ustensils.length) {
            filteredResults = filterByAdditionalFilters(filteredResults);
        }

        // Отображение всех рецептов с применением фильтров
        displayResults(filteredResults);
    });
}




setupSearchInput('ingredient-search', 'ingredients-list', 'clear-ingredient');
setupClearButton('ingredient-search', 'clear-ingredient');

setupSearchInput('appliance-search', 'appliance-list', 'clear-appliance');
setupClearButton('appliance-search', 'clear-appliance');

setupSearchInput('ustensils-search', 'ustensils-list', 'clear-ustensils');
setupClearButton('ustensils-search', 'clear-ustensils');

//создание кнопок выбранного элемента листа
function addSelectedItem(filterType, selectedItem) {
    // Находим соответствующий контейнер по filterType (например, ingredients-btn)
    const container = document.querySelector(`#${filterType}`).closest('.btn-conteiner');
    
    if (!container) {
        console.error(`Container for ${filterType} not found.`);
        return;
    }

    // Создаем новый элемент
    const newItem = document.createElement('div');
    newItem.classList.add('selected_item');
    newItem.setAttribute('data-target', filterType);

    // Создаем уникальный ID для каждого выбранного элемента
    const uniqueId = `selected_${filterType.replace('-btn', '')}_${Date.now()}`;
    const paragraph = document.createElement('p');
    paragraph.id = uniqueId;
    paragraph.textContent = selectedItem;

    const closeSpan = document.createElement('span');
    closeSpan.classList.add('material-symbols-outlined');
    closeSpan.textContent = 'close';

    // Удаляем элемент при клике на 'close'
    // Удаляем элемент при клике на 'close'
    closeSpan.addEventListener('click', () => {
        newItem.remove();  // Удаляем элемент из DOM

    // Получаем тип фильтра
        const filterType = newItem.getAttribute('data-target');

    // Удаляем элемент из выбранных фильтров
        selectedFilters[filterType].splice(selectedFilters[filterType].indexOf(selectedItem), 1);

    // Очистка поля поиска
        const inputElement = document.getElementById(`${filterType.replace('-btn', '')}-search`);
        inputElement.value = '';  // Очищаем соответствующее поле поиска

    // Обновляем отображение рецептов
        const query = searchInput.value.toLowerCase();
        let filteredResults = filterRecipes(query, recipes);

    // Применяем дополнительные фильтры, если они установлены
        if (selectedFilters.ingredients.length || selectedFilters.appliance.length || selectedFilters.ustensils.length) {
            filteredResults = filterByAdditionalFilters(filteredResults);
        }

        displayResults(filteredResults);  // Обновляем отображение рецептов
    });


    newItem.appendChild(paragraph);
    newItem.appendChild(closeSpan);

    // Добавляем новый элемент в найденный контейнер
    container.appendChild(newItem);
    newItem.style.display = 'flex';
}




// Функция для обновления отображения после закрытия элемента
function updateDisplayAfterClose() {
    const query = searchInput.value.toLowerCase();
    let filteredResults = filterRecipes(query, recipes);
    if (query.length >= 3) {
        filteredResults = filterByAdditionalFilters(filteredResults);
    } else if (selectedFilters.ingredients.length || selectedFilters.appliance.length || selectedFilters.ustensils.length) {
        filteredResults = filterByAdditionalFilters(filteredResults);
    }
    displayResults(filteredResults);
}



// Function for setting up a click on a filter list КЛИК ПО Ингредиенту
function setupListClickListener(listId, selectedItemId, dropdownId, filterField, buttonId) {
    const listElement = document.getElementById(listId);

    listElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const selectedItem = event.target.textContent.toLowerCase();

            updateSelectedFilters(filterField, selectedItem);

            // Применяем фильтры к текущим отображаемым рецептам
            const query = searchInput.value.toLowerCase();
            let filteredRecipes = filterRecipes(query, recipes);
            filteredRecipes = filterByAdditionalFilters(filteredRecipes);
            displayResults(filteredRecipes);

            // Отображаем выбранный элемент
            const selectedElement = document.getElementById(selectedItemId);
            if (selectedElement) {
                selectedElement.textContent = selectedItem;
            } /*else {
                console.error(`Element with ID ${selectedItemId} not found.`);
            }
*/
            // Добавляем элемент в список выбранных
            addSelectedItem(buttonId, selectedItem);
            
            // Скрываем выпадающий список
            document.getElementById(dropdownId).style.display = 'none';

        }
    });
}

/*
function setupListClickListener(listId, selectedItemId, dropdownId, filterField, buttonId) {
    const listElement = document.getElementById(listId);

    listElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const selectedItem = event.target.textContent.toLowerCase();

            updateSelectedFilters(filterField, selectedItem);

            // Apply filters to currently displayed recipes
            const query = searchInput.value.toLowerCase();
            let filteredRecipes = filterRecipes(query, recipes);
            filteredRecipes = filterByAdditionalFilters(filteredRecipes);
            displayResults(filteredRecipes);

            // Display the selected element
            document.getElementById(selectedItemId).textContent = selectedItem;
            document.querySelector(`.selected_item[data-target="${buttonId}"]`).style.display = 'flex';
            document.getElementById(dropdownId).style.display = 'none';
        }
    });
}*/

setupListClickListener('ingredients-list', 'selected_ingredient', 'ingredients-dropdown', 'ingredients', 'ingredients-btn');

setupListClickListener('appliance-list', 'selected_appliance', 'appliance-dropdown', 'appliance', 'appliance-btn');

setupListClickListener('ustensils-list', 'selected_ustensils', 'ustensils-dropdown', 'ustensils', 'ustensils-btn');
/*
// Удалить выбранный фильтр из отображения и очистить соответствующее поле поиска.
function setupCloseButton(closeBtnId, inputId, filterField) {
    const closeButton = document.getElementById(closeBtnId);
    const inputElement = document.getElementById(inputId);

    closeButton.addEventListener('click', function() {
        const targetButtonId = closeBtnId.replace('close_', '') + '-btn';
        const selectedItemContainer = document.querySelector(`.selected_item[data-target="${targetButtonId}"]`);

        if (selectedItemContainer) {
            selectedItemContainer.style.display = 'none';
            clearSelectedFilters(filterField);

            inputElement.value = '';

            const query = searchInput.value.toLowerCase();
            let filteredResults = filterRecipes(query, recipes);
            if (query.length >= 3) {
                filteredResults = filterByAdditionalFilters(filteredResults);
            } else if (selectedFilters.ingredients.length || selectedFilters.appliance.length || selectedFilters.ustensils.length) {
                filteredResults = filterByAdditionalFilters(filteredResults);
            }
            displayResults(filteredResults);
        }
    });
}



setupCloseButton('close_ingredient', 'ingredient-search', 'ingredients');
setupCloseButton('close_appliance', 'appliance-search', 'appliance');
setupCloseButton('close_ustensils', 'ustensils-search', 'ustensils');*/