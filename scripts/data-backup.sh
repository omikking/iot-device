#!/bin/bash


set -e

# Configuration 
PROJECT_DIR="/ground-support-platform"
BACKUP_DIR="$PROJECT_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="data_backup_$TIMESTAMP.sql"

# Database configuration
DB_NAME="nest"
DB_USER="postgres"

# Auto-detect database container
if docker ps | grep -q "prod-db"; then
    CONTAINER="ground-support-platform-prod-db-1"
elif docker ps | grep -q "dev-db"; then
    CONTAINER="ground-support-platform-dev-db-1"
else
    echo "ERROR: No database container running"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create data-only backup 
echo "Creating data backup from container: $CONTAINER"
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_DIR/$BACKUP_FILE"

docker exec "$CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" --data-only --inserts > "$BACKUP_DIR/$BACKUP_FILE"

# Create latest symlink for easy access
ln -sf "$BACKUP_FILE" "$BACKUP_DIR/latest.sql"

echo "✓ Backup completed successfully!"
echo "File: $BACKUP_DIR/$BACKUP_FILE"
echo "Latest: $BACKUP_DIR/latest.sql"