const createSwitch = (str: string, id: string) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = id
    const label = document.createElement('label')
    label.classList.add('switch')
    label.htmlFor = id
    label.append(checkbox, str)
    return label
}

export {
    createSwitch
}