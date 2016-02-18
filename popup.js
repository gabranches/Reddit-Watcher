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
    var template = '<div data-sub="'+sub+'" class="sublist-item" id="'+sub+'-div"><span class="glyphicon glyphicon-remove-circle"></span><a target="_blank" href="http://reddit.com/r/'+sub+'">r/'+sub+'</a></div></div>';
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


// Remove sub
$(document).on('click', '.glyphicon-remove-circle', function () {
    
    var index = subList.indexOf($(this).parent().attr('data-sub'));
    
    if (index > -1) { 
        subList.splice(index, 1); 
        localStore.set({subList: subList, initialize: true});
    }
    $(this).parent().remove();
    
});


$('#section-select').on('change', function () {
   localStore.set({section: $(this).val(), initialize: true}); 
});

$('#interval-select').on('change', function () {
   localStore.set({interval: $(this).val(), initialize: true}); 
});


function run() {
    localStore.get(function (options) {
        if (options.state === 'off') {
            disable();
        } else {
            enable();
        }
        
        if (options.section) {
            $('#section-select option[value="'+options.section+'"]').prop('selected', true);
        }
        
         if (options.interval) {
            $('#interval-select option[value="'+options.interval+'"]').prop('selected', true);
        }

    });
}

run();






