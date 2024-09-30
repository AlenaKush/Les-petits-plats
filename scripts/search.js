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

// Function for displaying search results
export function displayResults(filteredRecipes) {
    searchResults.innerHTML = '';
    currentDisplayedRecipes = []; 

    filteredRecipes.forEach(recipe => {
        const card = recipeCardElementDOM(recipe);
        searchResults.appendChild(card);
        currentDisplayedRecipes.push(recipe);  // Add the recipe to the array
    });

    updateNumberOfRecipes(filteredRecipes.length);  
}


//function to update the number of displayed recipes
export function updateNumberOfRecipes(count) {
    const numberRecipes = document.getElementById('number_recipes');
    numberRecipes.textContent = count + (count > 1 ? ' recettes' : ' recette');
}

// Filter recipes
export function filterRecipes(query, allRecipes) {
    const filteredRecipes = allRecipes.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        
        let matches = recipeName.includes(query) || recipeDescription.includes(query);
    
        //If there are no matches in the name or description, check the ingredients
        if (!matches) {
            matches = recipe.ingredients.some(ingredientObj => 
                ingredientObj.ingredient.toLowerCase().includes(query)
            );
        }

        return matches;
    });
    
    
    const ingredients = getRecipeData(filteredRecipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
    createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');
 
    const appliances = getRecipeData(filteredRecipes, recipe => recipe.appliance);
    createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');
 
    const ustensils = getRecipeData(filteredRecipes, recipe => recipe.ustensils);
    createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');

    return filteredRecipes;
}

// Refined filtration
export function filterByAdditionalFilters(filteredRecipes) {
    return filteredRecipes.filter(recipe => {
        let matches = true;

        // Checking ingredients
        if (selectedFilters.ingredients.length > 0) {
            matches = selectedFilters.ingredients.every(filter => 
                recipe.ingredients.some(ingredientObj => 
                    ingredientObj.ingredient.toLowerCase() === filter
                )
            );
        }

        // Checking appliance
        if (matches && selectedFilters.appliance.length > 0) {
            matches = selectedFilters.appliance.every(applianceFilter => 
                recipe.appliance.toLowerCase() === applianceFilter
            );
        }

        // Checking utensils
        if (matches && selectedFilters.ustensils.length > 0) {
            matches = selectedFilters.ustensils.every(filterUstensil => 
                recipe.ustensils.some(ustensil => 
                    ustensil.toLowerCase() === filterUstensil
                )
            );
        }

        return matches;  
    });
}



export function updateSelectedFilters(field, filterValue) {
    if (!selectedFilters[field].includes(filterValue)) {
        selectedFilters[field].push(filterValue);
    }
}



export function clearSelectedFilters(field, filterValue) {
    
    // Find the index of the value to be deleted
    const index = selectedFilters[field].indexOf(filterValue);

    // Let's check that the filter index is found
    if (index > -1) {
        // Remove an element from the filters array
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

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const listItems = list.querySelectorAll('li');

        if (query.length > 0) {
            clearInput.style.display = 'block';

            let hasVisibleItems = false;

            listItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                const match = itemText.includes(query);

                if (query.length >= 3) {
                    item.style.display = match ? '' : 'none';
                } else {
                    item.style.display = '';
                }

                // Checking if there are visible elements
                if (item.style.display !== 'none') {
                    hasVisibleItems = true;
                }
            });

            // Open dropdown if there are visible elements
            list.style.display = hasVisibleItems ? 'block' : 'none';
        } else {
            // If the request is empty, hide the clear button and show all elements
            clearInput.style.display = 'none';
            listItems.forEach(item => {
                item.style.display = '';
            });
            list.style.display = 'none'; 
        }
    });
}

//Clear the search value and show all list items when the user clicks the clear button
function setupClearButton(inputId, clearInputId) { 
    const searchInput = document.getElementById(inputId);
    const clearInput = document.getElementById(clearInputId);

    clearInput.addEventListener('click', function () {
       
        searchInput.value = '';
        
        clearInput.style.display = 'none';

        // Show all list items
        const list = document.getElementById(inputId.replace('-search', '-list'));
        const listItems = Array.from(list.getElementsByTagName('li')); // Convert to an array

        
        listItems.forEach(item => {
            item.style.display = ''; 
        });

        let filteredResults = recipes;

        // Apply additional filters if they are installed
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

//create buttons of the selected sheet element
function addSelectedItem(filterType, selectedItem) {
    const container = document.querySelector(`#${filterType}`).closest('.btn-conteiner');
    
    if (!container) {
        console.error(`Container for ${filterType} not found.`);
        return;
    }

    const newItem = document.createElement('div');
    newItem.classList.add('selected_item');

    const filterField = filterType.replace('-btn', ''); // Replace '-btn' with an empty string

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
        clearSelectedFilters(filterField, selectedItem);  

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


// Function for setting up a click on a filter list 
function setupListClickListener(listId, selectedItemId, dropdownId, filterField, buttonId) {
    const listElement = document.getElementById(listId);

    listElement.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const selectedItem = event.target.textContent.toLowerCase();

            // Updating selected filters
            updateSelectedFilters(filterField, selectedItem);

            // Apply filters to currently displayed recipes
            const query = searchInput.value.toLowerCase();
            let filteredRecipes = filterRecipes(query, recipes);
            filteredRecipes = filterByAdditionalFilters(filteredRecipes);
            displayResults(filteredRecipes);

            // Add an item to the selected list
            addSelectedItem(buttonId, selectedItem);
            
            // Hide the drop-down list
            document.getElementById(dropdownId).style.display = 'none';
        
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
