let dropdownsInitialized = false;  // Global variable to track initialization state

// Get data from recipes
export function getRecipeData(recipes, dataExtractor) {
    return recipes.reduce((data, recipe) => {
        const extractedData = dataExtractor(recipe);
        return data.concat(Array.isArray(extractedData) ? extractedData : [extractedData]);
    }, []);
}

// Create dropdown list elements
export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = [...new Set(items)];  // Remove duplicate items
    const ulElement = document.getElementById(listElementId);

    ulElement.innerHTML = '';  // Clear the list before adding new elements

    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    // Set up the dropdown list
    setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId);
}

// Manage dropdown visibility (optimized version)
function setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId) {
    const dropdownBtn = document.getElementById(dropdownBtnId);
    const dropdownElement = document.getElementById(dropdownElementId);
    const arrowIcon = document.getElementById(arrowIconId);

    // Check if the event is already bound to the button
    if (!dropdownBtn.dataset.listenerAdded) {
        dropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleDropdown(dropdownElement, arrowIcon);
        });
        dropdownBtn.dataset.listenerAdded = 'true';
    }

    // Set up a global event handler for closing dropdowns on the first call
    if (!dropdownsInitialized) {
        document.addEventListener('click', (event) => {
            closeAllDropdowns(event);
        });
        dropdownsInitialized = true;  // Set the initialization flag
    }
}

// Toggle the dropdown menu (open/close)
function toggleDropdown(dropdownElement, arrowIcon) {
    const isDropdownOpen = dropdownElement.style.display === 'block';

    // Close all other dropdowns before opening a new one
    closeAllDropdowns();

    // Change the current menu state
    dropdownElement.style.display = isDropdownOpen ? 'none' : 'block';
    arrowIcon.classList.toggle('rotate', !isDropdownOpen);
}

// Close all dropdown menus
function closeAllDropdowns(event) {
    const dropdowns = document.querySelectorAll('.dropdown-content');
    const arrows = document.querySelectorAll('.rotate');

    dropdowns.forEach(dropdown => {
        if (!event || (dropdown !== event.target && !dropdown.contains(event.target))) {
            dropdown.style.display = 'none';
        }
    });

    // Reset all arrow icons
    arrows.forEach(arrow => arrow.classList.remove('rotate'));
}

// Function to clear input fields and reset the list of items
function setupClearInput() {
    const clearIcons = document.querySelectorAll('.clear-input');  // Find all clear icons

    clearIcons.forEach(icon => {
        icon.addEventListener('click', (event) => {
            const inputId = event.target.getAttribute('data-target');
            const inputElement = document.getElementById(inputId);
            const dropdownId = inputElement.parentElement.querySelector('ul').id;

            if (inputElement) {
                inputElement.value = '';

                // Show all list items
                const listItems = document.querySelectorAll(`#${dropdownId} li`);
                listItems.forEach(item => {
                    item.style.display = '';  // Reset the visibility of items
                });
            }
        });
    });
}

// Initialize the input fields clearing functionality
setupClearInput();
