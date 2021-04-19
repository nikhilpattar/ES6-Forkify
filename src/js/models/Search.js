import axios from 'axios';

export default class Search{

    constructor(query){
        this.query = query;
    }

    async getRecipe(){
        try{
            const lists = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.recipes = lists.data.recipes;
        }catch(error){
            alert(error);
        }
    }
}