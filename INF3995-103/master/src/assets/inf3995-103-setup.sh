#!/bin/sh

export ROS_IP=$(ip a | grep -oP 'inet \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}' | head -2 | tail -1 | awk '{print $2}')
exec docker run --name inf3995-limo --env ROS_MASTER_URI=$ROS_MASTER_URI --env ROS_IP=$ROS_IP --net=host --device $(realpath /dev/ydlidar):/dev/ydlidar --device /dev/snd --privileged --rm inf3995h23equipe103/master.limo:latest -- bash -c 'source /catkin_ws/install_isolated/setup.bash; source devel/setup.bash --extend; exec "$@"' -- "$@"