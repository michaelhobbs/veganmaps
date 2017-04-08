# veganmaps

Quick start:

1) git clone repo

2) npm install

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
