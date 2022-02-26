import {gridRef, grid, cells, drawGrid} from "."
import {delay} from "../util"

const reset = () => {
    const dominos = [...(gridRef.querySelectorAll('.domino') as any as Element[])]
    return Promise.all(dominos.map(async (domino, index) => {
        await delay(index * 500 * Math.log(dominos.length) / dominos.length)
        domino.classList.add('reset')
        if (index !== dominos.length - 1) return
        domino.addEventListener('transitionend', () => {
            grid.value = [['', ''], ['', '']]
            cells.value = 2
            gridRef.classList.remove('low-detail')
            drawGrid()
        })
    }))
}

export {
    reset
}