document.getElementById('mainform').addEventListener('submit', mainFormSubmit);

var localStore = chrome.storage.sync;
var subList = [];

console.log('Ran popup.js');

// Load settings
localStore.get(function (options) {
    if (options.subList) {
        subList = options.subList;
        initialize(subList);
    }
});

// Add subs to empty subList
function initialize(subList) {
    subList.forEach(function (sub) {
        addSub(sub);
    })
}

// Main submit
function mainFormSubmit() {
    event.preventDefault();
    var sub = $("#sub-input").val()
    subList.push(sub);
    addSub(sub);
    $("#sub-input").val("");
}

// Add sub to sublist
function addSub(sub) { 
    $('#now-watching').show();
    $('#sublist').append(sublistTemplate(sub));
    localStore.set({subList: subList, initialize: true});
}

// Template for sublist
function sublistTemplate(sub) {
    var template = '<div data-sub="'+sub+'" class="sublist-item" id="'+sub+'-div"><span class="glyphicon glyphicon-remove"></span><a target="_blank" href="http://reddit.com/r/'+sub+'">'+sub+'</a></div></div>';
    return template;
}

// Disable querying the API
function disable() {
    localStore.set({state: 'off'});
    $("#on-button").html('disabled'); 
    $("#on-button").attr('class', 'btn btn-danger');
}

// Enable querying the API
function enable() {
    localStore.set({state: 'on'});
    $("#on-button").html('enabled'); 
    $("#on-button").attr('class', 'btn btn-success'); 
}

// Enable/Disable toggle
$("#on-button").on('click', function () {
    $(this).html() == 'enabled' ? disable() : enable();
});


// Remove sub
$(document).on('click', '.glyphicon-remove', function () {
    
    var index = subList.indexOf($(this).parent().attr('data-sub'));
    
    if (index > -1) { 
        subList.splice(index, 1); 
        localStore.set({subList: subList, initialize: true});
    }
    $(this).parent().remove();
    
    if (subList.length === 0) {
        $("#now-watching").hide();
    }
});

// Section select event listener
$('#section-select').on('change', function () {
   localStore.set({section: $(this).val(), initialize: true});
   $(this).val() === "hot" ? $("#warn").show() : $("#warn").hide();
});

// Test notification event listener
$('#test').on('click', function () {
    console.log('click');
    localStore.set({
        testNotification: {
            data: {
                title: "Test notification!",
                thumbnail: "self",
                time: Date.now(),
                subreddit: "test",
                type: "test"
            }
        }
    }); 
});

// Interval select event listener
$('#interval-select').on('change', function () {
   localStore.set({interval: $(this).val()}); 
});


// Runs when extension button is clicked
function run() {
    localStore.get(function (options) {
        
        options.state === 'off' ? disable() : enable();
        
        if (options.section) {
            $('#section-select option[value="'+options.section+'"]').prop('selected', true);
        }
        
        if (options.interval) {
            $('#interval-select option[value="'+options.interval+'"]').prop('selected', true);
        }

    });
}

run();






