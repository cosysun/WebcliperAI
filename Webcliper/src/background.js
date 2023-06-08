const color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log(`[Coloring] default background color is set to: ${color}`);
});
// get the current time for context in the system message
let time = new Date();

// create a system message
const systemMessage = "You are a helpful chat bot. Your answer should not be too long. current time: " + time;

// initialize the message array with a system message
let messageArray = [
  { role: "system", content: systemMessage }
];

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.action == "content_click" || msg.action == "popup") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'get_content' }, async (resp) => {
      console.log(resp)
      // chrome.storage.local.set({pageContent: response.content});
      // get the API key from local storage
      let apiKey = await new Promise(resolve => chrome.storage.local.get(['apiKey'], result => resolve(result.apiKey)));

      // get the API model from local storage
      let apiModel = await new Promise(resolve => chrome.storage.local.get(['apiModel'], result => resolve(result.apiModel)));

      // Add the user's message to the message array
      messageArray.push({ role: "user", content: "hello" });

      if (apiKey != "") {
        try {
          // send the request containing the messages to the OpenAI API
          let response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              "model": apiModel,
              "messages": messageArray
            })
          });

          // check if the API response is ok Else throw an error
          if (!response.ok) {
            throw new Error(`Failed to fetch. Status code: ${response.status}`);
          }

          // get the data from the API response as json
          let data = await response.json();

          // check if the API response contains an answer
          if (data && data.choices && data.choices.length > 0) {
            // get the answer from the API response
            let response = data.choices[0].message.content;

            // send the answer back to the content script
            chrome.runtime.sendMessage({ content: response, action: "set_content" });

            // Add the response from the assistant to the message array
            messageArray.push({ role: "assistant", "content": response });
          }
        } catch (error) {
          // send error message back to the content script
          chrome.runtime.sendMessage({ content: "No answer Received: Make sure the entered API-Key is correct" + apiKey, action: "set_content" });
        }
      } else {
        try {
          let response = await fetch('http://127.0.0.1:8000/ai/ask', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "content": resp.content,
              "lang": resp.lang
            })
          });
          // check if the API response is ok Else throw an error
          if (!response.ok) {
            throw new Error(`Failed to fetch. Status code: ${response.status}`);
          }
          console.log(response)
          let data = await response.json();
          chrome.runtime.sendMessage({ content: data.answer, action: "set_content" });
        } catch (error) {
          chrome.runtime.sendMessage({ content: "No answer Received: Make sure the entered API-Key is correct" + apiKey, action: "set_content" });
        }

      }

    });
  }
});