
const new_list_form = document.querySelector('[data-new-list-form]')
const new_list_input = document.querySelector('[data-new-list-input]')
const lists_container = document.querySelector('[data-lists]')
const delete_list_button = document.querySelector('[data-delete-list]')
const list_display_container = document.querySelector('[data-list-display-container]')
const list_title_element = document.querySelector('[data-list-title]')
const list_count_element = document.querySelector('[data-list-count]')
const tasks_container = document.querySelector('[data-tasks]')
const task_template = document.getElementById('task=template')

const new_task_form = document.querySelector('[data-new-task-form]')
const new_task_input = document.querySelector('[data-new-task-input]')
const clear_complete_tasks_button = document.querySelector('[data-clear-complete-tasks-button]')

const lists_menu = document.querySelector('[data-lists-menu]')
const tasks_div = document.querySelector('[data-tasks-div]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selected_list_id'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selected_list_id = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) || null
let is_lists_menu_open = false;
let window_width = window.innerWidth;

window.addEventListener('resize', function(event) {
  var media_query_menu = 'screen and (max-width:835px)'
  var have_menu = window.matchMedia(media_query_menu).matches 
  if(window_width == window.screen.width) return
  if(!have_menu) {
    lists_menu.style.transform = "translateX(0%)"
    is_lists_menu_open = true
  }
  else {
    lists_menu.style.transform = "translateX(-90%)"
    is_lists_menu_open = false
  }
}, true);

tasks_div.addEventListener('click', function(e) {
  var media_query_menu = 'screen and (max-width:835px)'
  var have_menu = window.matchMedia(media_query_menu).matches  
  if(!have_menu) return
  if(is_lists_menu_open) {
    lists_menu.style.transform = "translateX(-90%)"   
    is_lists_menu_open = false
  }
})

lists_menu.addEventListener('click', function(e) {
  var media_query_menu = 'screen and (max-width:835px)';
  var have_menu = window.matchMedia(media_query_menu).matches; if(!have_menu) return
  if(!is_lists_menu_open) {
    lists_menu.style.transform = "translateX(0%)"
    is_lists_menu_open = true
  }
})

tasks_container.addEventListener('click', function(e) {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selected_list = lists.find(list => list.id === selected_list_id)
    const selected_task = selected_list.tasks.find(task => task.id === e.target.id)
    selected_task.complete = e.target.checked
    save()
    render_task_count(selected_list)
  }
  else if(e.target.tagName.toLowerCase() === 'img') {
    const selected_list = lists.find(list => list.id === selected_list_id)
    selected_list.tasks = selected_list.tasks.filter(task => task.id !== e.target.id)
    save_and_render()
  }
})

new_task_form.addEventListener('submit', function(e) {
  e.preventDefault()
  const task_name = new_task_input.value
  if (task_name == null || task_name === '') return
  const task = create_task(task_name)
  new_task_input.value = null
  const selected_list = lists.find(list => list.id === selected_list_id)
  selected_list.tasks.push(task)
  save_and_render()
})


lists_container.addEventListener('click', function(e) {
  if (e.target.classList.contains('list')) {
    selected_list_id = e.target.dataset.listId
    save_and_render()
  }
})

new_list_form.addEventListener('submit', function(e) {
  e.preventDefault()
  const list_name = new_list_input.value
  if (list_name == null || list_name === '') return
  const list = create_list(list_name)
  new_list_input.value = null
  lists.push(list)
  save_and_render()
})

delete_list_button.addEventListener('click', function(e) {
  lists = lists.filter(list => list.id !== selected_list_id)
  selected_list_id = null
  save_and_render()
})

clear_complete_tasks_button.addEventListener('click', function(e) {
  const selected_list = lists.find(list => list.id === selected_list_id)
  selected_list.tasks = selected_list.tasks.filter(task => task.complete !== true)
  save_and_render()
})

function create_list(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function create_task(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function render()
{
  clear_element(lists_container)
  render_lists()

  const selected_list = lists.find(list => list.id === selected_list_id)
  
  if (selected_list == null) {
    list_display_container.style.display = 'none'
  } else {
    list_display_container.style.display = ''
    list_title_element.innerText = selected_list.name
    render_task_count(selected_list)
    clear_element(tasks_container)
    render_tasks(selected_list)
  }
}

function save_and_render() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selected_list_id)
}


function render_lists() {
    if(lists.length > 0) {
        const sidebar = document.createElement('div')
        sidebar.classList.add("lists-cta__sidebar")
        lists_container.appendChild(sidebar)
    }
    lists.forEach(function(list){
      const lists_item = document.createElement('p')
      lists_item.dataset.listId = list.id
      lists_item.classList.add('list')
      lists_item.innerText = list.name
      if (list.id === selected_list_id) {
        lists_item.classList.add('selected')
      }
      lists_container.appendChild(lists_item)
    })
  }

function render_tasks(selected_list) {
  selected_list.tasks.forEach(function(task) {
    const task_element = document.importNode(task_template.content, true)
    const delete_button = task_element.querySelector('img')
    delete_button.id = task.id
    const checkbox = task_element.querySelector('input')
    checkbox.id = task.id
    checkbox.checked = task.complete
    const text = task_element.querySelector('p')
    text.innerText = task.name
    tasks_container.appendChild(task_element)
  })
}  

function render_task_count(selected_list) {
  const incomplete_task_count = selected_list.tasks.filter(task => !task.complete).length
  const taskString = incomplete_task_count === 1 ? "task" : "tasks"
  list_count_element.innerText = `${incomplete_task_count} ${taskString} remaining`
}

function clear_element(element)
{
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}


render()