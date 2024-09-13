// Универсальная функция для создания выпадающих списков
export function createDropdownList(items, listElementId, dropdownBtnId, dropdownElementId, arrowIconId) {
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