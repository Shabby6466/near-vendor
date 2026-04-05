#!/bin/bash
#
# NearVendor Backend Deployment Script
#
# Usage:
#   ./deploy.sh start   - Start all services.
#   ./deploy.sh stop    - Stop all services.
#   ./deploy.sh down    - Stop and remove all services, networks, and volumes.
#   ./deploy.sh logs-f  - Follow the logs of all services.
#   ./deploy.sh build   - Rebuild all service images.
#

# Ensure we are in the directory where the script and docker-compose.yml are located
cd "$(dirname "$0")"

COMPOSE_FILE="docker-compose.yml"

case "$1" in
    start)
        # Clear any accidental .env directories created by Docker volume mounts
        if [ -d ".env" ]; then
            echo "Removing .env directory created accidentally by Docker..."
            rm -rf .env
        fi
        docker compose -f $COMPOSE_FILE up -d
        ;;
    stop)
        docker compose -f $COMPOSE_FILE stop
        ;;
    down)
        docker compose -f $COMPOSE_FILE down
        ;;
    logs-f)
        docker compose -f $COMPOSE_FILE logs -f
        ;;
    build)
        docker compose -f $COMPOSE_FILE build
        ;;
    *)
        echo "Usage: $0 {start|stop|down|logs-f|build}"
        exit 1
        ;;
esac

exit 0
