#!/bin/bash
# Build script that uses environment variables safely
# Usage: ./build.sh

# Source the environment file
if [ -f ".cloudbuild.env" ]; then
    export $(cat .cloudbuild.env | xargs)
fi

# Run gcloud build with substitutions
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_KEYCLOAK_ISSUER="$_KEYCLOAK_ISSUER",_KEYCLOAK_CLIENT_ID="$_KEYCLOAK_CLIENT_ID",_KEYCLOAK_CLIENT_SECRET="$_KEYCLOAK_CLIENT_SECRET",_NEXTAUTH_SECRET="$_NEXTAUTH_SECRET",_NEXTAUTH_URL="$_NEXTAUTH_URL"
