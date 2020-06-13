from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import setup_db, TodoList, Todo

import sys
import os


def create_app(test_config=None):

  app = Flask(__name__)
  setup_db(app)


  # ------------------------------------------------ #
  #  Controller
  # ------------------------------------------------ #

  @app.route('/')
  def index():
    return redirect(url_for('get_list_todos', list_id=1))

  # Create a new list item
  @app.route('/lists/create', methods=['POST'])
  def create_list():
    error = False
    body = {}
    try:
      listname = request.get_json()['name']
      neue_liste = TodoList(name=listname)
      db.session.add(neue_liste)
      db.session.commit() 
      body['id'] = neue_liste.id
      body['name'] = neue_liste.name
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


  # Create a new todo item
  @app.route('/todos/create', methods=['POST'])
  def create_todo():
      error = False
      body = {} # an empty dictionary
      try:
          description = request.get_json()['description']
          requested_list = request.get_json()['list']      
          
          # Neues Todo Item
          todo = Todo(description=description, completed=False)
          todo.list = TodoList.query.filter_by(name=requested_list).one()
          db.session.add(todo)
          db.session.commit()
          body['id'] = todo.id
          body['completed'] = todo.completed
          body['description'] = todo.description
          body['list_id'] = todo.list_id
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
      todo = Todo.query.get(todo_id)
      todo.completed = completed
      db.session.commit()
    except:
      db.session.rollback()
    finally:
      db.session.close()
    return redirect(url_for('index'))


  # Mark a list item as completed and all its todos
  @app.route('/lists/<list_id>/set-completed', methods=['POST'])
  def set_completed_list(list_id):
    error = False
    body = {} # an empty dictionary
    try:
      completed = request.get_json()['completed']
      list_completed = TodoList.query.get(list_id)
      list_completed.completed = completed
      list_todos = list_completed.todos
      for todo in list_todos:
        todo.completed = completed
      db.session.commit()
      body['list_id'] = list_completed.id
      body['completed'] = completed
    except:
      error = True
      db.session.rollback()
      print(sys.exc_info())
    finally:
      db.session.close()
    return jsonify(body)

    
  # Delete a todo item
  @app.route('/lists/todos/<todo_id>/delete', methods=['DELETE'])
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


  # Delete a list item
  @app.route('/lists/<listId>/delete', methods=['DELETE'])
  def delete_list(listId):
    try:
      list_to_delete = TodoList.query.get(listId)
      todos_to_delete = list_to_delete.todos
      for todo in todos_to_delete:
        db.session.delete(todo)
      db.session.delete(list_to_delete)
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
    lists=TodoList.query.order_by('id').all(), 
    active_list=TodoList.query.get(list_id),
    todos=Todo.query.filter_by(list_id=list_id).order_by('id').all())

  return app


APP = create_app()

if __name__ == '__main__':
    APP.run(host='0.0.0.0', port=8080, debug=True)
