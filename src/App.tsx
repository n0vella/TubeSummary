import { render } from 'preact'
import { useState } from 'preact/hooks'
import { ask } from './modules/chat'

function SummaryPanel() {
  const [summary, setSummary] = useState('Loading summary')

  setSummary(
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut optio in nobis repellat recusandae totam sint eveniet qui a. Culpa, quos modi commodi provident sed ipsum, asperiores magnam odit minus maxime libero, soluta explicabo odio harum temporibus nihil. Magnam voluptas, harum quas dolores sint hic minima. Iure, iste aut itaque quos deserunt rem totam? Quos beatae repellat necessitatibus exercitationem id, amet, laboriosam perspiciatis, perferendis suscipit officiis incidunt ea dolorum! Recusandae repellendus harum dolor blanditiis tenetur, error numquam laudantium quisquam quam deserunt quibusdam aperiam corrupti dolore porro sit perspiciatis consequuntur aliquam praesentium fugit molestiae earum, suscipit asperiores pariatur consequatur. Numquam sed doloribus repellendus cumque reiciendis vitae sint. Assumenda, vero commodi ullam rem porro corrupti ipsam, qui error tempore eos ut. Veniam provident, sapiente sequi nam quia maxime a nemo quis amet similique tempore vero, laboriosam deserunt, sunt temporibus. Similique doloremque delectus id repellat animi, aliquam nam distinctio autem impedit velit eum cumque omnis voluptas fugit neque eius earum explicabo at nesciunt! Maxime officia accusantium repudiandae atque quia consequatur ea quam dolorum quas cupiditate quo explicabo nulla culpa laudantium quasi, doloribus odit neque amet, blanditiis rerum. Cum voluptatum fuga sequi, perspiciatis ratione earum. Laboriosam iste obcaecati ea iure voluptatem velit, vitae dolorem?',
  )

  // ask().then((response) => setSummary(response))

  return (
    <div id="yt-summary-panel" className="description-like !mt-8 flex w-full flex-col gap-5">
      <div>{summary}</div>

      <div id="chat-box" className="flex h-12 w-full">
        <input className="!mx-2 w-full !px-1 !py-0.5" placeholder="Ask about the video"></input>
        <button className="w-10 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="icon-tabler">
            <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
            <path d="M6.5 12h14.5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function loadDialog() {
  const bottomRow = document.querySelector<HTMLDivElement>('#bottom-row')!

  const panel = bottomRow.querySelector<HTMLDivElement>('#yt-summary-panel')

  if (!panel) {
    const container = document.createElement('div')
    bottomRow.insertBefore(container, bottomRow.firstChild)
    render(<SummaryPanel />, container)
  }
}

export default function App() {
  return (
    <button title="Generate summary" className="yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono ml-3 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full p-2" onClick={loadDialog}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="icon-tabler">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      </svg>
    </button>
  )
}

// yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment
