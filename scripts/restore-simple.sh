#!/bin/bash

# Simple Database Restore Script
set -e

BACKUP_DIR="./backups"

# Check if any database container is running
if docker ps | grep -q "prod-db"; then
    CONTAINER="ground-support-platform-prod-db-1"
elif docker ps | grep -q "dev-db"; then
    CONTAINER="ground-support-platform-dev-db-1"
else
    echo "No database container running"
    exit 1
fi

# Find latest backup
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "No backup files found in $BACKUP_DIR"
    exit 1
fi

echo "Restoring from: $LATEST_BACKUP"
echo "This will replace all current data!"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Restore database
docker exec -i "$CONTAINER" psql -U postgres -d postgres < "$LATEST_BACKUP"

echo "Database restored successfully!"