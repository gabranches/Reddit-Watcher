// GLOBALS
var localStore = chrome.storage.sync;
var threads = [];
var initialize = true;
var lastQueryTime = Date.now();

// Initialize 
localStore.set({debug: false, lastQueryTime: Date.now()/1000});
// Check every minute for changes
chrome.alarms.create('checkForChanges', {periodInMinutes: 1});


// Fetch data on interval if extension state is set to "on"
chrome.alarms.onAlarm.addListener(function () {
    localStore.get(function (options) {
        if (options.state === 'on') {
            validateRequest(); 
        }
    });
});


// Run watch for localStore changes
chrome.storage.onChanged.addListener(function (changes) {
    
    // Run request on sublist and section update
    if (changes.hasOwnProperty('subList') || changes.hasOwnProperty('section')) {
        debug('Detected change in settings.');
        validateRequest();
    }
    
    // Test notification
    if (changes.hasOwnProperty('testNotification')) {
        debug('Testing notification.');
        if (changes.testNotification.newValue.data.type === "test") {
            createNotification(changes.testNotification.newValue);
        }
    }
    
    // Update initialize on change
    if (changes.hasOwnProperty('initialize')) {
        initialize = changes.initialize.newValue;
    }
    
    
});

// Initializes a new threads array
function initThreads(data) {
    threads = [];
    data.forEach(function (thread) {
        threads.push(thread.data.id);
    });
    initialize = false;
}


// Set request options and check if we should pull data 
function validateRequest() {
   
    // Check time difference
    if ((Date.now()/1000 - lastQueryTime) > 90) {
        initialize = true;
    }
    
    lastQueryTime = Date.now()/1000;

    localStore.get(function (options) {
        // Get new data if there is a subList
        if (options.subList) {
            if (options.subList.length > 0) {
                getRedditData(options);
            } 
        } else {
            localStore.set({subList: []});
        }
    });

}

// Pull data from reddit using the API
function getRedditData(options) {
    var section = options.section || 'new';
    var url = 'http://reddit.com/r/'+options.subList.join('+')+'/'+section+'/.json';
    debug('Getting subs: ' + options.subList.join(','));
    debug('Query url: ' + url);
    
    // Get data from reddit
    $.ajax({
        url: url,
        success: function(response) {

            debug('Found ' + response.data.children.length + ' threads.');
            
            if (initialize === true) {
                // Run this on to populate threads array
                debug('Initializing new thread list.');
                initThreads(response.data.children);
                localStore.set({initialize: false});
                initialize = false;
            } else {
                debug('Detecting new threads.');
                detectNewThreads(response.data.children);
            }
        }
    });
}

// See if there are new threads and create a notification for those
function detectNewThreads(data) {
    data.forEach(function (thread) {
        if (threads.indexOf(thread.data.id) == -1) {
            debug('Creating notification for thread "' + thread.data.title + '"');
            createNotification(thread);
            threads.push(thread.data.id);
        }
    });
}


// Generate notifications
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


// Console log when debug is on
function debug(msg) {
    localStore.get(function (options) {
       if (options.debug === true) {
           console.log(msg);
       } 
    });
}

