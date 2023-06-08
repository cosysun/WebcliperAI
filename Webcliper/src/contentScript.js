chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'get_content') {
    var documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    let newStr = article.textContent.replace(/\s+/g, "");
    sendResponse({ content: newStr, lang: article.lang });
  }
});