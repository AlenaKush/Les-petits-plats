import { currentDisplayedRecipes } from "../functions/displayResults.js";
import { recipeCardElementDOM } from "../functions/recipeCardElementDOM.js";
import { updateNumberOfRecipes } from "../functions/displayResults.js";

const searchInputIngredients = document.getElementById('ingredient-search');
const ingredientsList = document.getElementById('ingredients-list');
const ingredientsItems = ingredientsList.querySelectorAll('li');

searchInputIngredients.addEventListener('input', function () {
    const queryIngredients = searchInputIngredients.value.toLowerCase();

    if (queryIngredients.length >= 3) {
        const filteredIngredients = filterRecipesByIngredients(queryIngredients, currentDisplayedRecipes);
        displayResults(filteredIngredients);
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
        displayResults(currentDisplayedRecipes);
    }
});

ingredientsList.addEventListener('click', function(event) {
    const clickedElement = event.target;

    if (clickedElement.tagName === 'LI') {
        const ingredient = clickedElement.textContent.toLowerCase();
        const filteredRecipes = filterRecipesByIngredients(ingredient, currentDisplayedRecipes);
        displayResults(filteredRecipes);
        const movedElement = clickedElement.cloneNode(true); 
        movedElement.classList.add('selectedIngredient');
        ingredientsList.insertBefore(movedElement, ingredientsList.firstChild);
        clickedElement.remove();
    }
});


export function filterRecipesByIngredients(query, displayedRecipes) {
    const filteredRecipes = [];
    query = query.toLowerCase();

    for (let i = 0; i < displayedRecipes.length; i++) {
        const recipe = displayedRecipes[i];

        let matchesIngredients = false;
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
            if (ingredient.includes(query)) {
                matchesIngredients = true;
                break; 
            }
        }

        if (matchesIngredients) {
            filteredRecipes.push(recipe);
        }
    }

    return filteredRecipes;
}

export function displayResults(filteredRecipes) {
    const searchResults = document.getElementById('recipes_section');
    searchResults.innerHTML = '';

    filteredRecipes.forEach(recipe => {
        const card = recipeCardElementDOM(recipe);
        searchResults.appendChild(card);
    });

    updateNumberOfRecipes();
}
