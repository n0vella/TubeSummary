<h1 align="center">TubeSummary</h1>
<p align="center">
    <a href="https://github.com/n0vella/TubeSummary">
        <img src="https://raw.githubusercontent.com/n0vella/TubeSummary/master/icon.png" alt="logo" width="256" height="256" />
    </a>
</p>

Browser extension to boost YouTube with AI-Powered summaries.

# How it works?

Check out the new brain button at the end of your toolbar, this will trigger summarization.

- ![1](assets/readme/1.png)

Below the video, summary will be generated, you can even ask the AI about the video.

- ![2](assets/readme/2.png)

Clicking on the extension icon or middle-clikcing on the summarize button will open settings page in a new tab.
Here you can customize the prompt and introduce your API provider credentials.

- ![3](assets/readme/3.png)

# API providers

To archieve this is mandatory to setup a OpenAI compatible API provider, you can use a paid one if you are subscribed or you can check this [list of free LLM resources](https://github.com/cheahjs/free-llm-api-resources)

## Tested services

This is a list of providers that have been tested with this extension, all of them have a free tier.

### Openrouter

- Endpoint url: `https://openrouter.ai/api/v1/`
- Docs: `https://openrouter.ai/docs/api-reference/overview`

### Cerebras

- Endpoint url: `https://api.cerebras.ai/v1/`
- Docs: `https://inference-docs.cerebras.ai/introduction`

### Groq

- Endpoint url: `https://api.groq.com/openai/v1`
- Docs: `https://console.groq.com/docs/api-reference`

### Together AI

- Endpoint url: `https://api.together.xyz/v1/`
- Docs: `https://api.together.ai/models`

### Github

- Endpoint url: `https://models.github.ai/inference`
- Docs: `https://github.com/marketplace/models`

### Gemini (Doesn't work yet!)

Looks like google openai implementation is still on beta and it didn't work yet

- Endpoint url: `https://generativelanguage.googleapis.com/v1beta/openai/`
- Docs: `https://ai.google.dev/gemini-api/docs/openai`

# How to Install extension

## Firefox

Just install it from firefox addons page

<a href="https://addons.mozilla.org/en-US/firefox/addon/tubesummary/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get TubeSummary for Firefox"></a>

## Chrome

1. Go to [latest release](https://github.com/n0vella/TubeSummary/releases/latest)
2. Download zip and unpack it
3. Go to [chrome://extensions](chrome://extensions/)
4. Turn developer mode on
5. Install unpacked extension, just select the unpacked folder

# Contributing

## Donations

If you like this extension you can contribute buying me a cofee or whatever you want, that would be really great :)

<div style="display: inline-flex; gap: 10px; align-items: center">
    <a href="https://www.buymeacoffee.com/n0vella" target="_blank" rel="noopener">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;"
        >
    </a>
    <a href="https://www.paypal.com/paypalme/n0velladev" target="_blank" rel="noopener">
        <img src="https://www.paypalobjects.com/webstatic/icon/pp196.png" alt="Paypal" width="60" height="60" style="border-radius: 10px" />
    </a>
</div>

## PR

Of course PRs are welcome, this extension uses a basic typescript + vite + preact + tailwind stack. Ask me if you have any questions.
