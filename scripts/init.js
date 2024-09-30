import { recipes } from './data/recipes.js'; 
import { createDropdownList, getRecipeData } from './functions/createDropdownList.js';
import { displayResults } from './search.js';


// Use a generic function to get data and create lists
const ingredients = getRecipeData(recipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');

const appliances = getRecipeData(recipes, recipe => recipe.appliance);
createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');

const ustensils = getRecipeData(recipes, recipe => recipe.ustensils);
createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');


displayResults(recipes);

