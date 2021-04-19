// Global controller that includes all event listeners

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import {DomElements, loadSpinner, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView'

/**Global state of the app 
 * Search object
 * Current Reccipe Object
 * Shopping List Object 
 * Liked Recipes
*/

const state = {};

/**
 * Search Controller
 */
const controlSearch = async () =>{
    // 1. Get userInput from the search tab
    const userInput = searchView.getInput();
    
    if(userInput){
        // 2. Create Search object in state
        state.search = new Search(userInput);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        loadSpinner(DomElements.results);
        try{ 
            //4. Search for recipes
            await state.search.getRecipe();

            //5. Disply results on UI
            clearLoader();
            searchView.filterResults(state.search.recipes);
        }catch(error){
            alert(error);
            clearLoader();
        }
    }
}

DomElements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});

DomElements.searchResultsPage.addEventListener('click', e => {
    const buttonClosest = e.target.closest('.btn-inline')
    if(buttonClosest){
        //buttonClosest.dataset.goto returns value that's the page we have to navigate to
        const pageToNavigate = buttonClosest.dataset.goto;
        searchView.clearResults();
        searchView.filterResults(state.search.recipes, parseInt(pageToNavigate));
    }
    
});

/**
 * Recipe Controller
 */
const controlRecipe = async () =>{
    //1. Get the hash availballe in page URL, which represents recipe ID
    const id = window.location.hash.replace('#', '');
    if(id){
        //2a. Prepare UI for changes
        recipeView.clearRecipe();
        loadSpinner(DomElements.recipePage);

        //2b. Highlight selected 
        if(state.search){  
            searchView.highLightSelected(id);
            console.log('search will be highlighted');
        }

        //3. Create reccipe object and add it to state object
        state.recipe = new Recipe(id);

        //4. Get recipe data - here getting specific reccipe detail may result in failure/forbidden hence try/catch
        try {
            await state.recipe.getRecipeDetails();   

            //5. Calculate servings and time
            state.recipe.parseIngredients();
            state.recipe.recipeCookTime();
            state.recipe.servingsCalc();

            //6. Disply recipe details on UI
            clearLoader();
            recipeView.displayRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            alert(error);
        }
        
    }
};

/**
 * List Controller
 */
const controlList = () =>{
    listView.clearShoppingList();

    //1. Create new List IF there is none yet
    if(!state.list)
        state.list = new List();
    
    //2. Add each ingredient to list
    state.recipe.ingredients.forEach(ing =>{
        const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
        listView.displayItem(item);
    });    
};

//Restore liked recipes when page loads
window.addEventListener('load', () =>{

    //1. Create Likes if there is no like in state variable
    if(!state.likes){
        state.likes = new Likes();
    }

    //2. Restore storage
    state.likes.getPersistData();

    //3. Toggle like menu button
    likesView.toggleLikesMenu(state.likes.getNumberOfLikes());

    //4. Disply recipes
    state.likes.likes.forEach(like =>{
        likesView.displayLikes(like);
    });
});

/**
 * Like Controller
 */
const controlLike = () =>{
    
    //1. Create Likes if there is no like in state variable
    /* if(!state.likes)
        state.likes = new Likes(); */

    //2. Check if recipe is already liked or not
    const currentId = state.recipe.recipeId;

    if(state.likes.isLiked(currentId)){
        // Remove like to likes array
        state.likes.deleteLike(currentId);
        // Toggle like heart button
        likesView.toggleLikeButtton(false);

        // Remove like from UI list
        likesView.deleteLikes(currentId);
    } else{
        // Add like to likes array
        const newLike = state.likes.addLike(currentId, state.recipe.title, state.recipe.author, state.recipe.image);
        
        // Toggle like heart button
        likesView.toggleLikeButtton(true);

        // Add like to UI list
        likesView.displayLikes(newLike);
    }
    likesView.toggleLikesMenu(state.likes.getNumberOfLikes());

}

// Handle delete and update list
DomElements.shoppingList.addEventListener('click', event =>{

    //1. Get the id of item to be deleted
    const id = event.target.closest('.shopping__item').dataset.itemid;
    
    //2. If matches button then delete item
    if(event.target.matches('.shopping__delete, .shopping__delete *')){
        // a. delete from List object
        state.list.deleteItem(id);

        // b. delete from UI
        listView.deleteItem(id);
    }else if(event.target.matches('.shopping__count, .shopping__count *')){
        // Count value can be increased in UI using up&dwon arrow keys bbut same needed to be updated in List object
        if(event.target.value > 0)
        {
            const countValue = parseFloat(event.target.value, 10);
            state.list.updateCount(id, countValue);
        }
    }
});

/* 'load' helps when user save the page as bookmark, when he comesback, he shouuuld be able to see page
    instead of blank screen

window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe);
 */
// Here 'event' is same as 'current' array element
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling serving button clicks
DomElements.recipePage.addEventListener('click', event =>{
    if(event.target.matches('.btn_decrement, .btn_decrement *')){
        //Decrese button is clicked, update servings accordingly
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
        }
    }else if(event.target.matches('.btn_increment, .btn_increment *')){
        //Increase button is clicked, update servings accordingly
        state.recipe.updateServings('inc');
    }else if(event.target.matches('.recipe__shopping-list, .recipe__shopping-list *')){
        controlList();
    }else if(event.target.matches('.recipe__love, .recipe__love *')){
        // Create like variable in state
        controlLike();
    }

    // Update servings and Ingredients count on UI
    recipeView.updateServingsAndIngredients(state.recipe);
});
