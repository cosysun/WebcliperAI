chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'get_content') {
    var documentClone = document.cloneNode(true);
    const article = new Readability(documentClone).parse();
    sendResponse({ content: article.textContent, lang: article.lang });
  }
});