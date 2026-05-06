@echo off
echo ==========================================
echo    Saving all TaskMaster features to Git
echo ==========================================
echo.

echo 1. Fixing corrupt git rebase state...
if exist .git\rebase-merge rmdir /s /q .git\rebase-merge
git rebase --abort 2>nul

echo.
echo 2. Adding all files to Git...
git add .

echo.
echo 3. Committing changes...
git commit -m "Fix timezone shift issue when saving task date and time"

echo.
echo 4. Pushing all frontend and backend changes to GitHub...
git push

echo.
echo ==========================================
echo  Done! Check your GitHub page now.
echo ==========================================
pause
