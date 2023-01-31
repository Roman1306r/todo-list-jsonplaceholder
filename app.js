const selectList = document.getElementById('user-todo') 
const todoList = document.getElementById('todo-list')
const inputNewTodo = document.getElementById('new-todo')
const form = document.querySelector('form');
const placeholderInput = inputNewTodo.getAttribute('placeholder')
let users = []
let todos = []


let count = 0;
function initApp() {
    async function getUsersName() {
        try {
            let url = 'https://jsonplaceholder.typicode.com/users';
            let responce = await fetch(url);
            let result = await responce.json()
            return result
        } catch (error) {
            hendlerError(error)
        }      
    }
    
    
    async function getTodos() {
        try {
            let url = 'https://jsonplaceholder.typicode.com/todos';
            let responce = await fetch(url);
            let result = await responce.json()
            return result
        } catch (error) {
            hendlerError(error)
        }       
    }

    if(count < 1) {
        getUsersName()
        .then(val => {
            for (let i = 0; i < val.length; i++) {
                const obj = val[i];
                users.push(obj)
                printUsersHtml(obj)
            }
        })
        count++
    }
    
    

    


    getTodos()
    .then(val => {
        for (let i = 0; i < val.length; i++) {
            const todo = val[i];
            todos.push(todo)
            printTodosHtml(todo)
        }
    })
    
}

document.addEventListener('DOMContentLoaded', initApp)








function printTodosHtml({completed, id, title, userId}) {
    const li = document.createElement('li')
    li.className = 'todo-item';
    li.dataset.id = id;
    li.innerHTML = `<span> ${title} <i>by</i> <b>${findNameForPrintTodos(userId)}</b></span>`;  
    const status = document.createElement('input')
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', headlerCheckbox)


    const close = document.createElement('span')
    close.className = 'close';
    close.innerHTML = '&times;';
    close.addEventListener('click', removeTodo)

    
    li.prepend(status)
    li.append(close)
    todoList.prepend(li)
}
function printUsersHtml(user) {
    const option = document.createElement('option');
    option.value = user.id
    option.innerText = user.name

    selectList.append(option)
}
function findNameForPrintTodos(id) {
    let currentObj = users.find(item => item.id == id)
    return currentObj.name
}
function headlerCheckbox() {
    const todoId = this.parentElement.dataset.id
    const completed = this.checked

    toggleTodoComplete(todoId, completed)
}
function removeTodo() {
    const id = this.parentElement.dataset.id
    removeTodoAsync(id)
}

inputNewTodo.onfocus = () => inputNewTodo.setAttribute('placeholder', '')
inputNewTodo.onblur = () => inputNewTodo.setAttribute('placeholder', placeholderInput)







//Добавление задачи
async function createTodo(todo) {
    try {
        const responce = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-type': 'application/json',
            }
        })
        const newTodo = await responce.json()
        printTodosHtml(newTodo)
    } catch (error) {
        hendlerError(error) 
    }  
}
function headlerForm(event){
    event.preventDefault()
    createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false
    })
    form.reset()
}
form.addEventListener('submit', headlerForm)




//Удаление задач
async function removeTodoAsync(id) {
    try {
        const responce = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
            }
        })
        if(responce.ok) {
            deleteTodo(id)
        } else {
            throw new Error('Failed to remove el!')
        }
    } catch (error) {
        hendlerError(error) 
    }  
}
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id)

    const todo = todoList.querySelector(`[data-id="${id}"]`)
    todo.querySelector('input').removeEventListener('change', headlerCheckbox)
    todo.querySelector('.close').removeEventListener('click', removeTodo)
    todo.remove()
}




//Изменение статуса
async function toggleTodoComplete(todoId, completed){
    try {
        const responce = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'PATCH',
            body: JSON.stringify({completed}),
            headers: {
                'Content-type': 'application/json',
            }
        })
        if(!responce.ok) {
            throw new Error('Failed to remove el!')
        }
    } catch (error) {
        hendlerError(error) 
    }  
}


//Выброс ошибки
function hendlerError(error){
    document.querySelector('.error').innerHTML = error
    document.querySelector('.error').classList.add('act')
    setTimeout(() =>  document.querySelector('.error').classList.remove('act'), 4000)
}







//UP BUTTON
const btnUp = document.querySelector('.up')
window.addEventListener('scroll', hideOrVisBtn)
btnUp.addEventListener('click', scrollUp)
function scrollUp(e) {
    document.querySelector('header').scrollIntoView({
        behavior: 'smooth'
    })
}
function hideOrVisBtn() {
    if(window.pageYOffset > 300) btnUp.classList.add('act')
    else btnUp.classList.remove('act')
}





//reset and update
const resetBtn = document.querySelector('.reset')
const updateBtn = document.querySelector('.update')
resetBtn.addEventListener('click', resetTodoList)
updateBtn.addEventListener('click', initApp)

function resetTodoList(e) {
    const elemTodoList = todoList.querySelectorAll('li')
    if(elemTodoList)   elemTodoList.forEach(el => el.remove())  
}
