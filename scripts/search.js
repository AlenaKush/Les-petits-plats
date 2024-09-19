import { recipes } from "./data/recipes.js";
import { recipeCardElementDOM } from "./functions/recipeCardElementDOM.js";

let currentDisplayedRecipes = [];
const searchResults = document.getElementById('recipes_section');

// Storage for selected filters
let selectedFilters = {
    ingredients: [],
    appliance: [],
    ustensils: []
};

// Function for displaying search results
export function displayResults(filteredRecipes) {
    searchResults.innerHTML = '';
    currentDisplayedRecipes.length = 0;
    filteredRecipes.forEach(recipe => {
        const card = recipeCardElementDOM(recipe);
        searchResults.appendChild(card);
        currentDisplayedRecipes.push(recipe);
    });
    updateNumberOfRecipes(filteredRecipes.length);
}

// Function to update the number of displayed recipes
export function updateNumberOfRecipes(count) {
    const numberRecipes = document.getElementById('number_recipes');
    numberRecipes.textContent = count + (count > 1 ? ' recettes' : ' recette');
}

// Filter recipes
export function filterRecipes(query, allRecipes) {
    const lowerQuery = query.toLowerCase();
    return allRecipes.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        const ingredientsMatch = recipe.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(lowerQuery)
        );
        return recipeName.includes(lowerQuery) ||
               recipeDescription.includes(lowerQuery) ||
               ingredientsMatch;
    });
}

// Refined filtration
export function filterByAdditionalFilters(filteredRecipes) {
    return filteredRecipes.filter(recipe => {
        const ingredientsMatch = selectedFilters.ingredients.every(filter =>
            recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase() === filter
            )
        );
        const applianceMatch = selectedFilters.appliance.every(filter =>
            recipe.appliance.toLowerCase() === filter
        );
        const ustensilsMatch = selectedFilters.ustensils.every(filter =>
            recipe.ustensils.includes(filter)
        );

        return ingredientsMatch && applianceMatch && ustensilsMatch;
    });
}

export function updateSelectedFilters(field, filterValue) {
    selectedFilters[field] = [filterValue];
}

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

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const listItems = list.querySelectorAll('li'); // Getting list elements

        if (query.length > 0) {
            clearInput.style.display = 'block'; // Show clear button if text is entered
            if (query.length >= 3) {
                // Filter list items
                listItems.forEach(item => {
                    const itemText = item.textContent.toLowerCase();
                    item.style.display = itemText.includes(query) ? '' : 'none';
                });
            } else {
                // Show all list items
                listItems.forEach(item => item.style.display = '');
            }
        } else {
            // Hide clear button and show all items
            clearInput.style.display = 'none';
            listItems.forEach(item => item.style.display = '');
        }
    });
}

function setupClearButton(inputId, clearInputId) {
    const searchInput = document.getElementById(inputId);
    const clearInput = document.getElementById(clearInputId);

    clearInput.addEventListener('click', function () {
        searchInput.value = '';
        clearInput.style.display = 'none';

        const list = document.getElementById(inputId.replace('-search', '-list'));
        list.querySelectorAll('li').forEach(item => item.style.display = '');

        // If there are additional filters, apply them
        let filteredResults = filterRecipes(searchInput.value.toLowerCase(), recipes);
        if (selectedFilters.ingredients.length || selectedFilters.appliance.length || selectedFilters.ustensils.length) {
            filteredResults = filterByAdditionalFilters(filteredResults);
        }
        displayResults(filteredResults);
    });
}

setupSearchInput('ingredient-search', 'ingredients-list', 'clear-ingredient');
setupClearButton('ingredient-search', 'clear-ingredient');

setupSearchInput('appliance-search', 'appliance-list', 'clear-appliance');
setupClearButton('appliance-search', 'clear-appliance');

setupSearchInput('ustensils-search', 'ustensils-list', 'clear-ustensils');
setupClearButton('ustensils-search', 'clear-ustensils');

// Function for setting up a click on a filter list
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
}

setupListClickListener('ingredients-list', 'selected_ingredient', 'ingredients-dropdown', 'ingredients', 'ingredient-btn');
setupListClickListener('appliance-list', 'selected_appliance', 'appliance-dropdown', 'appliance', 'appliance-btn');
setupListClickListener('ustensils-list', 'selected_ustensils', 'ustensils-dropdown', 'ustensils', 'ustensils-btn');

// Function for setting up a handler for clicks on filter close buttons
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
setupCloseButton('close_ustensils', 'ustensils-search', 'ustensils');
