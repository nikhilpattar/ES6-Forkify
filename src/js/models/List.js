import uniqid from 'uniqid';

export default class List{

    constructor(){
        this.items = [];
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient,
        }
        this.items.push(item);
        return item;
    }

    /**items[] = [(id, count, unit, ing), (id, count, unit, ing), .... ]
     * Here we have to calculate index of item based on id
     */
    deleteItem(id){
        this.items.splice(this.items.findIndex(item => item.id === id), 1);
    }

    updateCount(id, newCount) {
        this.items.find(item => item.id === id).count = newCount;
    }
}