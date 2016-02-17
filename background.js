// GLOBALS

var localStore = chrome.storage.local;
var threads = [];

localStore.set({sub: "overwatch", activeSubs: []})


function initThreads(data) {
    data.forEach(function (thread) {
        threads.push(thread.data.id);
    });
}


function getData() {
    
    // Load options from local storage
    localStore.get(function (options) {
        
        // Get data from reddit
        $.ajax({
            url: 'http://reddit.com/r/'+options.sub+'/new/.json',
            success: function(response) {
                console.log(response);
                if (threads.length > 0) {
                    detectNewThreads(response.data.children);
                } else {
                    initThreads(response.data.children);
                }
            }
        });
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
    
    var myNotification = new Notify('New Reddit Post [r/'+thread.data.subreddit+'] ', {
        body: thread.data.title,
        tag: thread.data.id,
        notifyClick: function () {
           chrome.tabs.create({ url: 'http://reddit.com' + thread.data.permalink });
        },
        icon: thumb,
        timeout: 10,
        
    });
    
    myNotification.show();
}


function resetSub(newsub) {
    threads = [];
    localStore.set({sub: newsub});
}


getData();

chrome.alarms.create('name', {periodInMinutes: .1});

chrome.alarms.onAlarm.addListener(function () {
   getData(); 
});





