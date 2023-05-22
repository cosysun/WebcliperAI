const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log(`[Coloring] default background color is set to: ${color}`);
});

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg, sender)
  if (msg.action == "content_click") {
  chrome.tabs.sendMessage(msg.data, {action: 'get_content'}, (response) => {
    // chrome.storage.local.set({pageContent: response.content});
    chrome.runtime.sendMessage({content: response.content, action: "set_content"})
  });
  }
});