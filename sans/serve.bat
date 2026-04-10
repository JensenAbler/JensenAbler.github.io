@echo off
title SANS Viewer
echo Starting SANS viewer...
python serve.py
if errorlevel 1 (
    echo.
    echo Python not found. Trying python3...
    python3 serve.py
)
pause
