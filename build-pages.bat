@echo off
echo === Building Next.js app ===
call next build
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo === Running @cloudflare/next-on-pages ===
call npx @cloudflare/next-on-pages@latest
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

echo === Build completed successfully ===
