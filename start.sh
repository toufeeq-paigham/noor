#!/bin/bash
# Start the Noor POC dev server and open it in the default browser.

PORT=8474
URL="http://localhost:$PORT/src/Index.dc.html"

# Run the Python dev server in the background
python3 src/_theme/devserver.py $PORT &
SERVER_PID=$!

echo "Starting Noor POC server on port $PORT (PID: $SERVER_PID)..."
sleep 1 # Wait a moment for the server to spin up

# Open the Index page in the default browser (macOS)
if command -v open > /dev/null; then
  open "$URL"
  echo "Opened $URL in your default browser."
else
  echo "Server running. Please open $URL in your browser."
fi

# Trap exit signals to clean up the background server process
cleanup() {
  echo ""
  echo "Shutting down Noor POC server..."
  kill $SERVER_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

# Keep the script running to monitor/stop the server with Ctrl+C
wait $SERVER_PID
