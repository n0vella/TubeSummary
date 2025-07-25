import { render } from 'preact'
import './popup.css'
import { closeIcon, floppy } from '../Icons'
import useSettings from '../modules/settings'

function Popup() {
  const [settings, save] = useSettings()

  if (!settings) return <></>

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save({
          prompt: e.currentTarget.prompt.value,
          endpoint: e.currentTarget.endpoint.value,
          model: e.currentTarget.model.value,
          apiKey: e.currentTarget.apiKey.value,
        })
        window.close()
      }}
      className="flex h-[400px] w-[600px] flex-col gap-2 overflow-y-auto p-2 pr-6"
    >
      <h1>Settings</h1>
      <div className="flex flex-col gap-5 pl-2">
        <h2>AI prompt</h2>

        <div className="pl-4">
          <textarea name="prompt" className="flex h-full min-h-32 w-full" defaultValue={settings.prompt}></textarea>
        </div>
      </div>

      {/* api settings */}
      <div className="flex flex-col gap-5 pl-2">
        <h2>API settings</h2>
        <div className="flex w-5/6 flex-col gap-3 pb-5 pl-4">
          <label className="flex justify-between">
            <span className="text-nowrap">Endpoint:</span>
            <input name="endpoint" defaultValue={settings.endpoint} className="user-input w-3/4" />
          </label>
          <label className="flex justify-between">
            <span className="text-nowrap">Model:</span>
            <input name="model" defaultValue={settings.model} className="user-input w-3/4" />
          </label>
          <label className="flex justify-between">
            <span className="text-nowrap">API Key:</span>
            <input name="apiKey" type="password" defaultValue={settings.apiKey} className="user-input w-3/4" />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-1">
        <button className="w-10 cursor-pointer rounded-lg bg-green-500 p-1 text-white hover:brightness-110">{floppy}</button>
        <button type="button" onClick={window.close} className="w-10 cursor-pointer rounded-lg bg-red-500 p-1 text-white hover:brightness-110">
          {closeIcon}
        </button>
      </div>
    </form>
  )
}

const root = document.querySelector<HTMLDivElement>('#popup-root')
render(<Popup />, root)
