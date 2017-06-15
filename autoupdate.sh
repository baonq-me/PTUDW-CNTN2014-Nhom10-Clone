#!/bin/bash

nodemon -e js,ejs Final-Project/app.js &
while [ : ]
do
	git pull
	sleep 10
done
