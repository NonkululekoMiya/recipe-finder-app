const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

const hamburger = document.getElementById('hamburger');
const navigationLinks = document.querySelector('.navigation-links');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

hamburger.addEventListener('click', () => {
    navigationLinks.classList.toggle('show');
});

// get meal list that matches with the ingredients
function getMealList() {
    let SearchInputTxt = document.getElementById('search-input').value.trim();

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${SearchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                <div class="recipe-item" data-id="${meal.idMeal}">
                    <div class="recipe-image">
                        <img src="${meal.strMealThumb}" alt="food display">
                    </div>
                    <div class="recipe-title">
                        <a href="#" class="recipe-link"><h3>${meal.strMeal}</h3></a>
                    </div>
                </div>
                `;
            });
            mealList.classList.remove('notFound')
        } else {
            html = "Sorry, we didn't find any recipe!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    })
    .catch(error => {
        html = "An error occurred while fetching the data.";
        console.error('Error fetching data:', error);
    });
}

// get recipe of the meal
function getMealRecipe(e) {
    e.preventDefault();
    if(e.target.classList.contains('recipe-link') || e.target.tagName === 'H3') {
        let mealItem = e.target.closest('.recipe-item');
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];

    let ingredients = []; //ingredients array
    for (let i=1; i <=20; i++) {
        const ingredient = meal[`strIngredient${i}`]; // all ingredients
        const measure = meal[`strMeasure${i}`]; //ingredient measurements

       if (ingredient) {
           ingredients.push(`${ingredient} - ${measure}`); // add to the ingredients array
        }
    }

    let ingredientsHtml = ingredients.map(item => `<li class="ingredients-list">${item}</li>`).join('');

// extracting video ID from the YouTube URL
    const videoId = meal.strYoutube.split('v=')[1];
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition); // Removing any extra parameters
    }

    let html = `
        <a href="${meal.strSource}" class="source-link" target="_blank"><h3 class="meal-title">${meal.strMeal}</h3></a>
        <p class="recipe-category">Category: ${meal.strCategory || 'Unknown Category'}</p>
        <p class="recipe-cuisine">Cuisine: ${meal.strArea || 'Unknown Cuisine'}</p>
         <div class="recipe-details-wrapper">
            <div class="recipe-instruct">
                <h3>Ingredients</h3>
                <ul class="ingredients-list">${ingredientsHtml}</ul>
                <h3>Instructions</h3>
                <p>${meal.strInstructions}</p>
            </div>
        </div>        
            <div class="recipe-link-video">
                <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}