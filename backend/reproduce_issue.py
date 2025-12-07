import urllib.request
import json

base_url = "http://127.0.0.1:8000"

# Check Root
try:
    print(f"Checking GET {base_url}/ ...")
    with urllib.request.urlopen(base_url) as response:
        print(f"Root Status: {response.getcode()}")
        print(f"Root Response: {response.read().decode('utf-8')}")
except Exception as e:
    print(f"Root Error: {e}")

# Check POST /api/user
url = f"{base_url}/api/user"
data = {
    "name": "Test User",
    "goal": "maintain",
    "restrictions": "none",
    "frequency": 3
}

try:
    print(f"Sending POST to {url}...")
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
