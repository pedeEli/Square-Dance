import './styles/main.css'
import './styles/domino.css'
import './styles/grid.css'
import './styles/orangeBox.css'

import {drawGrid} from './ts/grid'
import {animateMove} from './ts/dominoMove'
import {animateSpawn} from './ts/dominoSpawn'
import {animateRemoveBlocking} from './ts/dominoRemoveBlocking'

drawGrid()


const moveButton = document.querySelector('[data-move]')!
moveButton.addEventListener('click', () => {
    animateMove()
})
const spawnButton = document.querySelector('[data-spawn]')!
spawnButton.addEventListener('click', () => {
    animateSpawn()
})
const removeButton = document.querySelector('[data-remove]')!
removeButton.addEventListener('click', () => {
    animateRemoveBlocking()
})