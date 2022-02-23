const gridRef = document.querySelector('[data-grid]')
const arrows = {
    up: document.querySelector('[data-up-arrow]'),
    down: document.querySelector('[data-down-arrow]'),
    left: document.querySelector('[data-left-arrow]'),
    right: document.querySelector('[data-right-arrow]')
}

let cells = 2
let grid = [['', ''], ['', '']]

const createDomino = dir => {
    const div = document.createElement('div')
    div.classList.add('domino', dir)
    div.appendChild(arrows[dir].content.cloneNode(true))
    div.setAttribute(`data-${dir}`, '')
    return div
}

const createEmpty = (l = 1) => {
    const div = document.createElement('div')
    div.style.gridColumn = `span ${l}`
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
                gridRef.appendChild(createEmpty())
                continue
            }
            
            gridRef.appendChild(createDomino(cell))
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
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            if (row[x]) continue

            const x_ = downIndex(y, x)
            const y_ = y + 1

            if (Math.random() > .5) {
                row[x] = 'up'
                row[x + 1] = 'up'
                grid[y_][x_] = 'down'
                grid[y_][x_ + 1] = 'down'
                continue
            }
            row[x] = 'left'
            row[x + 1] = 'right'
            grid[y_][x_] = 'left'
            grid[y_][x_ + 1] = 'right'
        }
    }
}

const removeBlockingDominos = () => {
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y]
        for (let x = 0; x < row.length; x++) {
            const cell = row[x]
            if (!cell) continue
            if (cell === 'right' && x < row.length - 1 && row[x + 1] === 'left') {
                row[x] = ''
                row[x + 1] = ''
                continue
            }
            const x_ = downIndex(y, x)
            if (cell === 'down' && y < grid.length - 1 && grid[y + 1][x_] === 'up') {
                row[x] = ''
                grid[y + 1][x_] = ''
            }
        }
    }
}

drawGrid()


const animateIncrease = () => {
    const size = parseInt(getComputedStyle(gridRef).getPropertyValue('--size'))
    const targetCellSize = size / (cells + 2)
    gridRef.style.setProperty('--size', `${targetCellSize * cells}px`)
    gridRef.addEventListener('transitionend', () => {
        increaseGrid()
        gridRef.style.setProperty('--size', `${size}px`)
        drawGrid()
    }, {once: true})
}

const animateMove = () => {
    gridRef.classList.add('animate-move')
    gridRef.addEventListener('transitionend', () => {
        gridRef.classList.remove('animate-move')
        moveGrid()
        drawGrid()
    }, {once: true})
}


const increaseButton = document.querySelector('[data-increase]')
increaseButton.addEventListener('click', () => {
    animateIncrease()
})
const moveButton = document.querySelector('[data-move]')
moveButton.addEventListener('click', () => {
    animateMove()
    // moveGrid()
    // drawGrid()
})
const spawnButton = document.querySelector('[data-spawn]')
spawnButton.addEventListener('click', () => {
    spawnDominos()
    drawGrid()
})
const removeButton = document.querySelector('[data-remove]')
removeButton.addEventListener('click', () => {
    removeBlockingDominos()
    drawGrid()
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