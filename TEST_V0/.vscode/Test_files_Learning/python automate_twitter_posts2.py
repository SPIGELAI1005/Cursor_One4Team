# pip install tweepy openai beautifulsoup4 requests
C:\Users\georg\AppData\Local\Programs\Python\Python36-32\Scripts>pip install requests
import time
import requests
from bs4 import BeautifulSoup
import openai
import tweepy

# === Step 1: Configure API Keys ===
# OpenAI API Key
openai.api_key = "sk-proj-4AQivqlF89pqgyeidz8BlN7RA"

# Twitter API Credentials
api_key = "4AQivqlF89pqgyeidz8BlN7RA"
api_secret = "aNrmooTDnh2X0LzqxerUk73XFOYoQIC0wWfvRGRHo7OHMXqxem"
access_token = "1860229415705202688-cIEImPOy0uEFLGTe8I0QxfHVrVSrKR"
access_token_secret = "o2YHNAjr3qfY15hz4xYsAtLlm5vsjz7JiCj0rEf88rgi"

# === Step 2: Authenticate with Twitter ===
def authenticate_twitter(api_key, api_secret, access_token, access_token_secret):
    auth = tweepy.OAuth1UserHandler(api_key, api_secret, access_token, access_token_secret)
    return tweepy.API(auth)

twitter_api = authenticate_twitter(api_key, api_secret, access_token, access_token_secret)

# === Step 3: Scrape Content from Website ===
def fetch_website_content(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        # Example: Extract headlines or paragraph content
        articles = [tag.text.strip() for tag in soup.find_all('h2')][:10]  # Limit to top 10 headlines
        return articles
    except requests.exceptions.RequestException as e:
        print(f"Error fetching website content: {e}")
        return []

# === Step 4: Generate Tweets Using ChatGPT ===
def generate_tweet(content):
    try:
        prompt = f"Create a short, engaging tweet based on this content: '{content}'"
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=50
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error generating tweet: {e}")
        return None

# === Step 5: Post Tweet to Twitter ===
def post_tweet(twitter_api, tweet):
    try:
        twitter_api.update_status(tweet)
        print(f"Tweet posted: {tweet}")
    except tweepy.TweepError as e:
        print(f"Error posting tweet: {e}")

# === Main Loop ===
if __name__ == "__main__":
    website_url = "https://cofe-x.com"  # Replace with the target website URL
    post_interval = 14 * 60  # 14 minutes in seconds

    while True:
        print("Fetching website content...")
        content_list = fetch_website_content(website_url)

        for content in content_list:
            print("Generating tweet...")
            tweet = generate_tweet(content)

            if tweet:
                print("Posting tweet...")
                post_tweet(twitter_api, tweet)

            print(f"Waiting {post_interval // 60} minutes before the next post...")
            time.sleep(post_interval)
