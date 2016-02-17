document.getElementById('mainform').addEventListener('submit', mainFormSubmit);


function mainFormSubmit() {
    event.preventDefault();
    console.log($("#sub-input").val());
//    addSub($("#sub-input").val())
}



function addSub(sub) {
    activeSubs.push(sub);
    $('#sublist').append(sublistTemplate(sub));
}

function sublistTemplate(sub) {
    var template = '<div class="sublist-item" id="'+sub+'-div">r/'+sub+'</div>';
    return template;
}
