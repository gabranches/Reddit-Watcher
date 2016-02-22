// GLOBALS
var localStore = chrome.storage.local;
var threads = [];

localStore.set({debug: true});

chrome.alarms.create('name', {periodInMinutes: 1});

// Fetch data on interval if extension state is set to "on"
chrome.alarms.onAlarm.addListener(function () {
    localStore.get(function (options) {
        if (options.state === 'on') {
            getData(); 
        }
    });
});


// Run getData when a variable is changed to reset the threads array
chrome.storage.onChanged.addListener(function (changes) {
    getData();
});


function initThreads(data) {
    threads = [];
    data.forEach(function (thread) {
        threads.push(thread.data.id);
    });
    localStore.set({initialize: false});
}


function getData() {
    
    // Load options from local storage
    localStore.get(function (options) {
        
        if (options.subList.length > 0) {
            
            var section = options.section || 'new';
            var url = 'http://reddit.com/r/'+options.subList.join('+')+'/'+section+'/.json';
            debug(options.subList);
            debug(url);
            
            // Get data from reddit
            $.ajax({
                url: url,
                success: function(response) {
                    debug(response);
                    debug(options.initialize);
                    if (options.initialize == true) {
                        // Run this on to populate threads array
                        initThreads(response.data.children);
                    } else {
                        detectNewThreads(response.data.children);
                    }
                }
            });
        }
    });
}


function detectNewThreads(data) {
    data.forEach(function (thread) {
        if (threads.indexOf(thread.data.id) == -1) {
            createNotification(thread);
            threads.push(thread.data.id);
            debug(thread.data.id);
        }
    });
}


function createNotification(thread) {
    
    // Check if thumbnail exists for icon
    if (thread.data.thumbnail === 'self' || thread.data.thumbnail === 'default' || thread.data.thumbnail === '') {
        var thumb = 'images/icon80.png';
    } else {
        var thumb = thread.data.thumbnail;
    }
    
    localStore.get(function (options) {
    
        var myNotification = new Notify('New Reddit Post [r/'+thread.data.subreddit+'] ', {
            body: thread.data.title,
            tag: thread.data.id,
            notifyClick: function () {
               chrome.tabs.create({ url: 'http://reddit.com' + thread.data.permalink });
            },
            icon: thumb,
            timeout: options.interval = options.interval || 20
        });
        
        myNotification.show();
    });
    
}

function debug(msg) {
    localStore.get(function (options) {
       if (options.debug === true) {
           console.log(msg);
       } 
    });
}

