import { recipes } from './recipes.js'; 

// Универсальная функция для создания выпадающих списков
function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = new Set(items);  // Создаем уникальный набор элементов
    const ulElement = document.getElementById(listElementId);  // Ссылка на элемент списка

    // Очищаем список перед добавлением новых элементов
    ulElement.innerHTML = '';

    // Добавляем элементы в список
    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    // Управление видимостью выпадающего меню по клику на кнопку
    const dropdownBtn = document.getElementById(dropdownBtnId);
    const dropdownElement = document.getElementById(dropdownElementId);
    const arrowIcon = document.getElementById(arrowIconId);


    // Проверяем текущее состояние и переключаем видимость при клике
    dropdownBtn.addEventListener('click', function() {
        if (dropdownElement.style.display === 'none') {
            dropdownElement.style.display = 'block';
            arrowIcon.classList.remove('rotate'); 
        } else {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });
}

// Получаем ингредиенты из рецептов
const ingredients = recipes.flatMap(recipe => recipe.ingredients.map(ing => ing.ingredient));
createDropdownList(ingredients, 'ingredients-list', 'ingredients-btn', 'ingredients-dropdown', 'ingredients-arrow');

// Получаем приборы из рецептов
const appliances = recipes.map(recipe => recipe.appliance);
createDropdownList(appliances, 'appliance-list', 'appareils-btn', 'appareils-dropdown', 'appliance-arrow');

// Получаем кухонную утварь из рецептов
const ustensils = recipes.flatMap(recipe => recipe.ustensils);
createDropdownList(ustensils, 'ustensils-list', 'ustensils-btn', 'ustensils-dropdown', 'ustensils-arrow');


/*
const uniqueIngredients = new Set();
recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredientObj => {
        uniqueIngredients.add(ingredientObj.ingredient);
    });
});
const ulIngredients = document.getElementById('ingredients-list');
uniqueIngredients.forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    ulIngredients.appendChild(li);
});
const ingredientsBtn = document.getElementById('ingredients-btn');
const dropdownIngredients = document.getElementById('ingredients-dropdown');
ingredientsBtn.addEventListener('click', function() {
    if (dropdownIngredients.style.display === 'none') {
        dropdownIngredients.style.display = 'block';
    } else {
        dropdownIngredients.style.display = 'none';
    }
});

const uniqueAppliance = new Set();
recipes.forEach(recipe => {
    uniqueAppliance.add(recipe.appliance);
});
const ulAppliance = document.getElementById('appliance-list');
uniqueAppliance.forEach(appliance => {
    const li = document.createElement('li');
    li.textContent = appliance;
    ulAppliance.appendChild(li);
});
const applianceBtn = document.getElementById('appareils-btn');
const dropdownAppliance = document.getElementById('appareils-dropdown');
applianceBtn.addEventListener('click', function() {
    if (dropdownAppliance.style.display === 'none') {
        dropdownAppliance.style.display = 'block';
    } else {
        dropdownAppliance.style.display = 'none';
    }
});

const uniqueUstensils = new Set();
recipes.forEach(recipe => {
    recipe.ustensils.forEach(ustensilsObj => {
        uniqueUstensils.add(ustensilsObj);
    });
});
const ulUstensils = document.getElementById('ustensils-list');
uniqueUstensils.forEach(ustensils => {
    const li = document.createElement('li');
    li.textContent = ustensils;
    ulUstensils.appendChild(li);
});
const ustensilsBtn = document.getElementById('ustensils-btn');
const dropdownUstensils = document.getElementById('ustensils-dropdown');
ustensilsBtn.addEventListener('click', function() {
    if (dropdownUstensils.style.display === 'none') {
        dropdownUstensils.style.display = 'block';
    } else {
        dropdownUstensils.style.display = 'none';
    }
});*/




/*
export function createSearchButton(buttonName, listElements) {
    const searchButton = document.createElement('div');

    const button = document.createElement('button');
    button.classList.add('dropdown-button');
    button.textContent = buttonName;
    searchButton.appendChild(button);

    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown-content');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    dropdown.appendChild(input);

    const list = document.createElement('ul');
    list.classList.add('dropdown-list');
    dropdown.appendChild(list);
    
    const uniqueElements = new Set();

    
}*/


