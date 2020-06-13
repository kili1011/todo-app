

### Setup the database 

After setting up the database run the migrations.

```bash
python3 manage.py db migrate
python3 manage.py db upgrade
```


# Heroku 

## Configuration

Check the configuration variables on Heroku. 
```bash
heroku config --app fierce-falls-89383
```

## Database

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

To connect to database
```bash
heroku pg:psql
```

## Log Stream
If your application/framework emits logs on database access, you can retrieve them through [Heroku’s log-stream](https://devcenter.heroku.com/articles/logging#log-retrieval):
```bash 
heroku logs
```

In real-time tail
```bash
heroku logs --tail
```