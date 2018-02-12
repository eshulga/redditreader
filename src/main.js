const leftWrapper = document.getElementsByClassName('left');
const redditListWrapper = document.getElementById('list__wrapper');
const redditSearch = document.getElementById('search_reddit');
const postsListWrapper = document.getElementById('posts__wrapper');

const redditListTemplate = document.getElementById('list_reddits').innerHTML.trim();
const redditListCompiled = _.template(redditListTemplate);

const postsListTemplate = document.getElementById('list_posts').innerHTML.trim();
const postsListCompiled = _.template(postsListTemplate);

const postsPagination = document.getElementById('pagination');

const itemCount = 10;
let currentItemCount = itemCount;
let currentRedditName = '';


//get reddit items

const showPosts = () => {
    
    fetch('https://www.reddit.com/r/'+currentRedditName+'.json?include_over_18=false&limit=10')
    .then(result=>result.json())
    .then(result=>{

        const items = result.data.children

        postsListWrapper.innerHTML = '';
        postsListWrapper.innerHTML = postsListCompiled({items, currentItemCount, itemCount});
    })
}

//posts pagination

const nextPosts = (b) => {

    currentItemCount = currentItemCount + itemCount;
    
    fetch('https://www.reddit.com/r/'+currentRedditName+'.json?include_over_18=false&limit=10&count='+currentItemCount+'&after='+b.dataset.nextid)
    .then(result=>result.json())
    .then(result=>{

        const items = result.data.children
        postsListWrapper.innerHTML = '';
        postsListWrapper.innerHTML = postsListCompiled({items, currentItemCount, itemCount});
    })
}

const prevPosts = (b) => {
    
    currentItemCount = currentItemCount - itemCount;

    fetch('https://www.reddit.com/r/'+currentRedditName+'.json?include_over_18=false&limit=10&count='+currentItemCount+'&before='+b.dataset.previd)
    .then(result=>result.json())
    .then(result=>{
        console.log(result);
        const items = result.data.children
        postsListWrapper.innerHTML = '';
        postsListWrapper.innerHTML = postsListCompiled({items, currentItemCount, itemCount});
    })
}


//

redditListWrapper.addEventListener("click", event=>{
    
    if(event.target.classList.contains("reddit-link")){
        currentRedditName = event.target.dataset.name
        showPosts(currentRedditName);
    }
})


//get reddits by search

redditSearch.onkeydown = _.debounce(function(){
    if(this.value.length > 0){
        fetch('https://www.reddit.com/api/subreddit_autocomplete.json?include_over_18=false&query='+this.value)
        .then(result=>result.json())
        .then(result=>{

            const items = result.subreddits;

            redditListWrapper.innerHTML = '';

            if(items.length > 0) {
                redditListWrapper.innerHTML = redditListCompiled({items});
            } else {
                redditListWrapper.innerHTML = 'No results with '+this.value;
            }

        })
    } else {
        redditListWrapper.innerHTML = '';
        redditListWrapper.innerHTML = 'Try to type something :)';
    }

}, 500);

