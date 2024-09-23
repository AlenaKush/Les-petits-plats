import { recipes } from './data/recipes.js'; 
import { createDropdownList, getRecipeData } from './functions/createDropdownList.js';
import { displayResults } from './search.js';


// Используем универсальную функцию для получения данных и создания списков
const ingredients = getRecipeData(recipes, recipe => recipe.ingredients.map(ing => ing.ingredient));
createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');

const appliances = getRecipeData(recipes, recipe => recipe.appliance);
createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');

const ustensils = getRecipeData(recipes, recipe => recipe.ustensils);
createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');

/*
// Получаем ингредиенты из рецептов
const ingredients = recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient));
createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');

// Получаем приборы из рецептов
const appliances = recipes.map(recipe => recipe.appliance);
createDropdownList(appliances, 'appliance-list', 'appliance-btn', 'appliance-dropdown', 'appliance-arrow');

// Получаем кухонную утварь из рецептов
const ustensils = recipes.flatMap(recipe => recipe.ustensils);
createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');
*/
displayResults(recipes);

