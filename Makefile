.PHONY: install
.PHONY: scrape

SHELL=/usr/bin/env bash

CASPERJS_OPTION_VERBOSE=
CASPERJS_OPTION_LOG_LEVEL=warn
CASPERJS_OPTION_COOKIES_FILE=cookies.txt
CASPERJS_OPTIONS=$(CASPERJS_OPTION_VERBOSE) \
--log-level=$(CASPERJS_OPTION_LOG_LEVEL) \
--cookies-file=$(CASPERJS_OPTION_COOKIES_FILE)

scrape:
	./node_modules/casperjs/bin/casperjs $(CASPERJS_OPTIONS) stock-scraper.js

install:
	npm install
	[[ -f "$(CASPERJS_OPTION_COOKIES_FILE)" ]] || touch cookies.txt
	[[ -f "config.js" ]] || cp config.js.template config.js
