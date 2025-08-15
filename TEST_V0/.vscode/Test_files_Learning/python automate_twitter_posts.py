import tweepy
import requests
from bs4 import BeautifulSoup
import time

# Replace with your X API credentials
API_KEY = '9OGo8JelOxImNc6wCLFFR7amJ'
API_SECRET = '85yKHWyIbdmDlXPAO4FbGW5JH33UZ0TQeva506FfzLrcsdFGkg'
ACCESS_TOKEN = '1860229415705202688-tfNhYiT1Xr7pO0dLg8JbpxrOeUKEIH'
ACCESS_TOKEN_SECRET = 'msk5Slkj05pomyBljcgGH7kj3IqRgpmxexcSrhl8kdm4F'

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