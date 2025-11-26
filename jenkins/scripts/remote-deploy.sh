#!/bin/sh


#=====================================
# HOST_IP  controlled by jenkins env
# HOST_USER controlled by jenkins envs
# PORT controlled by jenkins envs
#=====================================

# Get current git commit number
LABEL=$(git log -1 --format=%h)
echo $ENV_PATH
CONTAINER_NAME=backend
CONTAINER_CURRENT=nearvendor/$CONTAINER_NAME:$LABEL
docker stop $CONTAINER_NAME-$WORKER_NAME-$BRANCH_NAME
docker rm -f $CONTAINER_NAME-$WORKER_NAME-$BRANCH_NAME
docker run -v $ENV_PATH/.env:/app/.env -v $ENV_PATH/service-account.json:/app/service-account.json  -d -p $PORT:3836 --restart unless-stopped --name $CONTAINER_NAME-$WORKER_NAME-$BRANCH_NAME $CONTAINER_CURRENT
