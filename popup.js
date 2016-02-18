document.getElementById('mainform').addEventListener('submit', mainFormSubmit);

var localStore = chrome.storage.local;
var subList = [];


localStore.get(function (options) {
    if (options.subList) {
        subList = options.subList;
        initialize(subList);
    }
});


function initialize(subList) {
    subList.forEach(function (sub) {
        addSub(sub);
    })
}

function mainFormSubmit() {
    event.preventDefault();
    var sub = $("#sub-input").val()
    subList.push(sub);
    addSub(sub);
    $("#sub-input").val("");

}


function addSub(sub) { 
    $('#sublist').append(sublistTemplate(sub));
    localStore.set({subList: subList, initialize: true});
}


function sublistTemplate(sub) {
    var template = '<div class="sublist-item" id="'+sub+'-div"><span class="glyphicon glyphicon-remove-circle"></span><a target="_blank" href="http://reddit.com/r/'+sub+'">r/'+sub+'</a></div></div>';
    return template;
}


function disable() {
    localStore.set({state: 'off'});
    $("#on-button").html('disabled'); 
    $("#on-button").attr('class', 'btn btn-danger'); 
}


function enable() {
    localStore.set({state: 'on'});
    $("#on-button").html('enabled'); 
    $("#on-button").attr('class', 'btn btn-success'); 
}


$("#on-button").on('click', function () {
    $(this).html() == 'enabled' ? disable() : enable();
});


function run() {
    localStore.get(function (options) {
        if (options.state === 'on') {
            enable();
        } else {
            disable();
        }
    });
}

run();






