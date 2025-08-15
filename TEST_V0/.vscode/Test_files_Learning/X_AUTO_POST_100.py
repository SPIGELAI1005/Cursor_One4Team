import tweepy
import requests
from bs4 import BeautifulSoup
import time

# Replace with your X API credentials
API_KEY = '9OGo8JelOxImNc6wCLFFR7amJ'
API_SECRET = '85yKHWyIbdmDlXPAO4FbGW5JH33UZ0TQeva506FfzLrcsdFGkg'
ACCESS_TOKEN = '1860229415705202688-62jILOIfAl14LFsWzUceeVOyiZdCmK'
ACCESS_TOKEN_SECRET = 'qYyD2fhVjRHbpUxXYFlqJpV5takCyoWzfa42JNEiXq7BD'

# Authenticate with X API
auth = tweepy.OAuthHandler(API_KEY, API_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

def get_text_from_url(url):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Extract text from paragraphs
        paragraphs = soup.find_all('p')
        return [p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)]
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return []

# Scrape tweets from websites
urls = ["https://www.cofe-x.com", "https://www.cofe-x.com/whitepaper"]
tweets = []
for url in urls:
    tweets.extend(get_text_from_url(url))

def get_text_from_file(file_path):
    try:
        with open(file_path, 'r') as file:
            return file.readlines()  # Reads all lines in the file
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return []

    # Read tweets from local files
    file_paths = ["C:\Users\georg\OneDrive\Desktop\COFE_X\COFE_X_Website_HOME_X.docx", "C:\Users\georg\OneDrive\Desktop\COFE_X\COFE_X_Website_WHITEPAPER_X.docx"]  # Add your file paths here
    tweets = []
    for file_path in file_paths:
        tweets.extend(get_text_from_file(file_path))

# Limit tweets to 100 and truncate text to 280 characters (X character limit)
tweets = [tweet[:280] for tweet in tweets[:100]]

# Post tweets at regular intervals
interval = 24 * 60 * 60 / 100  # Calculate interval in seconds

for tweet in tweets:
    try:
        api.update_status(tweet)
        print(f"Tweeted: {tweet}")
        time.sleep(interval)  # Wait before posting the next tweet
    except tweepy.TweepError as e:
        print(f"Error: {e}")
        python3 --version

