#!/bin/bash

# Stop MySQL service
echo "Stopping MySQL service..."
sudo systemctl stop mysql

# Kill the tmux session
SESSION="dev_session"
tmux kill-session -t $SESSION 2>/dev/null

# Optionally, you could deactivate the virtual environment in case it's still active
# If you're using the virtualenv with `source venv/bin/activate`, you can simply deactivate it
# Deactivate virtual environment if it's active (assuming the user is in it)
deactivate 2>/dev/null || echo "No virtual environment to deactivate"

echo "All services have been shut down successfully."
