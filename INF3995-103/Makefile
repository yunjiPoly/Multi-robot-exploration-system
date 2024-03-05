PWD := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.PHONY: all master server client

all:
	tmux \
	new-session  '$(MAKE) -C $(PWD) master' \; \
	split-window '$(MAKE) -C $(PWD) server' \; \
	split-window -h '$(MAKE) -C $(PWD) client'

master:
	$(MAKE) -C master

server:
	$(MAKE) -C server

client:
	$(MAKE) -C client


test: test-server test-client

test-client:
	$(MAKE) -C client test

test-server:
	$(MAKE) -C server test

