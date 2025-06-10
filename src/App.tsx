import { useState } from 'preact/hooks'

export default function App() {
  return (
    <button title="Generate summary" className="ml-3 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full !bg-[#f2f2f2] p-1.5 hover:!bg-[#e5e5e5]">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="icon-tabler">
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
      </svg>
    </button>
  )
}
