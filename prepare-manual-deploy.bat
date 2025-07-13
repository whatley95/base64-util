@echo off
echo === Creating manual deployment package for Cloudflare Pages ===

echo --- Step 1: Building Next.js app ---
call next build
if %ERRORLEVEL% neq 0 (
  echo Error building Next.js app
  exit /b %ERRORLEVEL%
)

echo --- Step 2: Exporting static files ---
call next export
if %ERRORLEVEL% neq 0 (
  echo Error exporting Next.js app
  exit /b %ERRORLEVEL%
)

echo --- Step 3: Creating output directory structure ---
mkdir deploy-output 2>nul
robocopy out deploy-output /E /NFL /NDL /NJH /NJS /nc /ns /np

echo --- Step 4: Adding necessary Cloudflare Pages files ---
echo ^<!-- Cloudflare Pages deployment --^> > deploy-output\_headers

echo === Manual deployment package created ===
echo Your files are ready in the 'deploy-output' folder
echo Upload this entire folder to Cloudflare Pages manually
