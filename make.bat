@echo off

set MARKDOWN=markdown+definition_lists
set PANDOC_OPTS=-f %MARKDOWN% -t html5 --template=stuff\template.html --toc -c stuff\style.css

if "%1"=="all" goto :build
if "%1"=="" goto :build
if "%1"=="clean" goto :clean
goto :eof

:build
for /R %%f in (*.md) do call :build_file "%%~dpf%%~nf"
goto :eof

:build_file
    set FILE=%~1
    echo %FILE%.md =^> %FILE%.html
    pandoc %PANDOC_OPTS% -o "%FILE%.html" "%FILE%.md"
    goto :eof

:clean
for /R %%f in (*.html) do call :clean_file %%~dpf%%~nf
goto :eof

:clean_file
    set MD=%1.md
    set HTML=%1.html
    if EXIST %MD% (
        del %HTML%
    ) else (
        echo No corresponding .md, skipping %HTML%
    )
