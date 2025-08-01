import { CSS_Selector, Settings, Storage } from '.'
import pkg from '../package.json'
import defaultSettings from './default-settings.json'

const myConsole = console // save original console, just in case site overwrites handy methods such as log

const isFirefox = typeof browser !== 'undefined'
export const storage: Storage = {
  set: async function (items) {
    if (isFirefox) {
      return await browser.storage.local.set(items)
    } else {
      return await chrome.storage.local.set(items)
    }
  },
  get: async function (keys) {
    if (isFirefox) {
      return await browser.storage.local.get(keys)
    } else {
      return await chrome.storage.local.get(keys)
    }
  },
}

export async function readSettings(): Promise<Settings> {
  return (await storage.get('settings')).settings ?? defaultSettings
}

export const openSettingsPage = () => chrome.runtime.sendMessage({ action: 'openSettings' })

export function log(message: any, ...optionalParams: any[]) {
  myConsole.log(`%c${pkg.name}:`, 'color: orange; font-weight: bold', message, ...optionalParams)
}

export function error(message: any, ...optionalParams: any[]) {
  myConsole.error(`%c${pkg.name}:`, 'color: orange; font-weight: bold', message, ...optionalParams)
}

export async function awaitElement(selector: CSS_Selector): Promise<Element> {
  /* https://stackoverflow.com/a/61511955 */

  return await new Promise((resolve) => {
    const elm = document.querySelector(selector)
    if (elm != null) {
      return resolve(elm)
    }
    const observer = new MutationObserver(() => {
      const elm = document.querySelector(selector)
      if (elm !== null) {
        observer.disconnect()
        return resolve(elm)
      }
    })

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document, {
      childList: true,
      subtree: true,
    })
  })
}
