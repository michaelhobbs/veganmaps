# veganmaps

Quick start:

1) git clone repo

2) npm install  
  npm install -g bower // so that bower is a command  
  // cheap VPS may not have sufficient memory. Enable swap if this is the case (npm install gets killed all the time)  
  https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04  


3) bower install

4) install mongodb (pacman -S mongodb //archlinux)  
//check service running  
systemctl status mongodb  
//start if not running  
systemctl start mongodb  

5) mkdir db  
mongod --dbpath db

6) node app.js

7) http://localhost:3000/maps


## Status
Project abandoned after POC built.  
Uses outdated frameworks (angularJS).  
Map: Leaflet
BE: Express
DB: MongoDB
FE/BE interface: Websockets & API

## Screenshots
![front page mobile](screenshots/prototype_front_page.png)  
![front page desktop](screenshots/prototype_front_page_v2.png)  
![map](screenshots/leaflet.png)

