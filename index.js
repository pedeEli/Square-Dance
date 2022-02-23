const gridRef = document.querySelector('[data-grid]')
const arrows = {
    up: document.querySelector('[data-up-arrow]'),
    down: document.querySelector('[data-down-arrow]'),
    left: document.querySelector('[data-left-arrow]'),
    right: document.querySelector('[data-right-arrow]')
}

let cells = 2
let grid = [['', ''], ['', '']]

const createDomino = (dir, index) => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    div.dataset.index = index
    return div
}

const createEmpty = (l, index) => {
    const div = document.createElement('div')
    div.style.gridColumn = `span ${l}`
    if (index !== undefined)
        div.dataset.index = index
    return div
}

const upIndex = (y, x) => {
    return x + Math.sign(y - cells / 2)
}

const downIndex = (y, x) => {
    return x - Math.sign(y - cells / 2 + 1)
}

const drawGrid = () => {
    gridRef.style.setProperty('--cells', cells)
    while (gridRef.firstChild)
        gridRef.firstChild.remove()
    const created = new Set()

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        const emptySize = Math.floor(Math.abs(y - cells / 2 + .5))
        if (emptySize)
            gridRef.appendChild(createEmpty(emptySize))

        for (let x = 0; x < row.length; x++) {
            if (created.has(y * cells + x)) continue
            const cell = row[x]
            if (!cell) {
                gridRef.appendChild(createEmpty(1, y * cells + x))
                continue
            }
            
            gridRef.appendChild(createDomino(cell, y * cells + x))
            if (cell.match(/up|down/)) {
                created.add(y * cells + x + 1)
                continue
            }
            const x_ = downIndex(y, x)
            created.add(y * cells + cells + x_)
        }
        
        if (emptySize)
            gridRef.appendChild(createEmpty(emptySize))
    }
}

const increaseGrid = () => {
    cells += 2
    let newGrid = [['', '']]

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        const newRow = ['']
        for (let x = 0; x < row.length; x++) {
            newRow.push(row[x])
        }
        newRow.push('')
        newGrid.push(newRow)
    }
    newGrid.push(['', ''])
    grid = newGrid
}

const moveGrid = () => {
    const toAdd = new Map()
    const newGrid = []

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        const newRow = []
        for (let x = 0; x < row.length; x++) {
            if (toAdd.has(y * cells + x))
                newRow.push(toAdd.get(y * cells + x))
            else 
                newRow.push('')
            
            const cell = row[x]
            if (cell === 'left') {
                newRow[x - 1] = 'left'
                continue
            }
            if (cell === 'right') {
                toAdd.set(y * cells + x + 1, 'right')
                continue
            }
            if (cell === 'up') {
                const x_ = upIndex(y, x)
                newGrid[y - 1][x_] = 'up'
                continue
            }
            if (cell === 'down') {
                const x_ = downIndex(y, x)
                toAdd.set((y + 1) * cells + x_, 'down')
            }
        }
        newGrid.push(newRow)
    }
    grid = newGrid
}

const spawnDominos = () => {
    const positions = []
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            if (row[x]) continue

            const x_ = downIndex(y, x)
            const y_ = y + 1

            const i1 = y  * cells + x
            const i2 = y_ * cells + x_

            if (Math.random() > .5) {
                row[x] = 'up'
                row[x + 1] = 'up'
                grid[y_][x_] = 'down'
                grid[y_][x_ + 1] = 'down'
                positions.push([i1, i2, 'horizontal'])
                continue
            }
            positions.push([i1, i2, 'vertical'])
            row[x] = 'left'
            row[x + 1] = 'right'
            grid[y_][x_] = 'left'
            grid[y_][x_ + 1] = 'right'
        }
    }
    return positions
}

const removeBlockingDominos = () => {
    const positions = []
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            const cell = row[x]
            if (!cell) continue

            const x_ = downIndex(y, x)
            const y_ = y + 1

            const i1 = y  * cells + x
            const i2 = y_ * cells + x_

            if (cell === 'right' && x < row.length - 1 && row[x + 1] === 'left') {
                positions.push([i1, i2, 'vertical'])
                row[x] = ''
                row[x + 1] = ''
                grid[y_][x_] = ''
                grid[y_][x_ + 1] = ''
                continue
            }
            if (cell === 'down' && y < grid.length - 1 && grid[y + 1][x_] === 'up') {
                positions.push([i1, i2, 'horizontal'])
                row[x] = ''
                row[x + 1] = ''
                grid[y_][x_] = ''
                grid[y_][x_ + 1] = ''
            }
        }
    }
    return positions
}


const animateMove = () => {
    const size = parseInt(getComputedStyle(gridRef).getPropertyValue('--size'))
    const targetCellSize = size / (cells + 2)
    gridRef.style.setProperty('--size', `${targetCellSize * cells}px`)
    gridRef.addEventListener('transitionend', () => {
        gridRef.classList.add('animate-move')
        setTimeout(() => {
            gridRef.addEventListener('transitionend', () => {
                gridRef.classList.remove('animate-move')
                gridRef.style.setProperty('--size', `${size}px`)
                increaseGrid()
                moveGrid()
                drawGrid()
            }, {once: true})
        })
    }, {once: true})
}

drawGrid()

// animating spawning in ----------------------------------------------------
const animateSpawn = () => {
    const spawnPositions = spawnDominos()
    spawnPositions.forEach(([i1, i2, dir], index) => {

        setTimeout(() => {
            animateSpawnDomino(i1, i2, dir)
        }, index * 200)
    })
}
const animateSpawnDomino = (i1, i2, dir, callback) => {
    const c1 = gridRef.querySelector(`[data-index="${i1}"]`)

    c1.classList.add('orange-box')
    c1.addEventListener('animationend', () => {
        const domino = fillOrangeBoxWithDominos(c1, dir)
        animateSpawnDominoFadeIn(domino, i1, i2, dir, c1, callback)
    }, {once: true})
}
const animateSpawnDominoFadeIn = (domino, i1, i2, dir, c1, callback) => {
    const c2 = c1.nextElementSibling
    const c3 = gridRef.querySelector(`[data-index="${i2}"]`)
    const c4 = c3.nextElementSibling

    domino.addEventListener('animationend', () => {
        c1.style.backgroundColor = 'hsl(var(--orange-clr) / 0)'
        c1.addEventListener('transitionend', () => {
            replaceEmptiesWithDominos(c1, c3, i1, i2, dir)
            c1.remove()
            c2.remove()
            c3.remove()
            c4.remove()
            if (typeof callback === 'function') callback()
        }, {once: true})
    }, {once: true})
}
const fillOrangeBoxWithDominos = (c1, dir) => {
    if (dir === 'horizontal') {
        const domino = createDomino('up')
        c1.append(domino, createDomino('down'))
        return domino
    }
    if (dir === 'vertical') {
        const domino = createDomino('left')
        c1.append(domino, createDomino('right'))
        return domino
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}
const replaceEmptiesWithDominos = (c1, c3, i1, i2, dir) => {
    if (dir === 'horizontal') {
        c1.after(createDomino('up', i1))
        c3.after(createDomino('down', i2))
        return
    }
    if (dir === 'vertical') {
        c1.after(createDomino('right', i1 + 1))
        c1.after(createDomino('left', i1))
        return
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}
// --------------------------------------------------------------------------

// animating remove ---------------------------------------------------------
const animateRemoveBlocking = () => {
    const positions = removeBlockingDominos()
    positions.forEach(([i1, i2, dir], index) => {
        setTimeout(() => {
            const ds = getRemoveByIndex(i1, i2, dir)
            ds.forEach(d => d.classList.add('animate-move', 'fade-out'))
        }, index * 200)
    })
}
const getRemoveByIndex = (i1, i2, dir) => {
    if (dir === 'horizontal') {
        const d1 = gridRef.querySelector(`[data-index="${i1}"]`)
        const d2 = gridRef.querySelector(`[data-index="${i2}"]`)
        return [d1, d2]
    }
    if (dir === 'vertical') {
        const d1 = gridRef.querySelector(`[data-index="${i1}"]`)
        const d2 = gridRef.querySelector(`[data-index="${i1 + 1}"]`)
        return [d1, d2]
    }
    throw new Error(`${dir} is not a valid direction. Must be 'horizontal' or 'vertical'`)
}
// --------------------------------------------------------------------------


const moveButton = document.querySelector('[data-move]')
moveButton.addEventListener('click', () => {
    animateMove()
})
const spawnButton = document.querySelector('[data-spawn]')
spawnButton.addEventListener('click', () => {
    animateSpawn()
})
const removeButton = document.querySelector('[data-remove]')
removeButton.addEventListener('click', () => {
    animateRemoveBlocking()
    // removeBlockingDominos()
    // drawGrid()
})
const showButton = document.querySelector('[data-show]')
showButton.addEventListener('click', () => console.log(grid))

const nextButton = document.querySelector('[data-next]')
nextButton.addEventListener('click', () => {
    removeBlockingDominos()
    increaseGrid()
    moveGrid()
    spawnDominos()
    drawGrid()
})