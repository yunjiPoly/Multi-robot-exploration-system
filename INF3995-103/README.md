This project is a computer system applied the concepts of networking, embedded systems, databases and security
computer science. This system consist of a ground station equipped with a web interface
which will make it possible to launch exploration missions carried out by a team of two
robots, i.e. two AgileX Limo rover. The web interface will allow continuous visualization of the map
produced by the two robots, their position in the map explored by themself as well as their state. These robots, equipped with sensors, will have to explore
autonomously a room of a medium-sized building.
The mandate also requires designing a simulation system, using the
Gazebo simulator, allowing you to control the simulated robots via the same interface as
the ground station. This system will be used to conceptually test the algorithms
robot control and ground station functionalities before deploying them.

# Projet CartoRovers pour exploration multi-robots

## Description de l'application :

Ceci est le code source de notre application pour un système d'exploration multi-robots. Cette application permet de lancer des missions d'exploration à l'aide de deux rover *AgileX Limo*.
L'application permet également de simuler des missions sur Gazebo dans un environnement virtuel généré aléatoirement.

L'application se sépare en trois parties principales :

- Station au sol :\
	Station de contrôle pour les robots et la simulation.
- Logiciel embarqué :\
	Logiciel utilisé pour gérer des missions avec des robots physiques.
- Simulation :\
	Environnement de simulation des missions sur Gazebo.

## Pour exécuter notre projet :

Afin d'avoir un affichagé complet et unifié, nous avons choisi d'utiliser le multiplexeur de terminaux  tmux. Il faut donc l'installer avant l'exécution du projet.
On peut installer tmux (si ce n'est pas déjà fait) avec la commande ```apt install tmux```.

On peut ensuite exécuter la commande ```make``` à la racine du répertoire ***INF3995-103***.
Cette commande va démarrer les 3 conteneurs docker nécessaires à notre projet.

Avant de démarrer une mission réelle, il faut aussi s'assurer que l'image de rover est terminée et la copier sur les 2 robots. 
Pour copier l'image sur un des robots, vous devez vous y connecter en SSH avec la commande ```ssh agilex@192.168.1.130``` ou ```ssh agilex@192.168.1.170```. Le mot de passe est ***agx***. Il est ensuite possible d'exécuter la commande ```docker pull inf3995h23equipe103/base:latest-limo``` pour copier l'image docker sur chacun des robots.

Ensuite, il faut se diriger vers la page web http://localhost:4200/home, puis choisir le type de mission voulue sur l'interface. Finalement, cliquer sur **Lancer la mission** pour une nouvelle mission, ou sur **Historique des missions** pour consulter les anciennes missions. Il est possible de lancer une mission *en simulation* ou  *en réel* en cochant la bascule sur la page d'accueil du site web.\
Il est également possible de se connecter au site web à partir de différents appareils lorsque l'application est lancée. Pour ce faire, il faut récupérer l'adresse ip de l'appareil utilisé pour lancer l'application web et l'utiliser à la place du **localhost** dans l'URL du site web (l'URL sera alors *http://{adresse_ip}:4200/home*)

## Pour lancer les tests automatisés :

Les tests automatisés peuvent être lancés dans chacun des sous répértoires (client et server) en exécutant la commande ```make test```.
Cette commande permettra de lancer les tests du client et du serveur. Il est à noter que les tests du client utilisent Chrome.
Il est possible soit d'installer Chrome, ou de se diriger vers la page web http://localhost:9876/ une fois les tests clients lancés.

Pour les tests des logiciels embarqués, une procédure de tests détaillée est disponible sur le fichier **Test.pdf**, disponible à la racine du projet, dans le répértoire ***INF3995-103***.

## Choix des conventions :

- Station au sol :\
	La station au sol a le rôle de station de contrôle pour les robots et est sous forme d'application web, avec une interface utilisateur (client) et un serveur. L'interface utilisateur a été implémentée en **Angular**, et communique avec un serveur en **NodeJS**. Les deux utilisent **TypeScript** comme language, et les conventions retenues pour ce dernier sont basées sur le guide **Airbnb**.

- Logiciel embarqué et simulation :\
	L'implémentation du logiciel embarqué et de la simulation est très similaire. Les deux se basent sur des scripts **Python** qui implémentent des ROS nodes qui seront utilisés par les robots ou par la simulation afin de transmettre de l'information. Les normes retenues pour les scripts Python sont les normes **pep-8**.
