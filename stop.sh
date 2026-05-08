#!/bin/bash

echo "Stopping frontend..."
pkill -f "vite"

echo "Stopping backend..."
cd tomcat-server/apache-tomcat-10.1.34/bin
./shutdown.sh

echo "Applications stopped."