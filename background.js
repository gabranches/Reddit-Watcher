// GLOBALS
var threads = [];
var sub = 'overwatch';


function initThreads(data) {
    data.forEach(function (thread) {
        threads.push(thread.data.id);
    });
}


function getData() {
    $.ajax({
        url: 'http://reddit.com/r/'+sub+'/new/.json',
        success: function(response) {
            if (threads.length > 0) {
                detectNewThreads(response.data.children);
            } else {
                initThreads(response.data.children);
            }
        }
    });
}


function detectNewThreads(data) {
    console.log('checking for new threads...');
    data.forEach(function (thread) {
        if (threads.indexOf(thread.data.id) == -1) {
            console.log(thread);
            createNotification(thread);
            threads.push(thread.data.id);
        }
    });
}


function createNotification(thread) {
    
    // Check if thumbnail exists for icon
    if (thread.data.hasOwnProperty("preview")) {
        var thumb = thread.data.thumbnail;
    } else {
        var thumb = null;
    }
    
    console.log(thumb);
    
    var myNotification = new Notify('New Reddit Post [r/'+thread.data.subreddit+'] ', {
        body: thread.data.title,
        tag: thread.data.id,
        notifyClick: function () {
           chrome.tabs.create({ url: 'http://reddit.com' + thread.data.permalink });
        },
        icon: thumb
    });
    
    myNotification.show();
}


function resetSub(newsub) {
    threads = [];
    sub = newsub
}


getData();

chrome.alarms.create('name', {periodInMinutes: .1});

chrome.alarms.onAlarm.addListener(function () {
   getData(); 
});



