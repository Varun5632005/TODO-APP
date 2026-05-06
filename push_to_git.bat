@echo off
echo ==========================================
echo    Saving all TaskMaster features to Git
echo ==========================================
echo.

echo 1. Fixing the README merge conflict...
git add README.md
git rebase --continue

echo.
echo 2. Pushing all frontend and backend changes to GitHub...
git push

echo.
echo ==========================================
echo  Done! Check your GitHub page now.
echo ==========================================
pause
