import { recipes } from "./data/recipes.js";
import { recipeCardElementDOM } from "./functions/recipeCardElementDOM.js";
import { getRecipeData, createDropdownList, setupDropdown } from "./functions/createDropdownList.js";

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
        currentDisplayedRecipes[currentDisplayedRecipes.length] = recipe;
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
        
        let matches = false;
    
        // Проверяем, содержится ли `query` в `recipeName`
        for (let i = 0; matches !== true && i <= recipeName.length - query.length; i++) {
            if (recipeName.substr(i, query.length) === query) {
                matches = true;
            }
        }
    
        // Если `recipeName` не содержит `query`, проверяем `recipeDescription`
        if (!matches) {
            for (let i = 0; matches !== true && i <= recipeDescription.length - query.length; i++) {
                if (recipeDescription.substr(i, query.length) === query) {
                    matches = true;
                }
            }
        }
    
        // Если нет совпадений по имени и описанию, проверяем ингредиенты
        if (!matches) {
            for (let j = 0; matches !== true && j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                for (let k = 0; matches !== true && k <= ingredient.length - query.length; k++) {
                    if (ingredient.substr(k, query.length) === query) {
                        matches = true;
                    }
                }
            }
        }
    
        // Добавляем отфильтрованные рецепты
        if (matches) {
            filteredRecipes[filteredRecipes.length] = recipe;
        }
    }
    
    // После того, как рецепты отфильтрованы, обновляем списки дропдаунов:
    const ingredients = getRecipeData(filteredRecipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
    createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');
 
    const appliances = getRecipeData(filteredRecipes, recipe => recipe.appliance);
    createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');
 
    const ustensils = getRecipeData(filteredRecipes, recipe => recipe.ustensils);
    createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');

    return filteredRecipes;
}


//refined filtration
export function filterByAdditionalFilters(filteredRecipes) {
    const refinedRecipes = [];

    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];
        let matches = true;

        // Проверка ингредиентов
        for (let j = 0; matches && j < selectedFilters.ingredients.length; j++) {
            const filter = selectedFilters.ingredients[j];
            let ingredientMatch = false;

            for (let k = 0; k < recipe.ingredients.length && !ingredientMatch; k++) {
                const ingredient = recipe.ingredients[k].ingredient.toLowerCase();
                
                // Проверка, содержится ли фильтр в названии ингредиента
                if (ingredient === filter) {
                    ingredientMatch = true;
                }
            }

            // Если хотя бы один ингредиент не совпал, прекращаем проверку
            matches = ingredientMatch;
        }

        // Проверка прибора
        if (matches) {
            for (let j = 0; matches && j < selectedFilters.appliance.length; j++) {
                let applianceMatch = true;

                const applianceFilter = selectedFilters.appliance[j];
                const recipeAppliance = recipe.appliance.toLowerCase();

                // Проверка совпадения прибора
                for (let k = 0; k < recipeAppliance.length && applianceMatch; k++) {
                    if (recipeAppliance[k] !== applianceFilter[k]) {
                        applianceMatch = false;
                    }
                }

                matches = applianceMatch;
            }
        }

        // Проверка утвари
        if (matches) {
            for (let j = 0; matches && j < selectedFilters.ustensils.length; j++) {
                const filterUstensil = selectedFilters.ustensils[j];
                let utensilMatch = false;

                // Проверка совпадения утвари
                for (let k = 0; k < recipe.ustensils.length && !utensilMatch; k++) {
                    if (recipe.ustensils[k] === filterUstensil) {
                        utensilMatch = true;
                    }
                }

                matches = utensilMatch;
            }
        }

        // Добавление рецепта, если все фильтры совпали
        if (matches) {
            refinedRecipes[refinedRecipes.length] = recipe;
        }
    }

    return refinedRecipes;
}


export function updateSelectedFilters(field, filterValue) {
    let filterExists = false;

    // Проходим по массиву фильтров и проверяем, есть ли уже такой фильтр
    for (let i = 0; i < selectedFilters[field].length; i++) {
        if (selectedFilters[field][i] === filterValue) {
            filterExists = true;
            break;
        }
    }

    // Если фильтр не найден, добавляем его в массив
    if (!filterExists) {
        selectedFilters[field][selectedFilters[field].length] = filterValue;
        console.log(`Добавлено: ${filterValue} в фильтр: ${field}`);  // Лог для проверки
    }
}


export function clearSelectedFilters(field, filterValue) {
    // Проверка на наличие поля в объекте selectedFilters
    if (!selectedFilters[field]) {
        console.error(`Field ${field} does not exist in selectedFilters.`);
        return;
    }

    // Найдем индекс удаляемого значения
    let index = -1; // По умолчанию предполагаем, что элемента нет

    // Цикл для поиска индекса элемента в массиве
    for (let i = 0; i < selectedFilters[field].length && index === -1; i++) {
        if (selectedFilters[field][i] === filterValue) {
            index = i; // Сохраняем индекс, если элемент найден
        }
    }


    // Проверим, что индекс фильтра найден и он существует в массиве
    if (index > -1) {
        // Удалим элемент из массива фильтров
        selectedFilters[field].splice(index, 1);
    }

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
       
        const ingredients = getRecipeData(filteredRecipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
        createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');
        const appliances = getRecipeData(filteredRecipes, recipe => recipe.appliance);
        createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');
        const ustensils = getRecipeData(filteredRecipes, recipe => recipe.ustensils);
        createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');
        
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

    // Добавляем обработчик события input
    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const listItems = list.querySelectorAll('li');

        if (query.length > 0) {
            clearInput.style.display = 'block';

            let hasVisibleItems = false;

            // Фильтруем элементы списка
            for (let i = 0; i < listItems.length; i++) {
                const itemText = listItems[i].textContent.toLowerCase();
                let match = false;

                // Проверяем, содержится ли подстрока `query` в `itemText`
                for (let j = 0; j <= itemText.length - query.length; j++) {
                    if (itemText.substr(j, query.length) === query) {
                        match = true;
                        break;
                    }
                }

                if (query.length >= 3) {
                    // Показываем элемент, если он соответствует запросу
                    listItems[i].style.display = match ? '' : 'none';
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
// Обновление выбранных фильтров при удалении элемента
function addSelectedItem(filterType, selectedItem) {
    const container = document.querySelector(`#${filterType}`).closest('.btn-conteiner');
    
    if (!container) {
        console.error(`Container for ${filterType} not found.`);
        return;
    }

    const newItem = document.createElement('div');
    newItem.classList.add('selected_item');
    // Вместо использования filterType напрямую, замените на корректное значение для selectedFilters
    const filterField = filterType.replace('-btn', ''); // Заменяем '-btn' на пустую строку

    const uniqueId = `selected_${filterField}_${Date.now()}`;
    const paragraph = document.createElement('p');
    paragraph.id = uniqueId;
    paragraph.textContent = selectedItem;

    const closeSpan = document.createElement('span');
    closeSpan.classList.add('material-symbols-outlined');
    closeSpan.textContent = 'close';

    console.log(`Added selected item: ${selectedItem} to ${filterType}`);

    closeSpan.addEventListener('click', () => {
        console.log('Close button clicked');
        
        newItem.remove();

        console.log(`Removing filter: ${filterField} - ${selectedItem}`);
        clearSelectedFilters(filterField, selectedItem);  // Передаем правильное имя поля в selectedFilters

        console.log('Updated filters:', JSON.stringify(selectedFilters));
        
        const searchInput = document.getElementById('input_field');
        const query = searchInput ? searchInput.value.toLowerCase() : '';
        
        let filteredResults = filterRecipes(query, recipes);
        
        if (selectedFilters.ingredients.length || selectedFilters.appliance.length || selectedFilters.ustensils.length) {
            filteredResults = filterByAdditionalFilters(filteredResults);
        }

        console.log('Filtered results:', filteredResults);
        displayResults(filteredResults);

        setupDropdown('ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');
        setupDropdown('appliance-btn', 'appliance-dropdown', 'appliance-arrow');
        setupDropdown('ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');
    
    });

    newItem.appendChild(paragraph);
    newItem.appendChild(closeSpan);

    container.appendChild(newItem);
    newItem.style.display = 'flex';
}


// Function for setting up a click on a filter list КЛИК ПО Ингредиенту
function setupListClickListener(listId, selectedItemId, dropdownId, filterField, buttonId) {
    const listElement = document.getElementById(listId);

    listElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const selectedItem = event.target.textContent.toLowerCase();

            // Обновляем выбранные фильтры
            updateSelectedFilters(filterField, selectedItem);

            // Применяем фильтры к текущим отображаемым рецептам
            const query = searchInput.value.toLowerCase();
            let filteredRecipes = filterRecipes(query, recipes);
            filteredRecipes = filterByAdditionalFilters(filteredRecipes);
            displayResults(filteredRecipes);

            // Добавляем элемент в список выбранных
            addSelectedItem(buttonId, selectedItem);
            
            // Скрываем выпадающий список
            document.getElementById(dropdownId).style.display = 'none';
        
             // После того, как рецепты отфильтрованы, обновляем списки дропдаунов:
            const ingredients = getRecipeData(filteredRecipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
            createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');

            const appliances = getRecipeData(filteredRecipes, recipe => recipe.appliance);
            createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');

            const ustensils = getRecipeData(filteredRecipes, recipe => recipe.ustensils);
            createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');
        }
    });
}

setupListClickListener('ingredients-list', 'selected_ingredient', 'ingredients-dropdown', 'ingredients', 'ingredients-btn');

setupListClickListener('appliance-list', 'selected_appliance', 'appliance-dropdown', 'appliance', 'appliance-btn');

setupListClickListener('ustensils-list', 'selected_ustensils', 'ustensils-dropdown', 'ustensils', 'ustensils-btn');
