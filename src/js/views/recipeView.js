import {DomElements} from './base'

const createAndDisplayIngredients = ingredient =>
    `<li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${convertNumbers(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>`;


export const displayRecipe = (recipe, isLiked) =>{
    const recipeMarkup = `
    <figure class="recipe__fig">
        <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
        <h1 class="recipe__title">
            <span>${recipe.title}</span>
        </h1>
    </figure>
    <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-stopwatch"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookTime}</span>
            <span class="recipe__info-text"> minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="img/icons.svg#icon-man"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
            <span class="recipe__info-text"> servings</span>

            <div class="recipe__info-buttons">
                <button class="btn-tiny btn_decrement">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-minus"></use>
                    </svg>
                </button>
                <button class="btn-tiny btn_increment">
                    <svg>
                        <use href="img/icons.svg#icon-circle-with-plus"></use>
                    </svg>
                </button>
            </div>

        </div>
        <button class="recipe__love">
            <svg class="header__likes">
                <use href="img/icons.svg#icon-heart${isLiked ? '': '-outlined'}"></use>
            </svg>
        </button>
    </div>



    <div class="recipe__ingredients">
        <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(current => createAndDisplayIngredients(current)).join('')} 
        </ul>

        <button class="btn-small recipe__btn recipe__shopping-list">
            <svg class="search__icon">
                <use href="img/icons.svg#icon-shopping-cart"></use>
            </svg>
            <span>Add to shopping list</span>
        </button>
    </div>

    <div class="recipe__directions">
        <h2 class="heading-2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
        </p>
        <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
            <span>Directions</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-right"></use>
            </svg>

        </a>
    </div>`;
    DomElements.recipePage.insertAdjacentHTML('afterbegin', recipeMarkup);
}

export const clearRecipe = () =>{
    DomElements.recipePage.innerHTML = "";
};

//We can use either this or just third party package that does same work for us i.e. fractional
const convertNumbers = num =>{
    // Nikhil code
    
    /* if(num){
        let floorNumber = Math.floor(num);
        let decimal = num - floorNumber;
        if(floorNumber === 0)
            floorNumber = '';

        let newNum = 0;
        if(decimal >= 0 && decimal <= 0.13){
            newNum = floorNumber;
        }else if(decimal > 0.13 && decimal <= 0.38 ){
            newNum = floorNumber + ' 1/4';
        }else if(decimal > 0.38 && decimal <= 0.63 ){
            newNum = floorNumber + ' 1/2';
        }else if(decimal > 0.63 && decimal <= 0.88 ){
            newNum = floorNumber + ' 3/4';
        }if(decimal > 0.88){
            newNum = floorNumber + 1;
        }
        return newNum;
    }
    return '?'; */

    //Jonas code doesn't work that good but returns integer which helps further in serrvings
    if(num){
        //const newNum = Math.round(num * 10000) / 10000;
        const [int, dec] = num.toString().split('.').map(el => parseInt(el, 10));
    
        if(!dec)
            return num;
        
        if(int === 0){
            const frac = new Fraction(num);
            return `${frac.numerator}/${frac.denominator}`
        }else{
            const frac = new Fraction(num - int);
            return `${int} ${frac.numerator}/${frac.denominator}`
        }
    }
    return '?';
};

// Update only servings and ingredient count but not whole recipe using displayRecipe function
export const updateServingsAndIngredients = recipe =>{
    //Update servings
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    //Update Ingredients
    const ingArr = Array.from(document.querySelectorAll('.recipe__count'))
    ingArr.forEach((count, index) =>{
        count.textContent = convertNumbers(recipe.ingredients[index].count);
    });
}