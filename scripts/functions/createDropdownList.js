//get data
export function getRecipeData(recipes, dataExtractor) {
    return recipes.reduce((data, recipe) => {
        const extractedData = dataExtractor(recipe);
        return data.concat(Array.isArray(extractedData) ? extractedData : [extractedData]);
    }, []);
}


//create elements of dropdown list
export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
    const uniqueItems = [...new Set(items)];  // Convert Set back to array
    const ulElement = document.getElementById(listElementId); // Reference to the list item

    ulElement.innerHTML = '';

    uniqueItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulElement.appendChild(li);
    });

    setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId);
}


//manage visibility
export function setupDropdown(dropdownBtnId, dropdownElementId, arrowIconId) {
    const dropdownBtn = document.getElementById(dropdownBtnId);
    const dropdownElement = document.getElementById(dropdownElementId);
    const arrowIcon = document.getElementById(arrowIconId);

    dropdownBtn.addEventListener('click', function (event) {
        event.stopPropagation();  //Prevent closing when clicking a button
        
        if (dropdownElement.style.display === 'none' || dropdownElement.style.display === '') {
            dropdownElement.style.display = 'block';
            arrowIcon.classList.remove('rotate');
        } else {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });

    // Hide the dropdown when clicking outside its area
    document.addEventListener('click', function (event) {
        if (!dropdownElement.contains(event.target) && event.target !== dropdownBtn) {
            dropdownElement.style.display = 'none';
            arrowIcon.classList.add('rotate');
        }
    });
}

//function to clear input fields and reset the list of elements
function setupClearInput() {
    const clearIcons = document.querySelectorAll('.clear-input');  //Find all cleaning icons

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
                    item.style.display = '';  // Show all list items
                });
            }
        });
    });
}

setupClearInput();

