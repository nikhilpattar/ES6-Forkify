export const DomElements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    serchResultsList: document.querySelector('.results__list'),
    results: document.querySelector('.results'),
    searchResultsPage: document.querySelector('.results__pages'),
    recipePage: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
}

export const loadSpinner = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>    
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
        `;
   parent.insertAdjacentHTML('afterbegin', loader);    
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentNode.removeChild(loader);

};