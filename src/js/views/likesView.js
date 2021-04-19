import {DomElements} from './base'
import {limitRecipeTitle} from './searchView';

export const toggleLikeButtton = isLiked =>{
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikesMenu = numberlikes =>{
    DomElements.likesMenu.style.visibility = numberlikes > 0 ? 'visible' : 'hidden';
};

export const displayLikes = like =>{
    const likeMarkup = 
    `<li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.image}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>`;
    DomElements.likesList.insertAdjacentHTML('beforeend', likeMarkup);
};

export const deleteLikes = id =>{
    const like = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    if(like)
        like.parentElement.removeChild(like);
};