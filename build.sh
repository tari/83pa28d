#!/bin/bash

PANDOC_OPTS="-t html5 --template=stuff/template.html --toc -c stuff/style.css" # -H stuff/nav.js

case "$1" in
    "" | build)
        find -name '*.md' | (
            while read MD
            do
                echo -n $MD
                HTML=${MD%.md}.html
                echo " => $HTML"
                pandoc $PANDOC_OPTS -o $HTML $MD
            done
        )
        ;;
    
    clean)
        find -name '*.html' | (
            while read HTML
            do
                MD=${HTML%.html}.md
                if [ -e $MD ]
                then
                    rm $HTML
                else
                    echo "No corresponding .md, skipping $HTML"
                fi
            done
        )
        ;;

    *)
        echo "Usage: $0 [build | clean]"
        ;;
esac
