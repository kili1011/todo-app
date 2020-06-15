import os
from flask_sqlalchemy import SQLAlchemy


database_path = os.environ['DATABASE_URL']
db = SQLAlchemy()

# ------------------------------------------------ #
#  Database config.
# ------------------------------------------------ #

def setup_db(app, database_uri=database_path):
    app.config['SQLALCHEMY_DATABASE_URI'] = database_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ['SQLALCHEMY_TRACK_MODIFICATIONS']
    db.app = app
    db.init_app(app)
    db.create_all()

# ------------------------------------------------ #
#  Models.
# ------------------------------------------------ #

class Todo(db.Model):
  __tablename__ = 'todos'
  id = db.Column(db.Integer, primary_key=True)
  description = db.Column(db.String(), nullable=False)
  completed = db.Column(db.Boolean, nullable=False, default=False)
  list_id = db.Column(db.Integer, db.ForeignKey('todolists.id'), nullable=False)

  def __repr__(self):
      return f'<Todo {self.id} {self.description} - completed: {self.completed}>'


class TodoList(db.Model):
  __tablename__ = 'todolists'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(), nullable = False)
  completed = db.Column(db.Boolean, nullable=False, default=False)
  todos = db.relationship('Todo', backref='list', lazy=True)

  def __repr__(self):
    return f'<TodoList {self.id} {self.name}>'


  
