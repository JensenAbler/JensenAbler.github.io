#!/bin/bash
echo "Starting SANS viewer..."
if command -v python3 &>/dev/null; then
    python3 serve.py
elif command -v python &>/dev/null; then
    python serve.py
else
    echo "Python not found. Please install Python 3."
    exit 1
fi
