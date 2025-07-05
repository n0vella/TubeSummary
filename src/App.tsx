import { render } from 'preact'
import { useState } from 'preact/hooks'
import { useChat } from './modules/chat'
import { marked } from 'marked'
import { useEffect, useRef } from 'react'
import { brain, closeIcon, floppy, gear, send } from './Icons'
import { createRoot } from 'preact/compat/client'
import { Settings } from '.'

function SummaryPanel() {
  const [chat, ask, isResponding] = useChat()
  const avatarUrl = document.querySelector<HTMLImageElement>('#img')?.src

  return (
    <div id="yt-summary-panel" className="description-like !mt-8 flex w-full flex-col gap-10">
      {chat.length === 0 && <div className="flex !h-24 animate-pulse justify-center">{brain}</div>}
      {chat.map(({ role, content }) => {
        switch (role) {
          case 'assistant':
            return (
              <div className="flex gap-5 align-top">
                <span className="chat-avatar !bg-red-500 !p-1 !text-white">{brain}</span>
                <div dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} className="markdown-box" />
              </div>
            )
          case 'user':
            return (
              <div className="flex w-full justify-end gap-5 text-right align-top">
                <div dangerouslySetInnerHTML={{ __html: marked.parse(content) as string }} className="markdown-box justify-end" />
                <img src={avatarUrl} className="chat-avatar" />
              </div>
            )
        }
      })}

      <form
        id="chat-box"
        className="!mx-4 flex w-full"
        hidden={isResponding}
        onSubmit={(e) => {
          console.log(e.currentTarget.userInput.value)
          e.preventDefault()
          const value = e.currentTarget.userInput.value

          if (!value) {
            return
          }

          ask(value)
          e.currentTarget.userInput.value = ''
        }}
      >
        <textarea
          name="userInput"
          autoComplete="off"
          className="!mx-2 w-full resize-none !px-1 !py-0.5 outline-none"
          placeholder="Make your questions about this video"
          rows={1}
          onInput={(e) => {
            const self = e.currentTarget
            self.style.height = self.scrollHeight + 'px'
          }}
        ></textarea>
        <button className="w-10 cursor-pointer">{send}</button>
      </form>
    </div>
  )
}

export default function App() {
  const [dialogLoaded, setDialogLoaded] = useState(false)
  const root = useRef<ReturnType<typeof createRoot>>(null)
  const [showContext, setShowContext] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const settings = GM_getValue<Settings>('settings')

  function closeDialog() {
    setDialogLoaded(false)
    root.current?.unmount()
  }

  function loadDialog() {
    setDialogLoaded(true)
    const bottomRow = document.querySelector<HTMLDivElement>('#bottom-row')!

    const panel = bottomRow.querySelector<HTMLDivElement>('#yt-summary-panel')

    if (!panel) {
      const container = document.createElement('div')
      root.current = createRoot(container)

      bottomRow.insertBefore(container, bottomRow.firstChild)

      root.current.render(<SummaryPanel />)
    }
  }

  return (
    <div className="relative">
      <button
        title={dialogLoaded ? 'Close summary' : 'Generate summary'}
        className="yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono ml-3 flex aspect-square w-14 cursor-pointer rounded-full p-2"
        onClick={dialogLoaded ? closeDialog : loadDialog}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowContext(true)
        }}
      >
        {dialogLoaded ? closeIcon : brain}
      </button>
      {showContext && (
        <>
          <div className="context-close" onClick={() => setShowContext(false)} />

          <div className="context-menu absolute top-0 left-0 translate-8">
            <button
              className="flex items-center gap-2 px-2 text-lg"
              onClick={() => {
                setShowContext(false)
                setShowSettings(true)
              }}
            >
              <span className="w-12">{gear}</span>
              <span>Settings</span>
            </button>
          </div>
        </>
      )}
      {showSettings && (
        <>
          <div className="context-close" onClick={() => setShowSettings(false)} />
          <form
            onSubmit={(e) => {
              e.preventDefault()
              GM_setValue('settings', {
                ...settings,
                prompt: e.currentTarget.prompt.value,
              })
              setShowSettings(false)
            }}
            className="context-menu fixed top-1/2 left-1/2 h-[400px] w-[600px] -translate-1/2 !px-3"
          >
            <h1 className="text-4xl">Settings</h1>
            <h2 className="text-3xl">Prompt</h2>
            <span text-lg>{'Insert the flag {transcription} to be replaced by the actual transcription'}</span>
            <textarea name="prompt" className="description-like flex h-full min-h-20 w-full resize-none outline-none" defaultValue={settings.prompt}></textarea>
            <div className="flex justify-center gap-5">
              <button className="w-16 rounded-lg bg-green-500 p-1 text-white">{floppy}</button>
              <button type="button" onClick={() => setShowSettings(false)} className="w-16 rounded-lg bg-red-500 p-1 text-white">
                {closeIcon}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
