# Todo App

## Getting Started


### Python 3.7
Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python).

### Virtual Environment
Once you installed the latest python version setup a virtual environment and activate it. See [further instructions](https://docs.python.org/3/tutorial/venv.html "Python Tutorials") on how to create virtual environments.
```
. venv/bin/activate
```

### PIP Dependencies
All the dependecies are listed in the requirements.txt. The following commands will install all required packages.
```bash
pip3 install -r requirements.txt
```

### Environment Variables
The app is configured by env variables that are stored in the config.sh.
```bash
. config.sh
```

### Setup the database 

Setup a new Postgres database. You need to have Postgres and psql installed.

```bash
createdb todoapp && psql -d todoapp -f todoapp.sql
```

After setting up the database run the migrations.

```bash
python3 manage.py db migrate
python3 manage.py db upgrade
```

### Run Flask in DevMode 

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
```

