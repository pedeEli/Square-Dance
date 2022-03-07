import '@css/main.css'

import {initControls} from '@ts/ui/controls'
import {initState} from '@ts/state'

const adjustLayout = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const portrait = width < height
    document.body.classList.toggle('vertical', portrait)
}
adjustLayout()
window.addEventListener('resize', adjustLayout)

document.body.classList.add('info')

initState()
initControls()