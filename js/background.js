/**
 * Created by Oleg on 14.02.2017.
 */

let preferences = {
  logs: false,
  cadastralHidden: false,
};

//Context

chrome.storage.sync.get("logs", (result) => {
  if (result.hasOwnProperty("logs")) {
    preferences.logs = result.logs;
  }
  chrome.contextMenus.create({
    title: "Enable logs in console",
    type: "checkbox",
    id: "logs",
    contexts: ["page_action"],
    checked: preferences.logs,
  });
});
chrome.storage.sync.get("cadastralHidden", (result) => {
  if (result.hasOwnProperty("cadastralHidden")) {
    preferences.cadastralHidden = result.cadastralHidden;
  }
  chrome.contextMenus.create({
    title: "Hide lands without cadastral",
    type: "checkbox",
    id: "cadastralHidden",
    contexts: ["page_action"],
    checked: preferences.cadastralHidden,
  });
});

chrome.contextMenus.onClicked.addListener((menuItem, tab) => {
  preferences[menuItem.menuItemId] = menuItem.checked;
  chrome.storage.sync.set(preferences);
  chrome.tabs.sendMessage(tab.id, preferences);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { url: changeInfo.url, ...preferences });
  }
  if (changeInfo.status === "complete") {
    chrome.tabs.get(tabId, (result) =>
      chrome.tabs.sendMessage(tabId, { url: result.url, ...preferences })
    );
  }
});
