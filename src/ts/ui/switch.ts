type SwitchElement = HTMLLabelElement & {on: boolean}

const createSwitch = (str: string, id: string) => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = id
    const label = document.createElement('label') as SwitchElement
    label.classList.add('switch')
    label.htmlFor = id
    label.append(checkbox, str)
    Object.defineProperty(label, 'on', {
        get: () => checkbox.checked,
        set: (value: boolean) => checkbox.checked = value
    })
    return label
}

export {
    createSwitch
}