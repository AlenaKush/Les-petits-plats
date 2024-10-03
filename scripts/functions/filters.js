import { selectedFilters } from "../search.js";



// Filter recipes by text query
export function filterRecipes(query, allRecipes) {
    const filteredRecipes = [];

    for (let i = 0; i < allRecipes.length; i++) {
        const recipe = allRecipes[i];
        const recipeName = recipe.name.toLowerCase();
        const recipeDescription = recipe.description.toLowerCase();
        
        let matches = false;
    
        // Check if `query` is contained in `recipeName`
        for (let i = 0; matches !== true && i <= recipeName.length - query.length; i++) {
            if (recipeName.substr(i, query.length) === query) {
                matches = true;
            }
        }
    
        // If `recipeName` does not contain `query`, check `recipeDescription`
        if (!matches) {
            for (let i = 0; matches !== true && i <= recipeDescription.length - query.length; i++) {
                if (recipeDescription.substr(i, query.length) === query) {
                    matches = true;
                }
            }
        }
    
        // If there are no matches in the name and description, we check the ingredients
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
    
        // Add filtered recipes
        if (matches) {
            filteredRecipes[filteredRecipes.length] = recipe;
        }
    }
    
    return filteredRecipes;
}

// Filter recipes by active tags
export function filterByAdditionalFilters(filteredRecipes) {
    const finalFilteredRecipes = [];  // Create an array to store matching recipes

    for (let i = 0; i < filteredRecipes.length; i++) {
        const recipe = filteredRecipes[i];

        // Check ingredients
        let ingredientMatch = selectedFilters.ingredients.length === 0;
        if (!ingredientMatch) {
            for (let j = 0; j < selectedFilters.ingredients.length; j++) {
                let ingredientFound = false;
                const filter = selectedFilters.ingredients[j];

                // Traverse all ingredients in the recipe
                for (let k = 0; k < recipe.ingredients.length && !ingredientFound; k++) {
                    if (recipe.ingredients[k].ingredient.toLowerCase() === filter) {
                        ingredientFound = true;
                    }
                }

                // If one of the filters is not found, the ingredientMatch should be false
                ingredientMatch = ingredientFound;
                if (!ingredientMatch) {
                    j = selectedFilters.ingredients.length;  // Stop further iterations in outer loop
                }
            }
        }

        // Check appliances
        let applianceMatch = selectedFilters.appliance.length === 0;
        if (!applianceMatch) {
            for (let j = 0; j < selectedFilters.appliance.length && !applianceMatch; j++) {
                if (recipe.appliance.toLowerCase() === selectedFilters.appliance[j]) {
                    applianceMatch = true;
                }
            }
        }

        // Check utensils
        let ustensilMatch = selectedFilters.ustensils.length === 0;
        if (!ustensilMatch) {
            for (let j = 0; j < selectedFilters.ustensils.length; j++) {
                let ustensilFound = false;
                const filterUstensil = selectedFilters.ustensils[j];

                // Traverse all utensils in the recipe
                for (let k = 0; k < recipe.ustensils.length && !ustensilFound; k++) {
                    if (recipe.ustensils[k].toLowerCase() === filterUstensil) {
                        ustensilFound = true;
                    }
                }

                // If one of the filters is not found, the ustensilMatch should be false
                ustensilMatch = ustensilFound;
                if (!ustensilMatch) {
                    j = selectedFilters.ustensils.length;  // Stop further iterations in outer loop
                }
            }
        }

        // If all conditions are met, add the recipe to the final array
        if (ingredientMatch && applianceMatch && ustensilMatch) {
            finalFilteredRecipes.push(recipe);
        }
    }

    return finalFilteredRecipes;  // Return the filtered recipes
}


