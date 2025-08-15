import random

class MoodRecipeRecommender:
    def __init__(self):
        self.recipes = {
            'happy': [
                {'name': 'Colorful Buddha Bowl', 'difficulty': 'Medium', 'prep_time': '25 mins'},
                {'name': 'Fresh Summer Salad', 'difficulty': 'Easy', 'prep_time': '15 mins'},
                {'name': 'Rainbow Smoothie Bowl', 'difficulty': 'Easy', 'prep_time': '10 mins'}
            ],
            'sad': [
                {'name': 'Comforting Mac and Cheese', 'difficulty': 'Easy', 'prep_time': '30 mins'},
                {'name': 'Warm Chocolate Chip Cookies', 'difficulty': 'Medium', 'prep_time': '25 mins'},
                {'name': 'Creamy Tomato Soup', 'difficulty': 'Easy', 'prep_time': '20 mins'}
            ],
            'stressed': [
                {'name': 'Calming Chamomile Tea Cake', 'difficulty': 'Medium', 'prep_time': '45 mins'},
                {'name': 'Easy One-Pot Pasta', 'difficulty': 'Easy', 'prep_time': '20 mins'},
                {'name': 'Lavender Shortbread', 'difficulty': 'Medium', 'prep_time': '35 mins'}
            ],
            'energetic': [
                {'name': 'Protein-Packed Quinoa Bowl', 'difficulty': 'Medium', 'prep_time': '30 mins'},
                {'name': 'Energy Balls', 'difficulty': 'Easy', 'prep_time': '15 mins'},
                {'name': 'Green Power Smoothie', 'difficulty': 'Easy', 'prep_time': '5 mins'}
            ]
        }

    def get_recipe_recommendation(self, mood):
        mood = mood.lower()
        if mood in self.recipes:
            return random.choice(self.recipes[mood])
        return None

def main():
    recommender = MoodRecipeRecommender()
    
    print("Welcome to Mood Recipe Recommender!")
    print("\nHow are you feeling today?")
    print("Options: happy, sad, stressed, energetic")
    
    while True:
        mood = input("\nEnter your mood (or 'quit' to exit): ").strip()
        
        if mood.lower() == 'quit':
            print("Thank you for using Mood Recipe Recommender!")
            break
            
        recipe = recommender.get_recipe_recommendation(mood)
        
        if recipe:
            print("\n🍳 Based on your mood, we recommend:")
            print(f"Recipe: {recipe['name']}")
            print(f"Difficulty: {recipe['difficulty']}")
            print(f"Preparation Time: {recipe['prep_time']}")
        else:
            print("\nSorry, I don't have any recipes for that mood.")
            print("Please choose from: happy, sad, stressed, or energetic")

if __name__ == "__main__":
    main() 