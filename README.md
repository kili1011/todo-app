

### Setup the database 

After setting up the database run the migrations.

```bash
python3 manage.py db migrate
python3 manage.py db upgrade
```


## Heroku 

### Run migrations
Once the app is deployed, run migrations by running:
```bash 
heroku run python manage.py db upgrade --app fierce-falls-89383
```

### Addons:Postgresql

To view the docs for postgresql on heroku 
```bash
heroku addons:docs heroku-postgresql
```
