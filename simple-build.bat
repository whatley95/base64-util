@echo off
echo === Starting Simple Build Process ===

echo --- Building Next.js application ---
call npm run build

echo --- Checking for output directory ---
if exist "out" (
    echo === Success: Output directory found ===
    echo Your static files are in the "out" directory
    dir "out"
) else (
    echo === No output directory found, trying export ===
    call npm run export
    
    if exist "out" (
        echo === Success: Output directory created ===
        echo Your static files are in the "out" directory
        dir "out"
    ) else (
        echo === Build failed: No output directory ===
    )
)

pause
