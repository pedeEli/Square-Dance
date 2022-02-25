const createSwitch = (str: string, id: string): [HTMLLabelElement, HTMLInputElement] => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = id
    const label = document.createElement('label')
    label.classList.add('switch')
    label.htmlFor = id
    label.append(checkbox, str)
    const proxy = new Proxy(checkbox, {
        set: (target: any, p: string | symbol, value: any) => {
            if (p === 'disabled')
                label.classList.toggle('disabled', value)
            target[p] = value
            return true
        },
        get: (target: any, p: string | symbol) => {
            const value = target[p]
            if (value instanceof Function)
                return value.bind(target)
            return value
        }
    })
    return [label, proxy]
}

export {
    createSwitch
}