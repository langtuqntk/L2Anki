chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'https://www.ldoceonline.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
});

// This block is new!
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "add_to_anki" ) {
        const { data } = request;
        $.ajax({
            url: "http://127.0.0.1:8765",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
        }).done(function( res ) {
            const { error } = res;
            if(!error) {
                alert( "Saved" );
            } else {
                alert(error);
            }
        }).fail(function( jqXHR, textStatus, err ) {
            console.log( "Request failed: " + err );
        });;
      }
    }
);