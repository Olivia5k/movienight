#!/bin/bash

cd $(dirname $(readlink -f $0))
source bin/activate
python manage.py runserver 8080 &
echo $! > lib/movienight.pid
