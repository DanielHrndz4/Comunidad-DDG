@echo off

cd service
call npm run export-swagger

cd ..

mkdocs build

echo.
echo Documentacion generada correctamente.
pause