import tweepy
import os
import time
from dotenv import load_dotenv

# Load API credentials from .env
load_dotenv()

API_KEY = os.getenv("API_KEY")
API_SECRET = os.getenv("API_SECRET")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
ACCESS_SECRET = os.getenv("ACCESS_SECRET")
BEARER_TOKEN = os.getenv("BEARER_TOKEN")

# Authenticate with Twitter API
auth = tweepy.OAuth1UserHandler(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET)
api = tweepy.API(auth, wait_on_rate_limit=True)

# Keywords to search in timeline tweets
morning_keywords = ["GM", "Good Morning"]
night_keywords = ["GN", "Good Night", "Good Evening"]

# Auto-reply messages
morning_reply = "Good Morning! I hope you have a successfully day!\nLooking forward to connect. Thank you! ☀️"
night_reply = "Good Night! I hope you had a successful day!\nLooking forward to connect. Thank you! 🌙"

# Function to check tweets in home timeline and reply
def auto_reply():
    print("Checking timeline tweets...")
    
    try:
        tweets = api.home_timeline(count=20, tweet_mode="extended")  # Fetch recent tweets from timeline
        
        for tweet in tweets:
            tweet_text = tweet.full_text.lower()
            username = tweet.user.screen_name
            
            if any(keyword.lower() in tweet_text for keyword in morning_keywords):
                reply_text = f"@{username} {morning_reply}"
            elif any(keyword.lower() in tweet_text for keyword in night_keywords):
                reply_text = f"@{username} {night_reply}"
            else:
                continue  # Skip tweets that don't match
            
            try:
                print(f"Replying to @{username}: {reply_text}")
                api.update_status(status=reply_text, in_reply_to_status_id=tweet.id)
                time.sleep(15)  # Prevent rate limiting
            except tweepy.TweepyException as e:
                print(f"Error replying: {e}")
    
    except tweepy.TweepyException as e:
        print(f"Error fetching timeline: {e}")

# Run the bot continuously
while True:
    auto_reply()
    time.sleep(60)  # Check for new tweets every minute
