const grid = document.querySelector('[data-grid]')
const arrows = {
    up: document.querySelector('[data-up-arrow]'),
    down: document.querySelector('[data-down-arrow]'),
    left: document.querySelector('[data-left-arrow]'),
    right: document.querySelector('[data-right-arrow]')
}

const createDomino = dir => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    return div
}


grid.append(createDomino('up'), createDomino('down'))