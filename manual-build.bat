@echo off
echo === Building Base64 Util for manual deployment ===

echo --- Cleaning up old build files ---
if exist "out" rd /s /q "out"

echo --- Attempting to clean .next directory ---
if exist ".next" (
  rd /s /q ".next" 2>nul
  if exist ".next" (
    echo Warning: Could not fully remove .next directory, but will continue anyway
    echo You may want to close any processes that might be locking these files
  )
)

echo --- Building Next.js application ---
call npm run build
if %ERRORLEVEL% neq 0 (
  echo Error building Next.js app
  exit /b %ERRORLEVEL%
)

echo --- Checking build output ---
if exist "out" (
  echo --- Verifying build contents ---
  if exist "out\index.html" (
    echo === Build completed successfully ===
    echo Your static files are in the "out" directory
    echo Location: %CD%\out
    echo Build verification: PASSED ✓
    echo You can now upload this directory to Cloudflare Pages manually
    
    echo --- Build Summary ---
    echo Files found: 
    set /a count=0
    for /f %%a in ('dir /b "out" ^| find /v /c ""') do set count=%%a
    echo %count% files in output directory
  ) else (
    echo === Warning: Build may be incomplete ===
    echo The "out" directory exists but does not contain index.html
    echo Please check the contents to ensure the build was successful
  )
) else (
  echo === Warning: Output directory not found ===
  echo The "out" directory was not created by the build command.
  echo This might indicate that your next.config.js is missing the "output: 'export'" setting.
  
  echo --- Attempting to create static files with export ---
  call next export
  
  if exist "out" (
    echo --- Verifying export contents ---
    if exist "out\index.html" (
      echo === Export completed successfully ===
      echo Your static files are in the "out" directory
      echo Location: %CD%\out
      echo Build verification: PASSED ✓
      
      echo --- Export Summary ---
      set /a count=0
      for /f %%a in ('dir /b "out" ^| find /v /c ""') do set count=%%a
      echo %count% files in output directory
      
      echo You can now upload this directory to Cloudflare Pages manually
    ) else (
      echo === Warning: Export may be incomplete ===
      echo The "out" directory exists but does not contain index.html
      echo Please check the contents to ensure the export was successful
    )
  ) else (
    echo === Error: Could not generate static files ===
    echo Please check your next.config.js configuration.
    echo Make sure it includes "output: 'export'" setting.
  )
)
