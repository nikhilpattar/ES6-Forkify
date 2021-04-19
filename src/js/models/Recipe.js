import axios from 'axios';
import {Fraction} from 'fractional';

export default class Recipe{

    constructor(recipeId){
        this.recipeId = recipeId;
    }

    async getRecipeDetails(){
        try {
            const item = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.recipeId}`);
            this.title = item.data.recipe.title;
            this.author = item.data.recipe.publisher;
            this.image = item.data.recipe.image_url;
            this.url = item.data.recipe.source_url;
            this.ingredients = item.data.recipe.ingredients;
        } catch (error) {
            alert(error);
        }
    }

    //In recipe section there is cook time for each recipe, assuming 15minutes for 3 ingredients
    recipeCookTime(){
        const totalIngredients = this.ingredients.length;
        const periods = Math.ceil(totalIngredients / 3);

        this.cookTime = periods * 15;
    }

    servingsCalc(){
        this.servings = 4;
    }

    //Here type is either increment or decrement
    updateServings(type){
        // Servings
        const newServings = type === 'dec'? this.servings - 1: this.servings + 1;
        
        // Ingredients based on servings
        this.ingredients.forEach(ingredient =>{
            ingredient.count *= (newServings/this.servings);
        });

        this.servings = newServings;
    }
    
    parseIngredients(){
        const actualUnit = ['teaspoons', 'teaspoon', 'ounces', 'ounce', 'tablespoons', 'tablespoon', 'cups', 'pounds'];
        const expectedUnit = ['tsp', 'tsp', 'oz', 'oz', 'tbsp', 'tbsp', 'cup', 'pound'];
        const finalUnit = [...expectedUnit, 'g', 'kg'];

        const properIngrdients = this.ingredients.map(current =>{
            //1. Uniform units i.e. Tablesppon instead of Tbps, 
            let ingredient = current.toLowerCase();
            actualUnit.forEach((current, index) =>{
                ingredient = ingredient.replace(current, expectedUnit[index]);
            });

            //2. Remove whole parenthesis part, Eg: "2 jars (13 Ounces Each) Marshmallow Creme"
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3. Display like, Count - Unit - Ingredient
            const ingredientArray = ingredient.split(' '); //considering each word
            const unitIndex = ingredientArray.findIndex(element => finalUnit.includes(element));
            
            let objIng;
            if(unitIndex > -1){
                // There is unit in ingredient
                /* 4 1/2 cup of berries, here unitArray will be [4, 1/2]
                   1 tsp sugar, here unitArray will be [1]
                   1-1/3 cup of cherries, here unitArray will be [1-1/3] */
                const unitArray = ingredientArray.slice(0, unitIndex);
                let count;
                if(unitArray.length === 1){
                    count = eval(unitArray[0].replace('-','+'));
                }else if(unitArray.length === 2){
                    count = eval(unitArray[0]+'+'+unitArray[1]);
                }
                //My code for 1-1/3, jonas included same in if statement
                /* else if(unitArray.length === 1){
                    unitArray[0] = unitArray[0].replace('-', '+');
                    count = eval(unitArray[0]);
                    console.log('else if 2');
                } */
                objIng = {
                    count,
                    unit: ingredientArray[unitIndex],
                    ingredient: ingredientArray.slice(unitIndex + 1).join(' ')
                }
            }else if(parseInt(ingredientArray[0], 10) || parseInt(ingredientArray[1], 10)){
                // There is no unit but a number like, Eg: 1 Bread, 2 Eggs
                let number = ingredient[0]+ingredient[1];
                objIng = {
                    count: parseInt(number, 10), // what in case if number is two decimals 
                    unit: ' ',
                    ingredient: ingredient.slice(1)
                };
            }else if(unitIndex === -1){
                // There is no unit and number in ingredient
                objIng = {
                    count: 1,
                    unit: ' ',
                    ingredient 
                };
            }
            //4. Return proper ingredient
            return objIng;
        });

        this.ingredients = properIngrdients;
    }
}