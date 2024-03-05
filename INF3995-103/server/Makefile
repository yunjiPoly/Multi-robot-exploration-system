SELF_IP ?= $(shell ip a | grep -oP 'inet \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | head -2 | tail -1 | awk '{print $$2}')
MASTER_IP ?= $(SELF_IP)

default: run

# TODO: use ports rather than net=host
#  -p 11311:11311 -p 3000:3000
run: dockerfile
	docker stop inf3995-server || true
	# Change volume for build of server when more advanced in project
	docker run --name inf3995-server \
	 -v $(shell pwd)/src/database:/server/src/database \
	 -v $(shell pwd)/src/logs:/server/src/logs \
	 -v $(shell pwd)/src/maps:/server/src/maps \
	 --env ROS_MASTER_URI=http://$(MASTER_IP):11311 --env ROS_IP=$(SELF_IP) \
	 --net=host \
	 --rm -it inf3995-equipe103-server npm start

test: dockerfile 
	docker stop inf3995-server || true
	# Change volume for build of server when more advanced in project
	docker run --name inf3995-server \
	 --env ROS_MASTER_URI=http://$(MASTER_IP):11311 --env ROS_IP=$(SELF_IP) \
	 --net=host \
	 --rm -it inf3995-equipe103-server npm run test

dockerfile: Dockerfile
	docker build -t inf3995-equipe103-server .

.PHONY: default run dockerfile
