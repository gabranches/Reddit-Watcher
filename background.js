// GLOBALS

var localStore = chrome.storage.local;
var threads = [];


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
        
        if (options.subList && options.state === 'on') {
            
            var section = options.section || 'new';
            console.log(options.subList);
            
            // Get data from reddit
            $.ajax({
                url: 'http://reddit.com/r/'+options.subList.join('+')+'/'+section+'/.json',
                success: function(response) {
                    console.log(response);
                    console.log(options.initialize);
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
        }
    });
}


function createNotification(thread) {
    
    // Check if thumbnail exists for icon
    if (thread.data.thumbnail == 'self' || thread.data.thumbnail == 'default') {
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
            timeout: options.interval = options.interval || 10
        });
        
        myNotification.show();
    });
    
}

// Perform initial data pull
localStore.set({intialize: true});
getData();

chrome.alarms.create('name', {periodInMinutes: .25});

// Fetch data on interval if extension is set to "on"
chrome.alarms.onAlarm.addListener(function () {
   getData(); 
});





