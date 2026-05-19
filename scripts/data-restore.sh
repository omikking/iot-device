#!/bin/bash


set -e

# Configuration 
PROJECT_DIR="/ground-support-platform"
BACKUP_DIR="$PROJECT_DIR/backups"

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

# Find backup file to restore
if [ "$1" ]; then
    # Use specified backup file
    if [ -f "$1" ]; then
        BACKUP_FILE="$1"
    elif [ -f "$BACKUP_DIR/$1" ]; then
        BACKUP_FILE="$BACKUP_DIR/$1"
    else
        echo "ERROR: Backup file not found: $1"
        exit 1
    fi
else
    # Use latest backup
    BACKUP_FILE="$BACKUP_DIR/latest.sql"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "ERROR: No latest backup found. Run data-backup.sh first or specify a backup file."
        exit 1
    fi
fi

echo "Container: $CONTAINER"
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"
echo
echo "This will restore data to the existing database!"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

# Optional: Clear existing data first
read -p "Clear existing data before restore? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Clearing existing data..."
    docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
    SET session_replication_role = replica;
    DELETE FROM coffee_flavors;
    DELETE FROM bolt_results;
    DELETE FROM invitations;
    DELETE FROM user_permissions;
    DELETE FROM refresh_token_ids;
    DELETE FROM locations;
    DELETE FROM drives;
    DELETE FROM levels;
    DELETE FROM sites;
    DELETE FROM plans;
    DELETE FROM users;
    DELETE FROM companies;
    DELETE FROM coffees;
    DELETE FROM flavors;
    SET session_replication_role = DEFAULT;
    "
fi

# Restore data
echo "Restoring data..."
docker exec -i "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_FILE"

echo "Data restore completed successfully!"
