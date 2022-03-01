import {getState} from '@ts/state'

// grid ---------------------------------------
const gridRef = document.querySelector('[data-grid]') as HTMLDivElement
const arrows = {
    up: document.querySelector('[data-up-arrow]') as HTMLTemplateElement,
    down: document.querySelector('[data-down-arrow]') as HTMLTemplateElement,
    left: document.querySelector('[data-left-arrow]') as HTMLTemplateElement,
    right: document.querySelector('[data-right-arrow]') as HTMLTemplateElement
}
const createDomino = (dir: Dir, index: number = -1) => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    div.dataset.index = `${index}`
    return div
}
const createEmpty = (index: number) => {
    const div = document.createElement('div')
    div.style.gridColumn = 'span 1'
    div.dataset.index = `${index}`
    return div
}
const createBuffer = (l: number, index: number, side: 'left' | 'right') => {
    const div = document.createElement('div')
    div.style.gridColumn = `span ${l}`
    div.dataset.buffer = `${index}`
    div.dataset.side = side
    return div
}
const drawGrid = () => {
    const cells = getState('cells')
    const grid = getState('grid')
    gridRef.style.setProperty('--cells', `${cells}`)
    while (gridRef.firstChild)
        gridRef.firstChild.remove()
    const created = new Set()

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        const emptySize = Math.floor(Math.abs(y - cells / 2 + .5))
        if (emptySize)
            gridRef.appendChild(createBuffer(emptySize, y, 'left'))

        for (let x = 0; x < row.length; x++) {
            if (created.has(toIndex(x, y, cells))) continue
            const cell = row[x]
            if (!cell) {
                gridRef.appendChild(createEmpty(toIndex(x, y, cells)))
                continue
            }
            
            gridRef.appendChild(createDomino(cell, toIndex(x, y, cells)))
            if (cell.match(/up|down/)) {
                created.add(toIndex(x + 1, y, cells))
                continue
            }
            const x_ = downIndex(x, y, getState('cells'))
            created.add(toIndex(x_, y + 1, cells))
        }
        
        if (emptySize)
            gridRef.appendChild(createBuffer(emptySize, y, 'right'))
    }
}
// --------------------------------------------


// index --------------------------------------
const fromIndex = (index: number, width: number): [number, number] => {
    const x = index % width
    const y = Math.floor(index / width)
    return [x, y]
}
const toIndex = (x: number, y: number, width: number): number => {
    return y * width + x
}
const upIndex = (x: number, y: number, cells: number) => {
    return x + Math.sign(y - cells / 2)
}
const downIndex = (x: number, y: number, cells: number) => {
    return x - Math.sign(y - cells / 2 + 1)
}
const oldToNewIndex = (i1: number, cells: number, ncells: number) => {
    const [x_, y_] = fromIndex(i1, cells)
    let x__: number
    if (y_ === cells / 2) {
        x__ = x_ + 1
    } else if (y_ > cells / 2) {
        x__ = x_ + 2
    } else {
        x__ = x_
    }
    const x = downIndex(x__, y_, ncells)
    const y = y_ + 1
    return toIndex(x, y, ncells)    
}
// --------------------------------------------

export {
    gridRef,
    arrows,
    createDomino,
    createEmpty,
    createBuffer,
    drawGrid,
    
    fromIndex,
    toIndex,
    upIndex,
    downIndex,
    oldToNewIndex
}