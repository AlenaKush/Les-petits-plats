import { recipes } from "../data/recipes.js";
import { searchResults, displayResults } from "../functions/displayResults.js";

const searchInput = document.getElementById('input_field');

searchInput.addEventListener('input', function() {
    const query = searchInput.value.toLowerCase(); 
    
    if (query.length >= 3) { 
        const filteredRecipes = filterRecipes(query); 
        displayResults(filteredRecipes);
    } else {
        searchResults.innerHTML = '';
        displayResults(recipes);
    }
});

export function filterRecipes(query) {
    let filteredRecipes = [];
    query = query.toLowerCase(); 

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();

        if (recipeName.includes(query)) {
            filteredRecipes.push(recipe);
        } 
        else if (recipeDescription.includes(query)) {
            filteredRecipes.push(recipe);
        } 
        else {
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
    }

    return filteredRecipes;
}
