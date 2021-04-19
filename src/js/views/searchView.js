import {DomElements} from './base'

export const getInput = () => DomElements.searchInput.value;

/* Here we are not returning anything so better place it in braces, because arrow function implicitly returns values
as mentioned in getInput function */
export const clearInput = () =>{
     DomElements.searchInput.value = "";
};

export const clearResults = () =>{
    DomElements.serchResultsList.innerHTML = "";
    DomElements.searchResultsPage.innerHTML = "";
};
// results__link--active
const filterRecipes = (recipes) => {
    const markUp = ` 
        <li>
            <a class="results__link" href="#${recipes.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipes.image_url}" alt="${recipes.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipes.title)}</h4>
                    <p class="results__author">${recipes.publisher}</p>
                </div>
            </a>
        </li>`;
    DomElements.serchResultsList.insertAdjacentHTML('beforeend', markUp);
};

//Data here in HTML helps us to determine which page to navigate through
const createButton = (page, type) =>  `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
        <span>Page ${type === 'prev' ? page - 1: page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
    </button>
    `;

const searchPageButtons = (page, numberOfResults, resultsPerPage) => {
    const totalPages = Math.ceil(numberOfResults/resultsPerPage); //'floor' is rounding down, but have to use rounding up 'ceil' 
    let buttonMarkup;
    /* Here button will be havinh markup that will appended in html using inserAdjacentHTML method
    creating template as in else, its just HTML 
    <button>
    </button>
    <button>
    </button> */     
    if(page === 1 && totalPages > 1){
        //Only one button to next page
        buttonMarkup = createButton(page, 'next');
    }else if (page === totalPages && totalPages > 1){
        //Only one button to prior page
        buttonMarkup = createButton(page, 'prev');
    }else{
        //Two buttons to prior and next page
        buttonMarkup = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    //afterbegin because buttons having separate class/ node
    DomElements.searchResultsPage.insertAdjacentHTML('afterbegin', buttonMarkup);
};


export const filterResults = (recipes, page = 1, resultsPerPage = 10) => {
    
    //Display recipes on search results page
    /* recipes.forEach(el => {
        filterRecipes(el);
    }); */
    // Instead just declare function name, foreach calls function with each element of recipe passed as argument
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(filterRecipes);

    //Display page buttons on search results page
    searchPageButtons(page, recipes.length, resultsPerPage);
};

export const limitRecipeTitle = (recipeTitle, limit = 17) => {
    let newTitle = '';
    let charArray = recipeTitle.split('');

    if(recipeTitle.length > limit){
        for(let i = 0;i < limit;i++){
            newTitle = newTitle + charArray[i];
        }
        newTitle = newTitle + '...';
    } else{
        newTitle = recipeTitle;
    }
    
    return newTitle;    
};

export const highLightSelected = id =>{
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el =>{
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};