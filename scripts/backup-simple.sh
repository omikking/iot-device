#!/bin/bash

# Simple Database Backup Script
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_$TIMESTAMP.sql"

# Check if any database container is running
if docker ps | grep -q "prod-db"; then
    CONTAINER="ground-support-platform-prod-db-1"
elif docker ps | grep -q "dev-db"; then
    CONTAINER="ground-support-platform-dev-db-1"
else
    echo "No database container running"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup from $CONTAINER..."
docker exec "$CONTAINER" pg_dump -U postgres -d nest --clean --if-exists --create > "$BACKUP_DIR/$BACKUP_FILE"

# Create latest symlink
ln -sf "$BACKUP_FILE" "$BACKUP_DIR/latest.sql"

echo "Backup saved: $BACKUP_DIR/$BACKUP_FILE"