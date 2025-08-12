EXT_DIR := extension
DIST_DIR := dist
NAME := peppol-toolbox
VERSION := $(shell sed -n 's/.*"version":[[:space:]]*"\([^"]*\)".*/\1/p' $(EXT_DIR)/manifest.json | head -n1)
ZIP := $(DIST_DIR)/$(NAME)-$(VERSION).zip

.PHONY: all clean

all: $(ZIP)

$(ZIP):
	mkdir -p $(DIST_DIR)
	cd $(EXT_DIR) && zip -r -FS ../$(ZIP) . -x "*.DS_Store"

clean:
	rm -rf $(DIST_DIR)
