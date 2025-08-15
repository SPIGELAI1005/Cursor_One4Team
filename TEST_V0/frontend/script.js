let currentMood = '';

document.querySelectorAll('.mood-btn').forEach(button => {
    button.addEventListener('click', () => {
        currentMood = button.dataset.mood;
        debouncedFetchRecipe(currentMood);
    });
});

document.getElementById('new-recipe').addEventListener('click', () => {
    debouncedFetchRecipe(currentMood);
});

async function fetchRecipe(mood) {
    try {
        displayLoading();
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch(`http://localhost:3000/api/recipes/${mood}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recipe');
        }

        const recipe = await response.json();
        displayRecipe(recipe);
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoading();
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

// Add debouncing for API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedFetchRecipe = debounce(fetchRecipe, 300);

// Add loading states
function displayLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.innerHTML = `
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00B4D8]"></div>
    `;
    document.getElementById('recipe-display').appendChild(loadingDiv);
}

// Add error display
function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded';
    errorDiv.textContent = message;
    document.getElementById('recipe-display').appendChild(errorDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
} 