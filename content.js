chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
        $(document).ready(function() {
            let dictionary = $('.dictionary').clone();
            let commonJS = $('script[src="https://d27ucmmhxk51xv.cloudfront.net/common.js?version=1.2.4"]').clone();
            let fontAwesomeLink = $('link[href="https://d27ucmmhxk51xv.cloudfront.net/external/fonts/font-awesome/5.12.0/css/font-awesome.min.css?version=1.2.4"]').clone();
            let head = $('head').clone();
            let body = $('body').clone();

            head.empty().append(fontAwesomeLink);
            body.empty().append(dictionary);
            body.find('script').remove();
            body.find('iframe').remove();
            body.append(commonJS);
            let speakers = body.find('.speaker').map((i, s) => {
                const url = s.getAttribute('data-src-mp3');
                let arr = url.split('/');
                let filename = arr[arr.length - 1];
                filename = filename.split('?')[0];
                return {
                    url,
                    filename,
                    "skipHash": "7e2c2f954ef6051373ba916f000168dc",
                    "fields": [
                        "Back"
                    ]
                };
            });
            speakers.each((i, s) => {
                body.find(`span[data-src-mp3="${s.url}"]`).replaceWith(`[sound:${s.filename}]`);
            });


            let front = $('.pagetitle').html();
            let back = head.html() + body.html();

            const data = {
                action: 'addNote',
                version: 6,
                params: {
                    "note": {
                        "deckName": "Default",
                        "modelName": "9h",
                        "fields": {
                            "Front": `<h3 class="front" style=\"color: #03A9F4;\">${front}</h3>`,
                            "Back": back,
                        },
                        "options": {
                            "allowDuplicate": false,
                            "duplicateScope": "deck"
                        },
                        "tags": [
                            "longman"
                        ],
                        "audio": speakers.toArray()
                    }
                }
            };
            // This line is new!
            chrome.runtime.sendMessage({"message": "add_to_anki", data});
        });
      }
    }
);
