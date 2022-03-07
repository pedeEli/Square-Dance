// grid ---------------------------------------
const viewBox = {
    up: '0 0 384 512',
    down: '0 0 384 512',
    left: '0 0 448 512',
    right: '0 0 448 512'
}
const createDomino = (dir: Dir, index: number = -1) => {
    const div = document.createElement('div') as HTMLElement
    div.dataset.index = `${index}`
    div.classList.add('domino', dir)
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    svg.setAttributeNS(null, 'viewBox', viewBox[dir])
    svg.appendChild(use)
    use.setAttributeNS(null, 'href', `#${dir}-arrow`)
    div.appendChild(svg)
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
const drawGrid = <S extends GridState>(ref: HTMLElement, {getState}: State<S>) => {
    const cells = getState('cells')
    const grid = getState('grid')
    ref.style.setProperty('--cells', `${cells}`)
    const gridElements = [...ref.querySelectorAll('div') as any as Element[]]
    gridElements.forEach(element => element.remove())
    const created = new Set()

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        const emptySize = Math.floor(Math.abs(y - cells / 2 + .5))
        if (emptySize)
            ref.appendChild(createBuffer(emptySize, y, 'left'))

        for (let x = 0; x < row.length; x++) {
            if (created.has(toIndex(x, y, cells))) continue
            const cell = row[x]
            if (!cell) {
                ref.appendChild(createEmpty(toIndex(x, y, cells)))
                continue
            }
            
            ref.appendChild(createDomino(cell, toIndex(x, y, cells)))
            if (cell.match(/up|down/)) {
                created.add(toIndex(x + 1, y, cells))
                continue
            }
            const x_ = downIndex(x, y, getState('cells'))
            created.add(toIndex(x_, y + 1, cells))
        }
        
        if (emptySize)
            ref.appendChild(createBuffer(emptySize, y, 'right'))
    }
}
// --------------------------------------------


// index --------------------------------------
const fromIndex = (index: number, cells: number): [number, number] => {
    const x = index % cells
    const y = Math.floor(index / cells)
    return [x, y]
}
const toIndex = (x: number, y: number, cells: number): number => {
    return y * cells + x
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