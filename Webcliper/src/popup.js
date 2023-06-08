// 通过ID找到按钮
const button = document.getElementById("changeColor");
const myText = document.getElementById("contextText");
const summaryBtn = document.getElementById("summary");

window.onload = function () {
  chrome.runtime.sendMessage({ action: "popup" })
}

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg, sender)
  myText.value = msg.content
  // if (msg.action == "set_content") {
  //   // 调用Chrome接口取出当前标签页
  //   const httpC = new XMLHttpRequest();
  //   const baseUrl = "http://127.0.0.1:8080/openai/summary";

  //   httpC.open("POST", baseUrl, true);
  //   httpC.setRequestHeader("Content-type", "application/json");

  //   const req = { content: msg.content }

  //   httpC.onload = function () {
  //     if (httpC.status != 200) { // HTTP error?
  //       // 处理 error
  //       alert('Error: ' + httpC.status);
  //       return;
  //     }

  //     // 获取来自 xhr.response 的响应
  //     console.log(httpC.response)
  //     const obj = JSON.parse(httpC.response)
  //     myText.value = httpC.response
  //   };
  //   httpC.send(JSON.stringify(req));
  // }
});
