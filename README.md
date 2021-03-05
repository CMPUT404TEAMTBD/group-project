CMPUT404-group-project
=============================

Group project for CMPUT404

Contributors / Licensing
========================

LICENSE'D under the Apache 2 license by Vinny Luu, Justin Mah, Monica Uwalaka, Raymond Sarinas, Christian Lo


# Backend setup
Assuming you already postgres installed and a superuser created, first create a postgres database for our server:
```bash
psql 
CREATE DATABASE myproject
```
Next, setup a virtual environment and install requirements:
```bash
virtualenv venv --python=python3
cd back-end/
pip install requirements.txt
cd api/
python manage.py migrate
```
From now on, to run the server from the back-end/api/ directory:
```bash
python manage.py runserver
```
