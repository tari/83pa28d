## User-overridable options
DESTDIR ?= .
PANDOC ?= pandoc

MD_DIALECT := markdown+tex_math_dollars+definition_lists+compact_definition_lists
PANDOC_OPTS := -f $(MD_DIALECT) -t html5 --syntax-definition=stuff/z80-syntax.xml --template=stuff/template.html --toc -c stuff/style.css --indented-code-classes=z80

MARKDOWN := $(shell find . -name '*.md')
HTML := $(addprefix $(DESTDIR)/,$(addsuffix .html,$(basename $(MARKDOWN))))
CSS := $(wildcard stuff/*.css)
IMG := $(wildcard img/*)

CSS_OUT := $(addprefix $(DESTDIR)/,$(CSS))
IMG_OUT := $(addprefix $(DESTDIR)/,$(IMG))

.PHONY: all, clean, clean-highlighter

all: $(DESTDIR) $(HTML) $(CSS_OUT) $(IMG_OUT)

# Short circuit circular dependency if destdir is unset
ifneq ($(DESTDIR),.)
$(CSS_OUT): $(CSS) $(DESTDIR)/stuff
	cp $(CSS) $(DESTDIR)/stuff

$(IMG_OUT): $(IMG) $(DESTDIR)
	cp -r img $(DESTDIR)
endif

$(DESTDIR):
	mkdir -p $(DESTDIR)

$(DESTDIR)/stuff:
	mkdir -p $(DESTDIR)/stuff

clean:
	rm -f $(HTML)

$(DESTDIR)/%.html : %.md stuff/z80-syntax.xml stuff/template.html
	mkdir -p $(DESTDIR)/$(dir $<)
	$(PANDOC) $(PANDOC_OPTS) -o $@ $<
	
