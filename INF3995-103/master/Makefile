SELF_IP ?= $(shell ip a | grep -oP 'inet \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | head -2 | tail -1 | awk '{print $$2}')
MASTER_IP ?= $(SELF_IP)

default: run

run: dockerfile
	docker stop inf3995-master || true
	docker run --name inf3995-master \
	  --env DISPLAY=${DISPLAY} --volume="${XAUTHORITY}:/root/.Xauthority:rw" \
	  --net=host \
	  -v $(shell pwd):/code \
	  --env ROS_MASTER_URI=http://$(MASTER_IP):11311 --env ROS_IP=$(SELF_IP) \
	  --env ROSLAUNCH_SSH_UNKNOWN=1 --device /dev/snd \
	  --privileged -v /tmp/.X11-unix:/tmp/.X11-unix \
	  --rm -it inf3995h23equipe103/master:latest \
	  bash -c 'source /ros_entrypoint.sh && source devel/setup.bash && roslaunch \
	    --screen master master.launch'

test: dockerfile # un jour, permet le CI
	echo -n '' # do nothing

dockerfile: Dockerfile.master
	docker build -t inf3995h23equipe103/master:latest -f Dockerfile.master .
	
dockerfile-limo-arm: Dockerfile.master.limo
	docker buildx build --platform linux/arm64 -t inf3995h23equipe103/master.limo:latest -f Dockerfile.master.limo --push .


.PHONY: default run dockerfile dockerfile-limo-local dockerfile-limo-arm

