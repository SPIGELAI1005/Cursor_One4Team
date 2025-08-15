import httpx
import json
import os

# API endpoint
url = "https://api.x.ai/v1/chat/completions"

# Get API key from environment variable
api_key = os.getenv('XAI_API_KEY')
if not api_key:
    raise ValueError("Please set the XAI_API_KEY environment variable")

# Headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

# Load request body from JSON file
with open('Untitled-3.json', 'r') as f:
    request_body = json.load(f)

try:
    # Make the API call with stream=True
    with httpx.stream("POST", url, headers=headers, json=request_body) as response:
        response.raise_for_status()
        for line in response.iter_bytes():
            if line:
                # Process each chunk of the streaming response
                print(json.loads(line.decode()))

except httpx.RequestError as e:
    print(f"Error making API call: {e}")
