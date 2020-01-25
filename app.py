from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

import sys

# defines the app
# app gets name after the file
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://schrenkk@localhost:5432/todoapp'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 
# to define a db object
db = SQLAlchemy(app)
# Bootstrap database migrate commands
migrate = Migrate(app, db)

class Todo(db.Model):
  __tablename__ = 'todos'
  id = db.Column(db.Integer, primary_key=True)
  description = db.Column(db.String(), nullable=False)
  completed = db.Column(db.Boolean, nullable=False, default=False)
  list_id = db.Column(db.Integer, db.ForeignKey('todolists.id'), nullable=False)

  def __repr__(self):
      return f'<Todo {self.id} {self.description}>'


class TodoList(db.Model):
  __tablename__ = 'todolists'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(), nullable = False)
  todos = db.relationship('Todo', backref='list', lazy=True)

  def __repr__(self):
    return f'<TodoList {self.id} {self.name}>'


# Create a new todo item
@app.route('/todos/create', methods=['POST'])
def create_todo():
    error = False
    body = {} # an empty dictionary
    try:
        description = request.get_json()['description']
        todo = Todo(description=description, completed=False, list_id=1)
        db.session.add(todo)
        db.session.commit()
        body['id'] = todo.id
        body['completed'] = todo.completed
        body['description'] = todo.description
    except:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


# Mark a todo item as completed
@app.route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed_todo(todo_id):
  try:
    completed = request.get_json()['completed']
    print('completed', completed)
    todo = Todo.query.get(todo_id)
    todo.completed = completed
    db.session.commit()
  except:
    db.session.rollback()
  finally:
    db.session.close()
  return redirect(url_for('index'))


# Delete a todo item
@app.route('/todos/<todo_id>/delete', methods=['DELETE'])
def delete_todo(todo_id): 
  try:
    todo = Todo.query.get(todo_id)
    db.session.delete(todo)
    db.session.commit()
  except:
    db.session.rollback()
  finally:
    db.session.close()
  return jsonify({ 'success': True })


# Uncategorized list
@app.route('/lists/<list_id>')
def get_list_todos(list_id):
  return render_template('index.html',
  lists=TodoList.query.all(), 
  active_list=TodoList.query.get(list_id),
  todos=Todo.query.filter_by(list_id=list_id).order_by('id').all())


@app.route('/')
def index():
  return redirect(url_for('get_list_todos', list_id=1))




