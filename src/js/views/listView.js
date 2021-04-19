import {DomElements} from './base'

export const displayItem = item =>{
    const listMarkup = `
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count">
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`;
    DomElements.shoppingList.insertAdjacentHTML('beforeend', listMarkup);
};

export const clearShoppingList = () =>{
    DomElements.shoppingList.innerHTML = "";
};

export const deleteItem = id =>{
    const item = document.querySelector(`[data-itemid="${id}"]`);
    if(item)
        item.parentNode.removeChild(item);
};