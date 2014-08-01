#!/bin/bash

case "$1" in
    "" | build)
        find -name '*.md' | (
            while read MD
            do
                echo -n $MD
                HTML=${MD%.md}.html
                echo " => $HTML"
                markdown_py -o html5 -x fenced_code -x footnotes -x toc -f $HTML $MD
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
