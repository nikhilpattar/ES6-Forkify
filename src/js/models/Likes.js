
export default class Likes{

    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, image){
        const like = {
            id,
            title,
            author,
            image
        }
        this.likes.push(like);

        //Persist like in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id){
        this.likes.splice(this.likes.findIndex(like => like.id === id), 1);

        //Persist like in localStorage
        this.persistData();
    }

    //To check whether element is liked or not
    isLiked(id){
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumberOfLikes() {
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    getPersistData(){
       const storedLikes = JSON.parse(localStorage.getItem('likes')); //JSON.parse convert backk to data structures
       if(storedLikes){
        this.likes = storedLikes;
       }
    }
}