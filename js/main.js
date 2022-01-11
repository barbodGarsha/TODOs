const lists_container = document.querySelector('[data-lists]')

const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

lists_container.addEventListener('click', function(e) {
  if (e.target.classList.contains('list')) {
    selectedListId = e.target.dataset.listId
    saveAndRender()
  }
})


function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}

function render()
{
    clear_element(lists_container)
    render_lists()
}

function saveAndRender() {
  save()
  render()
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId)
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
      if (list.id === selectedListId) {
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