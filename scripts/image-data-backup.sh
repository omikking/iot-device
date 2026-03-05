#!/bin/bash

set -e

# Configuration
PROJECT_DIR="/ground-support-platform"
IMAGE_BACKUP_DIR="$PROJECT_DIR/image-backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
IMAGE_BACKUP_FILE="image_backup_$TIMESTAMP.tar.gz"

# Container and path configuration
CONTAINER_NAME="ground-support-platform-api-1"
CONTAINER_PATH="/app/apps/api/uploads/boltResults"

# Check if container is running
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "ERROR: Container '$CONTAINER_NAME' is not running."
    exit 1
fi

# Create backup directory if not exists
mkdir -p "$IMAGE_BACKUP_DIR"

# Create tarball of images inside container and copy to VM
echo "Creating image backup..."
echo "Container: $CONTAINER_NAME"
echo "Source path: $CONTAINER_PATH"
echo "Destination: $IMAGE_BACKUP_DIR/$IMAGE_BACKUP_FILE"

docker exec "$CONTAINER_NAME" tar -czf - "$CONTAINER_PATH" > "$IMAGE_BACKUP_DIR/$IMAGE_BACKUP_FILE"

# Create symlink for latest backup
ln -sf "$IMAGE_BACKUP_FILE" "$IMAGE_BACKUP_DIR/latest.tar.gz"

echo "Image backup completed successfully!"
echo "Backup file: $IMAGE_BACKUP_DIR/$IMAGE_BACKUP_FILE"
echo "Latest: $IMAGE_BACKUP_DIR/latest.tar.gz"