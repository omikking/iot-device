#!/bin/bash

IMAGE_BACKUP_SCRIPT="$(dirname "$0")/image-data-backup.sh"

# Ensure backup script exists
if [ ! -f "$IMAGE_BACKUP_SCRIPT" ]; then
    echo "Error: Image backup script not found at $IMAGE_BACKUP_SCRIPT"
    exit 1
fi

# Make script executable
chmod +x "$IMAGE_BACKUP_SCRIPT"
echo "Made image backup script executable"

PROJECT_DIR=$(pwd)
echo "Project directory: $PROJECT_DIR"

# Log directory
LOG_DIR="/ground-support-platform/logs"
mkdir -p "$LOG_DIR"
echo "Log directory: $LOG_DIR"

echo
echo "=== SETTING UP DAILY IMAGE BACKUP CRON ==="
echo "Schedule: Daily at 2:30 AM"
echo "Logs: $LOG_DIR/image-backup.log"
echo

# Cron job for image backup (SUITABLE TIME)
CRON_IMAGES="30 2 * * * cd $PROJECT_DIR && ./scripts/image-data-backup.sh >> $LOG_DIR/image-backup.log 2>&1"

# Remove old image-backup cron entries
crontab -l 2>/dev/null | grep -v "image-backup.sh" | crontab -

# Add new cron job
(
  crontab -l 2>/dev/null
  echo "$CRON_IMAGES"
) | crontab -

echo "=== ACTIVE CRON JOBS ==="
crontab -l
echo
echo "=== IMAGE BACKUP SCHEDULE ==="
echo "Image Backup: Daily at 2:30 AM"
echo "Log File: $LOG_DIR/image-backup.log"
echo
echo "IMAGE BACKUP CRON SETUP COMPLETE"