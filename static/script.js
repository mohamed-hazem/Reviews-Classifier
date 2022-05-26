document.querySelector("#review_text").focus()

// type length
function get_length(textarea) {
    let values = textarea.value.split(" ")
    values = values.filter(function(value) {
        return value !== '';
    });
    return values.length
}

document.querySelector("#review_text").oninput = function() {
    len = get_length(this)

    length_span = document.querySelector("#length")
    length_span.innerText = len + "/250"

    if (len > 250) {
        length_span.style.color = "#dc3545"
    }
    else {
        length_span.style.color = "#7a7979"
    }

    if (len == 0) {
        document.querySelector("#result").style.display = "none";
    }
}

// ============================================================================ 

function show_result(result) {
    let result_div = document.querySelector("#result");
    
    result_div.style.display = "block";

    result = parseFloat(result)
    console.log(result)

    if (result > 0.6) {
        result_div.style.backgroundColor = "#28a745";
        result_div.innerText = "positive"
    }
    else {
        result_div.style.backgroundColor = "#dc3545";
        result_div.innerText = "negative"
    }
}

// AJAX
function process_review(review) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.status === 200 && this.readyState === 4) {
            let result = this.responseText;
            show_result(result);
        }
    }
    let data = "review="+review
    xhttp.open("POST", "/process_review")
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(data)
}

document.querySelector("#check").onclick = function() {
    let review = document.querySelector("#review_text").value;
    process_review(review)
}