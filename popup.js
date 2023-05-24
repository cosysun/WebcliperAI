// 通过ID找到按钮
const button = document.getElementById("changeColor");
const myText = document.getElementById("contextText");
const summaryBtn = document.getElementById("summary");

// 从storage取背景色并设到按钮上
chrome.storage.sync.get("color", ({ color }) => {
  button.style.backgroundColor = color;
});

// 注册按钮点击回调函数
button.addEventListener("click", async () => {
  console.log("click")
    // 调用Chrome接口取出当前标签页
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    // 以当前标签页为上下文，执行setPageBackgroundColor函数
    // chrome.scripting.executeScript({
    //   target: {tabId: tab.id},
    //   function: setPageBackgroundColor,
    // });
    chrome.runtime.sendMessage({data: tab.id, action: "content_click"})
});

  
  // 函数将在指定标签页内执行，因此可以取得当前网页document
function setPageBackgroundColor() {
    // 从storage取出背景色，并设到当前网页上
    chrome.storage.sync.get("color", ({ color }) => {
      document.body.style.backgroundColor = color;
    });
  }

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg, sender)
  if (msg.action == "set_content") {
    myText.value = msg.content
  }
});

summaryBtn.addEventListener("click", async () => {
  console.log("summary click")
     // 调用Chrome接口取出当前标签页
     const httpC = new XMLHttpRequest();
     const baseUrl = "http://127.0.0.1:8080/openai/summary";
   
     httpC.open("POST", baseUrl, true);
     httpC.setRequestHeader("Content-type", "application/json");
   
     const req = {content: myText.value}
   
     httpC.onload = function() {
      if (httpC.status != 200) { // HTTP error?
        // 处理 error
        alert( 'Error: ' + xhr.status);
        return;
      }
    
      // 获取来自 xhr.response 的响应
      console.log(httpC.response)
      myText.value = httpC.response
    };
     httpC.send(JSON.stringify(req));
});