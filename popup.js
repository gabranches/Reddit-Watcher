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
    var template = '<div class="sublist-item" id="'+sub+'-div">r/'+sub+'</div>';
    return template;
}



