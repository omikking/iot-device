#!/bin/bash
BACKUP_SCRIPT="$(dirname "$0")/data-backup.sh"

#BACKUP_SCRIPT="./scripts/data-backup.sh"
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "Error: Backup script not found at $BACKUP_SCRIPT"
    echo "Please ensure the backup script exists before setting up cron."
    exit 1
fi

chmod +x "$BACKUP_SCRIPT"
echo "Made backup script executable"
PROJECT_DIR=$(pwd)
#PROJECT_DIR="/ground-support-platform"
echo "Project directory: $PROJECT_DIR"

LOG_DIR="/ground-support-platform/logs"
mkdir -p "$LOG_DIR"
echo "Log directory: $LOG_DIR"

echo
echo "=== SETTING UP DAILY BACKUP ==="
echo "Schedule: Daily at 2:00 AM"
echo "Logs: $LOG_DIR/backup.log"
echo

# Production cron job (daily at 2 AM)
CRON_JOB="0 2 * * * cd $PROJECT_DIR && ./scripts/data-backup.sh >> $LOG_DIR/backup.log 2>&1"

# Remove any existing backup cron jobs to avoid duplicates
crontab -l 2>/dev/null | grep -v "data-backup.sh" | crontab -

# Add the new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -



echo "=== ACTIVE CRON JOBS ==="
crontab -l
echo
echo "=== BACKUP SCHEDULE ==="
echo "Next backup: Tomorrow at 2:00 AM"
echo "Frequency: Daily"
echo "Command: cd $PROJECT_DIR && ./scripts/data-backup.sh"
echo

echo "PRODUCTION SCHEDULER READY"
