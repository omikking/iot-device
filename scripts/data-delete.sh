#!/bin/bash

set -e

# Configuration 
PROJECT_DIR="/home/adminpc/ground-support-platform"

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

echo "Container: $CONTAINER"
echo "Database: $DB_NAME"
echo
echo "This will DELETE ALL DATA from the database!"
read -p "Are you sure? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled"
    exit 0
fi

echo "Deleting all data..."

# Delete data in correct order to respect foreign key constraints
docker exec "$CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "
-- Disable foreign key checks for faster deletion
SET session_replication_role = replica;

-- Delete data from tables (children first, then parents)
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

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset sequences for auto-increment fields
SELECT setval('coffees_id_seq', 1, false);
SELECT setval('flavors_id_seq', 1, false);
"

echo "All data deleted successfully!"
echo "Schema structure preserved."
echo "Auto-increment sequences reset."