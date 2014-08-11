## User-overridable options
PANDOC ?= pandoc
HIGHLIGHT ?= yes
HSC ?= ghc
ALEX ?= alex

MD_DIALECT := markdown+tex_math_dollars+definition_lists
PANDOC_OPTS := -f $(MD_DIALECT) -t html5 --template=stuff/template.html --toc -c stuff/style.css --indented-code-classes=z80

ifeq ($(HIGHLIGHT),yes)
	Z80_LEXER := ./highlight_z80
	# pandoc 1.12 or better is required for --filter
	PANDOC_OPTS := $(PANDOC_OPTS) --filter=$(Z80_LEXER) 
else
	Z80_LEXER :=
endif

MARKDOWN := $(shell find . -name '*.md')
HTML := $(addsuffix .html,$(basename $(MARKDOWN)))

.PHONY: all, clean, clean-highlighter

all: $(HTML)

clean: clean-highlighter
	rm -f $(HTML)

clean-highlighter:
	rm -f $(Z80_LEXER) stuff/$(Z80_LEXER).{hi,hs,o}

highlight_z80: stuff/z80.x
	$(ALEX) -o stuff/highlight_z80.hs stuff/z80.x
	$(HSC) -o highlight_z80 stuff/highlight_z80.hs
	
%.html : %.md $(Z80_LEXER) stuff/template.html
	$(PANDOC) $(PANDOC_OPTS) -o $@ $<
	
