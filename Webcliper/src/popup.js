// 通过ID找到按钮
const myText = document.getElementById("contextText");
const summaryBtn = document.getElementById("summary");

window.onload = function () {
  document.querySelector('.spinner-border').style.display = 'none';
}

summaryBtn.addEventListener("click", (e) => {
  chrome.runtime.sendMessage({ action: "popup" })
  document.querySelector('.spinner-border').style.display = 'inline-block';
  summaryBtn.disabled = true;
})

chrome.runtime.onMessage.addListener(async (msg, sender) => {
  console.log(msg, sender)
  // 请求完成后移除菊花加载动画实例
  document.querySelector('.spinner-border').style.display = 'none';
  summaryBtn.disabled = false;
  myText.value = msg.content
});