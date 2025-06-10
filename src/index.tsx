import App from './App'
import { awaitElement } from './utils'
import { render } from 'preact'
import './index.css'

async function main() {
  const dotButton = (await awaitElement('#button-shape')) as HTMLDivElement
  const container = document.createElement('div')
  dotButton.insertAdjacentElement('afterend', container)

  const menu = dotButton.parentElement
  if (menu) {
    menu.style.alignItems = 'center'
  }

  render(<App />, container)
}

async function loadCSS() {
  const style = GM_getResourceText('css')
  GM_addStyle(style)
}

main()
loadCSS()
