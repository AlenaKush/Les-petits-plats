import { recipes } from './recipes.js'; 
import { recipeCardElementDOM } from './recipes_card.js';

//create card for every recipe
recipes.forEach(recipe => {
    const card = recipeCardElementDOM(recipe);
    document.querySelector('.recipes_section').appendChild(card);
});

const numberRecipes = document.getElementById('number_recipes');
const number = recipes.length;
numberRecipes.textContent = number + ' recettes';