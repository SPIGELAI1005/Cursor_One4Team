let currentMood = '';

document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentMood = button.dataset.mood;
        fetchRecipe(currentMood);
    });
});

document.getElementById('new-recipe').addEventListener('click', () => {
    fetchRecipe(currentMood);
});

async function fetchRecipe(mood) {
    try {
        const response = await fetch(`http://localhost:3000/api/recipes/${mood}`);
        const recipe = await response.json();
        displayRecipe(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
    }
}

function displayRecipe(recipe) {
    const recipeDisplay = document.getElementById('recipe-display');
    recipeDisplay.classList.remove('hidden');

    document.getElementById('recipe-name').textContent = recipe.name;
    document.getElementById('recipe-difficulty').textContent = `Difficulty: ${recipe.difficulty}`;
    document.getElementById('recipe-time').textContent = `Preparation Time: ${recipe.prep_time}`;
    document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
    document.getElementById('recipe-instructions').textContent = recipe.instructions;
} 