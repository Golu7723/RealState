#!/bin/bash

# Check if backend (Tomcat) is running
if pgrep -f "catalina" > /dev/null; then
    echo "Backend (Tomcat) is already running"
else
    echo "Starting backend..."
    cd tomcat-server/apache-tomcat-10.1.34/bin
    ./startup.sh &
    BACKEND_PID=$!
    sleep 10
fi

# Start frontend
echo "Starting frontend..."
cd spring-realestate-api-main/frontend
npm run dev &
FRONTEND_PID=$!

echo "Applications are running:"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8090"
echo "Press Ctrl+C to stop"

# Wait
wait $FRONTEND_PID