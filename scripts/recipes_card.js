import { recipes } from './recipes.js'; 

//create card's content
export function recipeCardElementDOM(recipe) {
    const card = document.createElement('article');
    card.classList.add('card');

    const cardPhoto = document.createElement('figure');
    cardPhoto.classList.add('card-photo');
    card.appendChild(cardPhoto);

    const img = document.createElement('img');
    img.setAttribute('src', `../assets/JSON_recipes/${recipe.image}`);
    cardPhoto.appendChild(img);

    const preparationTime = document.createElement('figcaption');
    cardPhoto.appendChild(preparationTime);

    const captionTitle = document.createElement('p');
    captionTitle.textContent = `${recipe.time}min`;
    preparationTime.appendChild(captionTitle);

    const cardContent = document.createElement('section');
    cardContent.classList.add('card-content');
    card.appendChild(cardContent);

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-content-title');
    cardTitle.textContent = `${recipe.name}`;
    cardContent.appendChild(cardTitle);

    const description = document.createElement('div');
    description.classList.add('card-content-recipe');
    cardContent.appendChild(description);

    const descriptionTitle = document.createElement('h3');
    descriptionTitle.textContent = 'RECETTE';
    description.appendChild(descriptionTitle);

    const recipeContent = document.createElement('p');
    recipeContent.textContent = `${recipe.description}`;
    description.appendChild(recipeContent);

    const ingredients = document.createElement('div');
    ingredients.classList.add('card-content-ingredients');
    cardContent.appendChild(ingredients);

    const ingredientsTitle = document.createElement('h3');
    ingredientsTitle.textContent = 'INGRÉDIENTS';
    ingredients.appendChild(ingredientsTitle);

    const ingredientsContent = document.createElement('div');
    ingredientsContent.classList.add('ingredients_section');
    ingredients.appendChild(ingredientsContent);
    
    recipe.ingredients.forEach(ingredient => {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('ingredients_element');
        ingredientsContent.appendChild(ingredientDiv);

        const ingredientName = document.createElement('p');
        ingredientName.classList.add('ingredient-name');
        ingredientName.textContent = ingredient.ingredient;
        ingredientDiv.appendChild(ingredientName);

        const ingredientQuantity = document.createElement('p');
        ingredientQuantity.classList.add('ingredient-quantity');
        ingredientQuantity.textContent = ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ''}` : '';
        ingredientDiv.appendChild(ingredientQuantity);
    });
    
    return card;
}

