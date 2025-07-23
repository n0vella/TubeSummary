import { render } from 'preact'
import './popup.css'
import { floppy } from '../Icons'

function Popup() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // GM_setValue('settings', {
        // ...settings,
        // prompt: e.currentTarget.prompt.value,
        // endpoint: e.currentTarget.endpoint.value,
        // model: e.currentTarget.model.value,
        // apiKey: e.currentTarget.apiKey.value,
        // })
      }}
      className="flex h-[400px] w-[600px] flex-col gap-3 p-2"
    >
      <h1>Settings</h1>
      <div className="flex flex-col gap-2 overflow-y-auto pr-6">
        <div className="flex flex-col gap-5 pl-2">
          <h2>AI prompt</h2>

          <div className="pl-4">
            <textarea name="prompt" className="flex h-full min-h-32 w-full" defaultValue={'prompt'}></textarea>
          </div>
        </div>

        {/* api settings */}
        <div className="flex flex-col gap-5 !pl-2">
          <h2>API settings</h2>
          <div className="flex w-5/6 flex-col gap-5 pb-10 !pl-4">
            <label className="flex justify-between">
              <span className="text-nowrap">Endpoint:</span>
              <input name="endpoint" defaultValue={'endpoint'} className="user-input w-3/4" />
            </label>
            <label className="flex justify-between">
              <span className="text-nowrap">Model:</span>
              <input name="model" defaultValue={'model'} className="user-input w-3/4" />
            </label>
            <label className="flex justify-between">
              <span className="text-nowrap">API Key:</span>
              <input name="apiKey" type="password" defaultValue={'apiKey'} className="user-input w-3/4" />
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-5">
        <button className="w-10 rounded-lg bg-green-500 p-1 text-white">{floppy}</button>
      </div>
    </form>
  )
}

const root = document.querySelector<HTMLDivElement>('#popup-root')
render(<Popup />, root)
