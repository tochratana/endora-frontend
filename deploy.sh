#!/bin/bash
# Complete build and deploy script
# Usage: ./deploy.sh

echo "🔨 Building new image..."
./build.sh

if [ $? -eq 0 ]; then
    # Load environment variables from .env file
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    else
        echo "❌ .env file not found! Please create it with your environment variables."
        exit 1
    fi

    echo "✅ Build successful! Deploying to Cloud Run..."
    gcloud run deploy ${SERVICE_NAME} \
      --image gcr.io/${GCP_PROJECT_ID}/api-engine-ui \
      --platform managed \
      --region ${GCP_REGION} \
      --allow-unauthenticated \
      --set-env-vars="NEXTAUTH_URL=$NEXTAUTH_URL,KEYCLOAK_ISSUER=$KEYCLOAK_ISSUER,KEYCLOAK_CLIENT_ID=$KEYCLOAK_CLIENT_ID,KEYCLOAK_CLIENT_SECRET=$KEYCLOAK_CLIENT_SECRET,NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    
    echo "🚀 Deployment complete!"
    echo "Your app is available at: https://api-ngin.oudom.dev"
else
    echo "❌ Build failed. Please check the errors above."
fi
