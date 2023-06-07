const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log(`[Coloring] default background color is set to: ${color}`);
});

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.action == "content_click" || msg.action == "popup") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'get_content' }, (response) => {
      // chrome.storage.local.set({pageContent: response.content});
      chrome.runtime.sendMessage({ content: response.content, lang: response.lang, action: "set_content" })
    });
  }
});