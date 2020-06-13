/**
*   Delete 
*/

// Delete todo items 
const deletebuttons = document.querySelectorAll('.delete-todo');
for(let i = 0; i < deletebuttons.length; i++){
    const delbtn = deletebuttons[i];
    delbtn.onclick = function(e){
        console.log(e);
        const deleteId = e.target.dataset['id'];
        console.log(deleteId)
        fetch('todos/' + deleteId + '/delete', {
            method: 'DELETE',
        })
        .then(function(){
            const item = e.target.parentElement;
            item.remove();
        })
        .then(function(){
            document.getElementById('error').className = 'hidden'; 
        })
        .catch(function(){
            document.getElementById('error').className = '';  
        })
    }
}
// Delete list items
const deleteItems = document.querySelectorAll('.delete-list');
for(let i = 0; i < deleteItems.length; i++){
    const deleteItem = deleteItems[i];
    deleteItem.onclick = e => {
        listId = e.target.dataset['id'];
        console.log('list id to delete: ' + listId)

        // Avoid deleting Uncategorized
        if (listId==1){
            document.getElementById('error-lists').className = ''; 
        } else {
            fetch('/lists/' + listId + '/delete', {
                method: 'DELETE',
            })
            .then(function(){
                todos_to_delete = document.querySelectorAll('.check-completed');
                for(let i = 0; i < todos_to_delete.length; i++){
                    todo_to_delete = todos_to_delete[i]
                    console.log(todo_to_delete)
                    if(listId == todo_to_delete.dataset['listId']){
                        todo_to_delete.parentNode.remove();
                    }
                }
                document.getElementById('active-list').innerText = 'List was successfully removed';
                deleteItem.parentNode.remove();
            })
            .catch(function(){
                document.getElementById('error-lists').className = '';  
            })
        }
    }
}


/**
 *   Checkboxes 
 */
// Checkboxes for Todo Items
const checkboxes = document.querySelectorAll('.check-completed');
for(let i = 0; i < checkboxes.length; i++){
    const checkbox = checkboxes[i];
    checkbox.onchange = function(e){
        const newCompleted = e.target.checked;
        const todoId = e.target.dataset['id'];
        fetch('/todos/' + todoId + '/set-completed', {
            method: 'POST', 
            body: JSON.stringify({
                'completed': newCompleted
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(){
            document.getElementById('error').className = 'hidden';
        })
        .catch(function(){
            document.getElementById('error').className = '';  
        })
    }
}
 // Checkboxes for List Items
const list_checkboxes = document.querySelectorAll('.list-completed');
for(let i = 0; i < list_checkboxes.length; i++){
    const listCheckbox = list_checkboxes[i];
    listCheckbox.onchange = e => {
        list_completed = e.target.checked;
        list_completed_id = e.target.dataset['id'];
        console.log(e)
        fetch('/lists/' + list_completed_id + '/set-completed', {
          method: 'POST', 
          body: JSON.stringify({
              'completed': list_completed
          }), 
          headers: {
              'Content-Type': 'application/json'
          }  
        })
        .then(response => response.json())
        .then(jsonResponse => {
            const list_todos = document.querySelectorAll('.check-completed');
            for(let i = 0; i < list_todos.length; i++){
                list_todo = list_todos[i];
                if(list_todo.dataset['listId'] == jsonResponse.list_id){
                    list_todo.checked = jsonResponse.completed;
                }
            }
            document.getElementById('error-lists').className = 'hidden'; 
        })
        .catch(function(){
            document.getElementById('error-lists').className = '';  
        })
    }
}

/**
 *   New Todo Item
 */
document.getElementById('form').onsubmit = function(e){
    e.preventDefault();
    fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
            'list': document.getElementById('active-list').innerHTML,
            'description': document.getElementById('description').value
        }),
        // specify the content header type
        headers: {
            'Content-Type': 'application/json'
        }
    })
    // to manipulate the response
    .then(response => response.json())
    .then(jsonResponse => {
        // list item
        const li = document.createElement('li');
        // input
        const checkbox = document.createElement('input');
        checkbox.className = 'check-completed';
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-id', jsonResponse.id);
        checkbox.setAttribute('data-list-id', jsonResponse.list_id);
        li.appendChild(checkbox);
        const text = document.createTextNode(' ' + jsonResponse.description);
        li.appendChild(text);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-todo';
        deleteButton.setAttribute('data-id', jsonResponse.id);
        deleteButton.innerHTML = '&cross;';
        li.appendChild(deleteButton);
        document.getElementById('todos').appendChild(li);
        document.getElementById('error').className = 'hidden';
    })
    .catch(function(){
        document.getElementById('error').className = '';
    });
}

/**
 *   New List Item
 */
document.getElementById('list-form').onsubmit = function(e){
    e.preventDefault();
    console.log(e);
    fetch('/lists/create', {
        method: 'POST',
        body: JSON.stringify({
            'name': document.getElementById('listname').value
        }), 
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(jsonResponse => {
        const list_item = document.createElement('li');
        
        // checkbox
        const list_checkbox = document.createElement('input')
        list_checkbox.type = 'checkbox';
        list_checkbox.className = 'list-completed';
        list_checkbox.dataset['id'] = jsonResponse.id;
        // link
        const list_link = document.createElement('a');
        const list_name = document.createTextNode(jsonResponse.name);
        list_link.setAttribute('href', '/lists/' + jsonResponse.id);
        list_link.appendChild(list_name);   
        // delete button
        list_deleteButton = document.createElement('button');
        list_deleteButton.className = 'delete-list';
        list_deleteButton.dataset['id'] = jsonResponse.id;
        list_deleteButton.innerHTML = '&cross;';
        // Append child nodes
        list_item.appendChild(list_checkbox);
        list_item.appendChild(list_link);
        list_item.appendChild(list_deleteButton);
        document.getElementById('lists').appendChild(list_item);
        document.getElementById('error-lists').className = 'hidden';
    })
    .catch(function(){
        document.getElementById('error-lists').className = '';
    });
}