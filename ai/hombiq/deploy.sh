#!/bin/bash
# Deploy script for Hombiq - removes API key before pushing to GitHub

# Store the API key in a local file that won't be committed
API_KEY_FILE=".api_key_backup"

echo "🔐 Backing up and removing API key from code..."

# Extract and save the current API key
grep "this.openaiApiKey = " script.js | sed "s/.*this.openaiApiKey = '\(.*\)';.*/\1/" > "$API_KEY_FILE"

# Remove the API key
sed -i '' "s/this.openaiApiKey = 'sk-proj-[^']*';.*/this.openaiApiKey = ''; \/\/ Add your key here ONLY for local testing/" script.js
sed -i '' "s/this.openaiApiKey = '[^']*'; \/\/ LOCAL TESTING ONLY/this.openaiApiKey = ''; \/\/ Add your key here ONLY for local testing/" script.js
sed -i '' "s/this.openaiApiKey = '[^']*'; \/\/ TODO.*/this.openaiApiKey = ''; \/\/ Add your key here ONLY for local testing/" script.js

echo "📦 Staging changes..."
git add script.js styles.css index.html

echo "💬 Enter commit message:"
read commit_message

if [ -z "$commit_message" ]; then
    echo "❌ Commit message cannot be empty. Aborting."
    # Restore API key
    if [ -f "$API_KEY_FILE" ]; then
        API_KEY=$(cat "$API_KEY_FILE")
        sed -i '' "s/this.openaiApiKey = ''; \/\/ Add your key here ONLY for local testing/this.openaiApiKey = '$API_KEY'; \/\/ LOCAL TESTING ONLY/" script.js
        rm "$API_KEY_FILE"
    fi
    exit 1
fi

echo "📝 Committing..."
git commit -m "$commit_message"

echo "🚀 Pushing to GitHub..."
git push

echo "🔑 Adding API key back for local development..."

# Read the saved API key and restore it
if [ -f "$API_KEY_FILE" ]; then
    API_KEY=$(cat "$API_KEY_FILE")
    sed -i '' "s/this.openaiApiKey = ''; \/\/ Add your key here ONLY for local testing/this.openaiApiKey = '$API_KEY'; \/\/ LOCAL TESTING ONLY/" script.js
    rm "$API_KEY_FILE"
fi

echo "✅ Done! Your code is on GitHub and your local API key is restored."
