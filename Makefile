MARKDOWN := markdown+definition_lists
Z80_LEXER := ./highlight_z80
PANDOC_OPTS := --filter=$(Z80_LEXER) -f $(MARKDOWN) -t html5 --template=stuff/template.html --toc -c stuff/style.css


MARKDOWN := $(shell find . -name '*.md')
HTML := $(addsuffix .html,$(basename $(MARKDOWN)))

.PHONY: all, clean, clean-highlighter

all: $(HTML)

clean: clean-highlighter
	rm -f $(HTML)

clean-highlighter:
	rm -f $(Z80_LEXER) stuff/$(Z80_LEXER).{hi,hs,o}

highlight_z80: stuff/z80.x
	alex -g -o stuff/highlight_z80.hs stuff/z80.x
	ghc -o highlight_z80 stuff/highlight_z80.hs
	
%.html : %.md highlight_z80 stuff/template.html
	pandoc $(PANDOC_OPTS) -o $@ $<
	
