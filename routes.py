import sys
from flask import Blueprint, render_template, redirect, jsonify, abort, flash, url_for, request
from flask import current_app as app
from models import TodoList, Todo, db

main = Blueprint('main', __name__)

# ------------------------------------------------ #
#  Controller
# ------------------------------------------------ #

@main.route('/')
def index():
    return redirect(url_for('main.get_list_todos', list_id=1))


@main.route('/lists/<list_id>')
def get_list_todos(list_id):
    '''
    Uncategorized list
    '''
    # get status
    todos=Todo.query.filter_by(list_id=list_id).order_by('id').all()
    y = len(todos)  
    x = 0 
    for todo in todos:
      if (todo.completed == True):
        x += 1
    if x == 0:
      status = 0
    else:
      status = round(x / y * 100)

    return render_template('index.html',
        lists=TodoList.query.order_by('id').all(), 
        active_list=TodoList.query.get(list_id),
        todos=todos, 
        status=status)


@main.route('/lists/create', methods=['POST'])
def create_list():
    '''
    Create a new list item
    '''
    error = False
    body = {}
    try:
        listname = request.get_json()['name']
        neue_liste = TodoList(name=listname)
        db.session.add(neue_liste)
        db.session.commit() 
        body['id'] = neue_liste.id
        body['name'] = neue_liste.name
    except Exception:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


@main.route('/todos/create', methods=['POST'])
def create_todo():
    '''
    Create a new todo item
    '''
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
    except Exception:
        error = True
        db.session.rollback()
        print(sys.exc_info())
    finally:
        db.session.close()
    if error:
        abort(400)
    else:
        return jsonify(body)


@main  .route('/todos/<todo_id>/set-completed', methods=['POST'])
def set_completed_todo(todo_id):
    '''
    Mark a todo item as completed
    '''
    try:
        completed = request.get_json()['completed']
        todo = Todo.query.get(todo_id)
        todo.completed = completed
        db.session.commit()
    except Exception:
        db.session.rollback()
    finally:
        db.session.close()
    return redirect(url_for('main.index'))


@main.route('/lists/<list_id>/set-completed', methods=['POST'])
def set_completed_list(list_id):
    '''
    Mark a list item as completed and all its todos
    '''
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

    
@main.route('/lists/todos/<todo_id>/delete', methods=['DELETE'])
def delete_todo(todo_id): 
    ''' 
    Delete a todo item
    '''
    try:
      todo = Todo.query.get(todo_id)
      db.session.delete(todo)
      db.session.commit()
    except Exception:
      db.session.rollback()
    finally:
      db.session.close()
    return jsonify({ 'success': True })


@main.route('/lists/<listId>/delete', methods=['DELETE'])
def delete_list(listId):
    '''
    Delete a list item
    '''
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

