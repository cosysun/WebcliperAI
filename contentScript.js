chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'get_content') {
        const pageContent = document.body.innerText;
        sendResponse({content: pageContent});
    }
});