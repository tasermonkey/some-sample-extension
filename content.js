var port = chrome.runtime.connect();

window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);

var clickedEl = null;

document.addEventListener("contextmenu", function(event){
    const target = event.target;
    console.log('ctx menu!', {target});
    clickedEl = event.target;
    
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request || !request.action) {
        return;
    }

    if(request.action === "getClickedEl") {
        const target = clickedEl;
        if (!target.dataset.jamesextId) {
            target.dataset.jamesextid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
        }    
        const result = {value: target.value,  jamesextId: target.dataset.jamesextid};
        console.log('requesting ctx target', {result});
        sendResponse(result);
    } else if (request.action === "appendValue") {
        const requestElement = request.element;
        const target = document.querySelector(`[data-jamesextid="${requestElement.jamesextId}"]`);
        if (!target) {
            console.error(`Unable to find original element of context menu with id ${requestElement.jamesextId}`);
            return;
        }

        target.value = request.newValue;
    }
});