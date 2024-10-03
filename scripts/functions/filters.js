import { selectedFilters } from "../search.js";



// Filter recipes by text query
export function filterRecipes(query, allRecipes) {
    return allRecipes.filter(recipe => {
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        let matches = recipeName.includes(query) || recipeDescription.includes(query);

        if (!matches) matches = recipe.ingredients.some(ingredientObj => ingredientObj.ingredient.toLowerCase().includes(query));
        return matches;
    });
}

// Filter recipes by active tags
export function filterByAdditionalFilters(filteredRecipes) {
    return filteredRecipes.filter(recipe => {
        const ingredientMatch = selectedFilters.ingredients.length === 0 || selectedFilters.ingredients.every(filter => recipe.ingredients.some(ingredientObj => ingredientObj.ingredient.toLowerCase() === filter));
        const applianceMatch = selectedFilters.appliance.length === 0 || selectedFilters.appliance.includes(recipe.appliance.toLowerCase());
        const ustensilMatch = selectedFilters.ustensils.length === 0 || selectedFilters.ustensils.every(filterUstensil => recipe.ustensils.some(ustensil => ustensil.toLowerCase() === filterUstensil));
        return ingredientMatch && applianceMatch && ustensilMatch;
    });
}
