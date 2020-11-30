/**
 * Created by Oleg on 14.02.2017.
 */

//https://github.com/balvin-perrie/Access-Control-Allow-Origin---Unblock/blob/master/background.js
let preferences = {
    logs: false,
    cadastralHidden: false,
};

const cors = {};
cors.onHeadersReceived = ({responseHeaders}) => {
    if (
        responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-origin') === undefined
    ) {
        responseHeaders.push({
            'name': 'Access-Control-Allow-Origin',
            'value': '*'
        });
    }
    if (
        responseHeaders.find(({name}) => name.toLowerCase() === 'access-control-allow-methods') === undefined
    ) {
        responseHeaders.push({
            'name': 'Access-Control-Allow-Origin',
            'value': '*'
        });
        responseHeaders.push({
            'name': 'Access-Control-Allow-Methods',
            'value': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'].join(', ')
        });
    }

    return {responseHeaders};
};

chrome.webRequest.onHeadersReceived.addListener(cors.onHeadersReceived, {
    urls: ['https://map.land.gov.ua/*']
}, ['blocking', 'responseHeaders', 'extraHeaders']);

//Context

function insertOptions () {
    chrome.storage.sync.get('logs', (result) => {
        if (result.hasOwnProperty('logs')) {
            preferences.logs = result.logs;
        }
        chrome.contextMenus.create({
            title: 'Enable logs in console',
            type: 'checkbox',
            id: 'logs',
            contexts: ['page_action'],
            checked: preferences.logs
        });
    });
    chrome.storage.sync.get('cadastralHidden', (result) => {
        if (result.hasOwnProperty('cadastralHidden')) {
            preferences.cadastralHidden = result.cadastralHidden;
        }
        chrome.contextMenus.create({
            title: 'Hide lands without cadastral',
            type: 'checkbox',
            id: 'cadastralHidden',
            contexts: ['page_action'],
            checked: preferences.cadastralHidden
        });
    });
}

chrome.runtime.onInstalled.addListener(insertOptions);
chrome.runtime.onStartup.addListener(insertOptions);

chrome.contextMenus.onClicked.addListener((menuItem, tab) => {
    preferences[menuItem.menuItemId] = menuItem.checked;
    chrome.storage.sync.set(preferences);
    chrome.tabs.sendMessage(tab.id, preferences);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo && changeInfo.url) {
        chrome.tabs.sendMessage(tabId, {url: changeInfo.url, ...preferences});
    }
    if (changeInfo && changeInfo.status === 'complete') {
        chrome.tabs.get(tabId, (result) =>
            chrome.tabs.sendMessage(tabId, {url: result.url, ...preferences})
        );
    }
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    $.get("https://www.google.com/recaptcha/api.js?render=6LcAmtkUAAAAAJUwNLMCZACeXK1gEZCQj4cXvSZv", function(result) {
        chrome.tabs.executeScript(tabs[0].id, {code: result});
    }, "text");
});