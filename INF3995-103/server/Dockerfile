FROM ros:noetic


RUN apt-get update -y && apt-get install -y \
  curl git ros-noetic-roslint \
  x11-apps mesa-utils \
  libgl-dev libturbojpeg0-dev \
  libegl-dev freeglut3-dev \
  ocl-icd-opencl-dev \
  libxcb1-dev libxcb-keysyms1-dev \
  libxcb-glx0-dev libx11-xcb-dev \
  libxtst-dev libpam0g-dev xauth \
  x11-xkb-utils xkb-data openbox
RUN apt-get update -y && apt-get install -y \
  ros-noetic-ros-control \
  ros-noetic-ros-controllers \
  ros-noetic-gazebo-ros \
  ros-noetic-gazebo-ros-control \
  ros-noetic-joint-state-publisher-gui \
  ros-noetic-rqt-robot-steering \
  ros-noetic-teleop-twist-keyboard xterm
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
COPY package.json server/
COPY package-lock.json server/
WORKDIR "/server"
RUN npm i
COPY nodemon.json /server
COPY tsconfig.json /server
COPY src/ src/
RUN npm run build
CMD node build/index.js

