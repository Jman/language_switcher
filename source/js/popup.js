(function(){

    "use strict";

    var popup = document.getElementById('popup');
    var test = function(data){ popup.innerHTML = '<pre>' + JSON.stringify(data, null, " ") + '</pre>'; };
    chrome.extension.sendMessage({ getLocale: true }, test);

})();

