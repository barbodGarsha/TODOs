
const new_list_form = document.querySelector('[data-new-list-form]')
const new_list_input = document.querySelector('[data-new-list-input]')
const lists_container = document.querySelector('[data-lists]')
const delete_list_button = document.querySelector('[data-delete-list]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selected_list_id'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selected_list_id = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

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

function create_list(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function render()
{
    clear_element(lists_container)
    render_lists()
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

function clear_element(element)
{
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}


render()