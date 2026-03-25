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

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="nearvendor"

case "$1" in
    start)
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME up -d
        ;;
    stop)
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME stop
        ;;
    down)
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME down
        ;;
    logs-f)
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME logs -f
        ;;
    build)
        docker compose -f $COMPOSE_FILE -p $PROJECT_NAME build
        ;;
    *)
        echo "Usage: $0 {start|stop|down|logs-f|build}"
        exit 1
        ;;
esac
exit 0
