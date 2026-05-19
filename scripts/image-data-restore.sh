#!/bin/bash

set -e

# Configuration
PROJECT_DIR="/ground-support-platform"
IMAGE_BACKUP_DIR="$PROJECT_DIR/image-backups"
DEFAULT_RESTORE_PATH="/app/apps/api/uploads/boltResults"

# Auto-detect API container
if docker ps | grep -q "platform-api-1"; then
    CONTAINER="ground-support-platform-api-1"
else
    echo "ERROR: No API container running (expected something like ground-support-platform-api-1)"
    exit 1
fi

# Determine backup file to restore
if [ "$1" ]; then
    # If full path provided
    if [ -f "$1" ]; then
        BACKUP_FILE="$1"
    elif [ -f "$IMAGE_BACKUP_DIR/$1" ]; then
        BACKUP_FILE="$IMAGE_BACKUP_DIR/$1"
    else
        echo "ERROR: Backup file not found: $1"
        exit 1
    fi
else
    BACKUP_FILE="$IMAGE_BACKUP_DIR/latest.tar.gz"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "ERROR: No latest image backup found. Run backup_images.sh first or specify a file."
        exit 1
    fi
fi

echo "Container: $CONTAINER"
echo "Backup file: $BACKUP_FILE"
echo "Restore path in container: $DEFAULT_RESTORE_PATH"
echo
echo "This will overwrite any existing images in that directory!"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Optional: Clear existing images
read -p "Clear existing images before restore? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Clearing existing images inside container..."
    docker exec "$CONTAINER" rm -rf "$DEFAULT_RESTORE_PATH"/*
fi

# Copy and extract tarball into container
echo "Restoring images..."
cat "$BACKUP_FILE" | docker exec -i "$CONTAINER" tar -xzf - -C /

echo "Image restore completed successfully!"
echo "Restored from: $BACKUP_FILE"
echo "To path: $DEFAULT_RESTORE_PATH"