let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);

  const contextMenuItem = {
    "id": "sampleContextMenu",
    "title": "Sample Context Menu",
    "contexts": ["editable"],
  };
  
  chrome.contextMenus.create(contextMenuItem);
});


chrome.contextMenus.onClicked.addListener(async function(info, tab){
  console.log({info, tab});

  const elementClicked = (await new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: "getClickedEl" }, {frameId: info.frameId}, data => {
      resolve(data)
    });
  }));
  
  console.log('Element that was conteted menued', {elementClicked});

  const fancyActionResult = (await new Promise((resolve) => setTimeout(() => {
    resolve("some fancy result");
  }, 10_000)));

  await new Promise((resolve) => {
    chrome.tabs.sendMessage(tab.id, { action: "appendValue", element: elementClicked, newValue: fancyActionResult}, {frameId: info.frameId}, data => {
      resolve();
    });
  });

  console.log('completed.');
});