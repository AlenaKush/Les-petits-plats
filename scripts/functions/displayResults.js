import { recipeCardElementDOM } from "./recipeCardElementDOM.js";

export let currentDisplayedRecipes = [];
export const searchResults = document.getElementById('recipes_section');

// Функция для отображения результатов поиска
export function displayResults(filteredRecipes) {
    searchResults.innerHTML = '';
    currentDisplayedRecipes.splice(0, currentDisplayedRecipes.length);
    filteredRecipes.forEach(recipe => {
        const card = recipeCardElementDOM(recipe);
        searchResults.appendChild(card);
        currentDisplayedRecipes.push(recipe);

    });
    
    updateNumberOfRecipes(filteredRecipes.length);
}

export function updateNumberOfRecipes(count) {
    const numberRecipes = document.getElementById('number_recipes');
    let text = count + ' recette';
    if (count > 1) {
        text = count + ' recettes';
    }
    numberRecipes.textContent = text;
}
