#!/bin/bash
# 🚀 ONE-COMMAND DEPLOYMENT SCRIPT
# Just run: ./deploy-simple.sh

echo "🔥 DEPLOYING ENDORA TO THE CLOUD..."
echo "This will build and deploy your app in one go!"
echo ""

# Load environment variables from .env file
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found! Please create it with your environment variables."
    exit 1
fi

# Build the Docker image and deploy to Cloud Run in one command
gcloud run deploy ${SERVICE_NAME} \
  --source . \
  --platform managed \
  --region ${GCP_REGION} \
  --allow-unauthenticated \
  --set-env-vars="NEXTAUTH_URL=$NEXTAUTH_URL,KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER,KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID,KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET,NEXTAUTH_SECRET=$NEXTAUTH_SECRET"

echo ""
echo "✅ DONE! Your Endora platform is live!"
echo "🌐 URL: https://api-ngin.oudom.dev"
