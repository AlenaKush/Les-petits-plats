import { recipes } from "./data/recipes.js";
import { recipeCardElementDOM } from "./functions/recipeCardElementDOM.js";
import { getRecipeData, createDropdownList } from "./functions/createDropdownList.js";
import { filterRecipes, filterByAdditionalFilters } from "./functions/filters.js";

let currentDisplayedRecipes = [...recipes]; // Currently displayed recipes
const searchResults = document.getElementById('recipes_section');
const searchInput = document.getElementById('input_field');

// Storage for selected filters
export let selectedFilters = {
    ingredients: [],
    appliance: [],
    ustensils: []
};

// Display the list of recipes on the page
export function displayResults(filteredRecipes, query) {
    searchResults.innerHTML = '';
    currentDisplayedRecipes = [];

    // If no recipes are found, display an error message
    if (filteredRecipes.length === 0) {
        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = `Aucune recette ne contient ‘${query}’, vous pouvez chercher «tarte aux pommes», «poisson», etc.`;
        noResultsMessage.classList.add('no-results-message');
        searchResults.appendChild(noResultsMessage);
    } else {
        // If recipes are found, display them
        filteredRecipes.forEach(recipe => {
            searchResults.appendChild(recipeCardElementDOM(recipe));
            currentDisplayedRecipes.push(recipe);
        });
    }

    updateNumberOfRecipes(filteredRecipes.length);
}

// Update the number of displayed recipes
function updateNumberOfRecipes(count) {
    document.getElementById('number_recipes').textContent = count + (count > 1 ? ' recettes' : ' recette');
}

// Apply all active filters (text query and tags)
function applyAllFilters() {
    const queryMain = searchInput.value.toLowerCase();
    let filteredRecipes = [...recipes];

    if (queryMain.length >= 3) filteredRecipes = filterRecipes(queryMain, filteredRecipes);
    filteredRecipes = filterByAdditionalFilters(filteredRecipes);

    currentDisplayedRecipes = filteredRecipes;
    displayResults(filteredRecipes, queryMain);
    updateDropdowns(filteredRecipes);
}

// Update dropdown lists
function updateDropdowns(filteredRecipes) {
    createDropdownList(getRecipeData(filteredRecipes, recipe => recipe.ingredients.map(ing => ing.ingredient)), 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');
    createDropdownList(getRecipeData(filteredRecipes, recipe => recipe.appliance), 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');
    createDropdownList(getRecipeData(filteredRecipes, recipe => recipe.ustensils), 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');
}
/*
// Filter recipes by text query
function filterRecipes(query, allRecipes) {
    return allRecipes.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        let matches = recipeName.includes(query) || recipeDescription.includes(query);

        if (!matches) matches = recipe.ingredients.some(ingredientObj => ingredientObj.ingredient.toLowerCase().includes(query));
        return matches;
    });
}

// Filter recipes by active tags
function filterByAdditionalFilters(filteredRecipes) {
    return filteredRecipes.filter(recipe => {
        const ingredientMatch = selectedFilters.ingredients.length === 0 || selectedFilters.ingredients.every(filter => recipe.ingredients.some(ingredientObj => ingredientObj.ingredient.toLowerCase() === filter));
        const applianceMatch = selectedFilters.appliance.length === 0 || selectedFilters.appliance.includes(recipe.appliance.toLowerCase());
        const ustensilMatch = selectedFilters.ustensils.length === 0 || selectedFilters.ustensils.every(filterUstensil => recipe.ustensils.some(ustensil => ustensil.toLowerCase() === filterUstensil));
        return ingredientMatch && applianceMatch && ustensilMatch;
    });
}
*/
// Update selected filters
function updateSelectedFilters(field, filterValue) {
    if (!selectedFilters[field].includes(filterValue)) selectedFilters[field].push(filterValue);
}

// Remove filter from the selected list
function clearSelectedFilters(field, filterValue) {
    const index = selectedFilters[field].indexOf(filterValue);
    if (index > -1) selectedFilters[field].splice(index, 1);
}

// Event handler for the main text input
searchInput.addEventListener('input', applyAllFilters);

// Set up search functionality in dropdown lists
function setupSearchInput(inputId, listId, clearInputId) {
    const searchInput = document.getElementById(inputId);
    const list = document.getElementById(listId);
    const clearInput = document.getElementById(clearInputId);

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const listItems = list.querySelectorAll('li');

        clearInput.style.display = query.length > 0 ? 'block' : 'none';
        listItems.forEach(item => item.style.display = query.length >= 3 && !item.textContent.toLowerCase().includes(query) ? 'none' : '');
        list.style.display = Array.from(listItems).some(item => item.style.display !== 'none') ? 'block' : 'none';
    });
}

// Clear the search fields
function setupClearButton(inputId, clearInputId) {
    const searchInput = document.getElementById(inputId);
    const clearInput = document.getElementById(clearInputId);

    clearInput.addEventListener('click', function () {
        searchInput.value = '';
        document.getElementById(inputId.replace('-search', '-list')).querySelectorAll('li').forEach(item => item.style.display = '');
        clearInput.style.display = 'none';
        applyAllFilters();
    });
}

// Event handlers for tag clicks
function setupListClickListener(listId, filterField, buttonId) {
    document.getElementById(listId).addEventListener('click', function (event) {
        if (event.target.tagName === 'LI') {
            const selectedItem = event.target.textContent.toLowerCase();

            // Check if the tag is already added, just hide the dropdown and stop execution
            if (selectedFilters[filterField].includes(selectedItem)) {
                document.getElementById(listId.replace('-list', '-dropdown')).style.display = 'none';
                console.log(`The tag "${selectedItem}" has already been added.`);
                return;
            }

            // Update selected filters
            updateSelectedFilters(filterField, selectedItem);
            applyAllFilters();

            // Add the tag to the screen
            addSelectedItem(buttonId, selectedItem);

            // Hide the dropdown after successful addition
            document.getElementById(listId.replace('-list', '-dropdown')).style.display = 'none';
        }
    });
}

// Add selected tag to the screen
function addSelectedItem(filterType, selectedItem) {
    const container = document.querySelector(`#${filterType}`).closest('.btn-conteiner');
    if (!container) return;

    const newItem = document.createElement('div');
    newItem.classList.add('selected_item');
    newItem.innerHTML = `<p>${selectedItem}</p><span class="material-symbols-outlined">close</span>`;

    newItem.querySelector('span').addEventListener('click', () => {
        newItem.remove();
        clearSelectedFilters(filterType.replace('-btn', ''), selectedItem);
        applyAllFilters();
    });

    container.appendChild(newItem);
    newItem.style.display = 'flex';
}

// Initialize all event handlers
setupSearchInput('ingredient-search', 'ingredients-list', 'clear-ingredient');
setupClearButton('ingredient-search', 'clear-ingredient');
setupSearchInput('appliance-search', 'appliance-list', 'clear-appliance');
setupClearButton('appliance-search', 'clear-appliance');
setupSearchInput('ustensils-search', 'ustensils-list', 'clear-ustensils');
setupClearButton('ustensils-search', 'clear-ustensils');
setupListClickListener('ingredients-list', 'ingredients', 'ingredients-btn');
setupListClickListener('appliance-list', 'appliance', 'appliance-btn');
setupListClickListener('ustensils-list', 'ustensils', 'ustensils-btn');
