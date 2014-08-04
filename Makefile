MARKDOWN := markdown+definition_lists
PANDOC_OPTS := -f $(MARKDOWN) -t html5 --template=stuff/template.html --toc -c stuff/style.css

MARKDOWN := $(shell find -name '*.md')
HTML := $(addsuffix .html,$(basename $(MARKDOWN)))

.PHONY: all, clean

all: $(HTML)

clean:
	rm -f $(HTML)
	
%.html : %.md
	pandoc $(PANDOC_OPTS) -o $@ $<
	
