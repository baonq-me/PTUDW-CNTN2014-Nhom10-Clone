#!/bin/bash

nodemon -e js,ejs Final-Project/app.js &
while [ : ]
do
	git pull
	git add *
	git commit -m "File uploaded by users"
	git push
	sleep 10
done
