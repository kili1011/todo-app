// ------------------------------------------------------------------ //
// Document Loaded
// ------------------------------------------------------------------ //
listenerTodoItems()


// ------------------------------------------------------------------ //
// Status Bar.
// ------------------------------------------------------------------ //

/**
 * Checks how many checkboxes are checked
 * 
 * RETURNS 
 * Items_checked int: the amount of checked checkboxes.
 */
function checkCheckboxes(){
    var todo_items = $( "input.check-completed" )
    var index_todo_items = todo_items.length
    var items_checked = 0

    for(let i=0; i<index_todo_items; i++){
        if (todo_items[i].checked == true){
            items_checked++
        }
    }

    return items_checked
}


/**
 * Appends div element to status to display the status.
 * 
 * RETURNS
 * The width of the status bar.
 */
function buildProgressBar(){
    // create the div element and add classname
    bar = document.createElement('div')
    bar.className = "progress"
            
    // Append bar
    $('#status_bar').append(bar)

    // calculate width of progress bar
    $('.progress').width(function calcWidth(){
        var todo_items = $( "input.check-completed" ).length
        var checked_todo_items = checkCheckboxes()
        var status_bar_width = $('#status_bar').width()
        
        return status_bar_width * checked_todo_items / todo_items
    })
}


// ------------------------------------------------------------------ //
// Events.
// ------------------------------------------------------------------ //

/**
 * Add event listener for checkboxes of todo items
 */
function listenerTodoItems(){
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
    
                // build progress bar
                $(".progress").remove();
                buildProgressBar();
            })
            .catch(function(){
                document.getElementById('error').className = '';  
            })
        }
    }
}

/**
 * Add event listener for checkboxes of list items
 */
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
*   Delete todo items 
*/
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

/**
 * Delete list items
 */
const deleteItems = document.querySelectorAll('.delete-list');
for(let i = 0; i < deleteItems.length; i++){
    const deleteItem = deleteItems[i];
    deleteItem.onclick = e => {
        listId = e.target.dataset['id'];
        console.log('list id to delete: ' + listId)

        // Avoid deleting Uncategorized
        if (listId==1){
            var error = document.getElementById('error-lists')
            console.log(error)
            error.className="";
            error.innerHTML = "Uncategorized can't be deleted";
        } else {
            fetch('/lists/' + listId + '/delete', {
                method: 'DELETE',
            })
            .then(function(){
                todos_to_delete = document.querySelectorAll('.check-completed')
                for(let i = 0; i < todos_to_delete.length; i++){
                    todo_to_delete = todos_to_delete[i]
                    console.log(todo_to_delete)
                    if(listId == todo_to_delete.dataset['listId']){
                        todo_to_delete.parentNode.remove()
                    }
                }
                window.location = '/lists/1'
            })
            .catch(function(){
                document.getElementById('error-lists').className = ''
            })
        }
    }
}


// ------------------------------------------------------------------ //
// Submits.
// ------------------------------------------------------------------ //

/**
 *   Adds a new Todo Item
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
        const li = document.createElement('li')
        // input
        const checkbox = document.createElement('input')
        checkbox.className = 'check-completed'
        checkbox.type = 'checkbox'
        checkbox.setAttribute('data-id', jsonResponse.id)
        checkbox.setAttribute('data-list-id', jsonResponse.list_id)
        li.appendChild(checkbox)
        const text = document.createTextNode(' ' + jsonResponse.description)
        li.appendChild(text)
        const deleteButton = document.createElement('button')
        deleteButton.className = 'delete-todo'
        deleteButton.setAttribute('data-id', jsonResponse.id)
        deleteButton.innerHTML = '&cross;'
        li.appendChild(deleteButton)
        // Append Todo Item
        document.getElementById('todos').appendChild(li)
        // error
        document.getElementById('error').className = 'hidden'
        // clear form
        document.getElementById('description').value = ""
        // Update events on todo items
        listenerTodoItems()
    })
    .catch(function(){
        document.getElementById('error').className = ''
    })
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
        // errors, clear & window
        document.getElementById('error-lists').className = 'hidden';
        document.getElementById('listname').value = "";
        window.location = jsonResponse.id
    })
    .catch(function(){
        document.getElementById('error-lists').className = '';
    });
}









