(function(request){

    "use strict";

    var defaultLocale = localStorage.defaultLocale ? JSON.parse(localStorage.defaultLocale) : null;

    function init() {
        chrome.browserAction.setBadgeText({ text : Object.keys(defaultLocale)[0].split('-')[0] });
    }

    function getLocale(details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'Accept-Language') {
                defaultLocale = acceptLanguageToJson(details.requestHeaders[i].value);
                localStorage.defaultLocale = JSON.stringify(defaultLocale);
                request.onBeforeSendHeaders.removeListener(getLocale);
                init();
                break;
            }
        }
    }

    function acceptLanguageToJson (locale) {
        var json = {};
        locale.split(',').forEach(function(elem){
            json[elem.split(';')[0]] = elem.split(';')[1] || 1;
        });
        return json;
    }

    if(!defaultLocale) {
        request.onBeforeSendHeaders.addListener( getLocale,
            { urls: ["<all_urls>"], types : ["main_frame","xmlhttprequest"] },
            ["blocking", "requestHeaders"]);
    } else {
        init();
    }


    function prepareResponse(request, sender, sendResponse) {
        if (sender.id !== chrome.runtime.id ) { return; }
        if(request.getLocale) {
            sendResponse(defaultLocale);
        }
    }

    chrome.extension.onMessage.addListener( prepareResponse);


})(chrome.webRequest);


