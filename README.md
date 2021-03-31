CMPUT404-group-project
=============================
CMPUT404 Winter 2021 group project (Team 2). Our project is to create a distributed social network!!

Group members:
- Vinny Luu
- Justin Mah
- Monica Uwalaka
- Raymond Sarinas
- Christian Lo

# Deployment Link
Our project's back-end is deployed on Heroku [here](https://cyver.herokuapp.com/api/). The front-end is deployed on netlify [here](https://qonnectionz.netlify.app/).

# Backend setup
Assuming you already postgres installed and a superuser created, first create a postgres database for our server:
```bash
psql 
CREATE DATABASE myproject; # Inside psql shell
```
Next, setup a virtual environment and install requirements:
```bash
cd back-end/
virtualenv venv --python=python3
source venv/bin/activate # Assuming Linux/MacOS
pip install -r requirements.txt
cd api/
python manage.py migrate
```
From now on, to run the server from the back-end/api/ directory (ensure your virtualenv is always activated first):
```bash
python manage.py runserver
```

# Front-end setup
Our front-end is a React app, which can be started using the following commands.
Ensure that the back-end is also running, or else the front-end will just display a blank page.
After running the following commands, you can access the front-end at [http://localhost:3000/](http://localhost:3000/) by default.
```bash
cd front-end
npm install # only on first run, or whenever dependencies are updated
npm start
```

# How to run tests
We have model and endpoint tests for our back-end. Ensure that your virtualenv to run the back-end is activated before running the below commands.
```bash
cd back-end/api
python manage.py test
```

Contributors / Licensing
========================

LICENSE'D under the Apache 2 license by Vinny Luu, Justin Mah, Monica Uwalaka, Raymond Sarinas, Christian Lo
