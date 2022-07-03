let AppState = {
  mode: AppModes.Normal,
  linkItems: [],
  draggable: null,
  editable: false,
  addingItem: false,
  editingIndex: -1
}

let rawLinkItems = localStorage.getItem('user.linkItems')

if (rawLinkItems == null || rawLinkItems == '') {
  rawLinkItems = JSON.stringify(DefaultLinkItems)
  localStorage.setItem('user.linkItems', rawLinkItems)
}

let linkItems = JSON.parse(rawLinkItems)
if (!(linkItems instanceof Array)) {
  linkItems = DefaultLinkItems
  localStorage.setItem('user.linkItems', JSON.stringify(linkItems))
}

AppState.linkItems = linkItems

const queryMenu = () => {
  let moreItem = document.querySelector('.MoreItem')
  let selector = moreItem.getAttribute('data-menu')
  let menu = document.querySelector(selector)

  return menu
}

const queryPopout = () => {
  let moreItem = document.querySelector('.MoreItem')
  let selector = moreItem.getAttribute('data-popout')
  let popout = document.querySelector(selector)

  return popout
}

const MenuDistance = 10

const render = (target) => {
  let menu = queryMenu()
  let popout = queryPopout()

  if (!popout.classList.contains('Hidden') && AppState.mode == AppModes.Normal)
    return popout.classList.add('Hidden')
  
  if (popout.classList.contains('Hidden'))
    popout.classList.remove('Hidden')
  
  let parentCoords = target.getBoundingClientRect(),
    left, top
  
  left = parentCoords.right + MenuDistance
  if (parentCoords.right + popout.offsetWidth > document.documentElement.clientWidth) {
    left = document.documentElement.clientWidth - popout.offsetWidth - MenuDistance
  }
  
  top = parentCoords.top - target.style.paddingTop

  popout.style.left = left + "px"
  popout.style.top = top + scrollY + "px"

  if (AppState.mode != AppModes.Open) {
    return; // don't render menu items if not in open mode
  }

  modifyStyleIf(
    'display',
    _ => 'none',
    el => el.classList.contains('MoreFlex') ? 'flex' : 'block',
    AppState.editable,
    document.querySelectorAll('.MoreMenuHide')
  );

  modifyStyleIf(
    'display',
    _ => 'none',
    _ => 'block',
    !AppState.editable,
    document.querySelectorAll('.MoreMenuShow')
  )

  let mutatingSection = document.querySelector('.MoreMutableInteractable')
  if (AppState.mode = AppModes.Open) {
    clearElementChildren(mutatingSection)
    
    let sectionLabel = newElement(
      'span',
      ['MoreMenuItem', 'NoHover'],
      AppState.addingItem ? "Add to search menu" : "Edit menu item",
      { style: 'font-weight: bold;' }
    )
    
    let dynamicForm = document.createElement('div')
    dynamicForm.classList.add('DynamicLinkForm')
    
    // Name field
    let nameLabel = newElement('label', [], 'Search engine name', {
      for: 'LinkNameInput'
    })
    let nameInput = newElement('input', [], '', {
      id: 'LinkNameInput',
      type: 'text',
      placeholder: 'Name'
    })
    let nameErr = newElement('span', ['ErrMsg'], 'Name is required')

    // URL field
    let urlLabel = newElement('label', [], 'URL', {
      for: 'LinkUrlInput'
    })
    let urlInput = newElement('textarea', [], '', {
      id: 'LinkUrlInput',
      placeholder: 'Use %s in place of query',
      rows: 3
    })
    let urlErr = newElement('span', ['ErrMsg'], 'URL is required')

    // Bang field
    let bangLabel = newElement('label', [], 'Bang', {
      for: 'LinkBangInput'
    })
    let bangInput = newElement('input', [], '', {
      id: 'LinkBangInput',
      type: 'text',
      placeholder: 'Bang'
    })
    let bangErr = newElement('span', ['ErrMsg'], 'Bang is required')

    appendElements(dynamicForm, [
      newDiv(['MutableFormItem'], [nameLabel, nameInput, nameErr]),
      newDiv(['MutableFormItem'], [urlLabel, urlInput, urlErr]),
      newDiv(['MutableFormItem'], [bangLabel, bangInput, bangErr])
    ])

    if (AppState.editingIndex >= 0 && !AppState.addingItem) {
      nameInput.value = AppState.linkItems[AppState.editingIndex].name
      urlInput.value = AppState.linkItems[AppState.editingIndex].url
      bangInput.value = AppState.linkItems[AppState.editingIndex].bang
    }

    // Button control
    let controls = newElement('div', ['MutableFormItem', 'MutableMenuControls'])
    let saveButton = newElement(
      'button',
      ['MutableMenuButton', 'MutableMenuPrimary'],
      AppState.addingItem ? "Add" : "Save"
    )
    saveButton.addEventListener('click', () => {
      let name = nameInput.value.trim()
      let url = urlInput.value.trim()
      let bang = bangInput.value.trim()

      removeClass('Error', [nameInput, urlInput, bangInput])

      addClassIf('Error', !name, [nameErr])
      addClassIf('Error', !url, [urlErr])
      addClassIf('Error', !bang, [bangErr])

      if (hasClass('Error', [nameInput, urlInput, bangInput])) {
        return;
      }

      if (AppState.addingItem) {
        AppState.linkItems.push({
          name: name,
          url: url,
          bang: bang,
          enabled: false
        })
        render(target)
      } else {
        AppState.linkItems[AppState.editingIndex].name = name
        AppState.linkItems[AppState.editingIndex].url = url
        AppState.linkItems[AppState.editingIndex].bang = bang
        AppState.editingIndex = -1
        AppState.addingItem = true
        localStorage.setItem('user.linkItems', JSON.stringify(AppState.linkItems))
        render(target)
      }
    })

    let cancelButton = newElement('button', ['MutableMenuButton'], 'Cancel')
    cancelButton.addEventListener('click', () => {
      AppState.editable = false
      render(target)
    })

    appendElements(controls, [saveButton, cancelButton])

    appendElements(mutatingSection, [sectionLabel, dynamicForm, controls])
  }

  clearElementChildren(menu)

  let i = 0
  for (const linkItem of AppState.linkItems) {
    // Hide disabled items if not editing
    if (!linkItem.enabled && !AppState.editable) {
      continue;
    }

    let path = linkItem.url
      .replace('%s', 'hi there') // just using a dummy url
      .replace('&', encodeURIComponent('&')) // encode ampersands
      .replace('?', encodeURIComponent('?')) // encode question marks
      .replace('#', encodeURIComponent('#')) // encode hash marks

    // Link left
    let checkboxContainer = newElement('label', ['LinkEnableCheck'], '', {
      "data-hidden": "display"
    })
    addClassIf('Hidden', !AppState.editable, [checkboxContainer])
    
    let checkbox = newElement('input', ['LinkItemCheck'], '', {
      type: 'checkbox'
    })
    addAttributeIf('checked', '', linkItem.enabled, [checkbox])
    let checkboxLabel = newElement('span')
    appendElements(checkboxContainer, [checkbox, checkboxLabel])
    
    let favicon = newElement('img', ['LinkItemIcon'], '', {
      src: `${FaviconService}${encodeURIComponent(path)}`
    })
    let name = newText(linkItem.name, ['LinkItemName'])

    // Link right
    let icon = newText(
      AppState.editable ? linkItem.enabled ? 'drag_indicator' : 'delete' : '',
      ['material-symbols-rounded']
    )
    addClassIf('LinkItemGrabber', linkItem.enabled, [icon])
    addClassIf('Hidden', !AppState.editable, [icon])
    
    // Link item
    let left = newDiv(['LinkItemLeft'], [checkboxContainer, favicon, name])
    let right = newDiv(['LinkItemRight'], [icon])
    let inner = newDiv(['LinkItemInner'], [left, right], {
      "data-index": i
    })

    let el = newDiv(['LinkItem'], [inner])

    // fuzzy match on classes available on parents or children
    inner.addEventListener('click', e => {
      if (anyParentHasClass(e.target, 'LinkItemCheck')) {
        linkItem.enabled = e.target.checked
        localStorage.setItem('user.linkItems', JSON.stringify(AppState.linkItems))

        icon.innerText = linkItem.enabled ? "drag_indicator" : "delete"
      }

      if (anyChildHasClass(e.target, 'material-symbols-rounded') && AppState.editable) {
        let id = inner.getAttribute('data-index')
        if (!AppState.linkItems[id].enabled) {
          AppState.linkItems.splice(id, 1)
          localStorage.setItem('user.linkItems', JSON.stringify(AppState.linkItems))
          render(target)
        }
      }


      if (AppState.addingItem) {
        AppState.editingIndex = inner.getAttribute('data-index')
      } else {
        AppState.editingIndex = -1
      }
      AppState.addingItem = !AppState.addingItem
      render(target)
    })

    menu.appendChild(el)
    i++
  }
}

AppState.draggable = new Sortable.default(queryMenu(), {
  draggable: '.LinkItem',
  handle: '.LinkItemGrabber'
})

AppState.draggable.on('drag:start', e => {
  if (!AppState.editable) {
    e.cancel()
  }
  
  let id = e.data.source.children[0].getAttribute('data-index')
  if (id) {
    if (!AppState.linkItems[id].enabled) {
      e.cancel()
    }
  }
})

AppState.draggable.on('drag:stopped', () => {
  let linkItems = []
  for (const el of queryMenu().children) {
    let index = el.children[0].getAttribute('data-index')
    linkItems.push(AppState.linkItems[index])
  }
  AppState.linkItems = linkItems
  localStorage.setItem('user.linkItems', JSON.stringify(AppState.linkItems))
  render(document.querySelector('.MoreItem'))
})

document.querySelector('.MoreItem').addEventListener('click', e => {
  if (AppState.mode != AppModes.Normal) {
    AppState.mode = AppModes.Normal
  } else {
    AppState.mode = AppModes.Open
  }
  AppState.editable = false
  AppState.addingItem = false

  render(e.target)
})

document.querySelector('.CustomiseItem').addEventListener('click', e => {
  AppState.editable = true
  AppState.addingItem = true

  render(document.querySelector('.MoreItem'))
})

document.body.addEventListener('click', e => {
  
  // if we click outside of the menu, close it
  if (AppState.mode == AppModes.Open) {
    if (anyParentHasClass(e.target, 'MorePopout') || anyParentHasClass(e.target, 'MenuItem')) {
      return
    }

    AppState.mode = AppModes.Normal
    AppState.editable = false
    AppState.addingItem = false
    render(document.querySelector('.MoreItem'))
  }
}, true)
