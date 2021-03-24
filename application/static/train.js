// Advanced settings
var col = document.getElementById("advanced");
col.addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
    }
});

function addSuggestion(value, low, medium, high){
    if(value < low){
        return " (Poor quality) 🙁";
    }else if(value < medium){
        return " (OK quality) 🙂";
    }else if(value < high){
        return " (Good quality) 😃";
    }else{
        return " (Excellent quality) 😄";
    }
}

let SECONDS_PER_ITERATION_PER_SECOND = 0.5;

// Time estimate
function estimateTime(){
    epochs = document.getElementById("epochs").value;
    total_clips = document.getElementById("total_clips").value;
    duration = document.getElementById("duration").value;
    batch_size = document.getElementById("batch_size").value;
    average_duration = parseInt(duration) / parseInt(total_clips);

    iters_per_epoch = Math.ceil(parseInt(total_clips) / parseInt(batch_size));
    iters = iters_per_epoch * parseInt(epochs);
    seconds = Math.ceil(iters * average_duration * SECONDS_PER_ITERATION_PER_SECOND);

    days = Math.floor(((seconds / 60) / 60) / 24);
    seconds -= ((days * 24) * 60) *60;

    hours = Math.floor((seconds / 60) / 60);
    seconds -= (hours * 60) * 60;

    minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    estimate = days+" days, "+hours+":"+minutes+":"+seconds;
    document.getElementById("time_estimate").innerHTML = estimate;
}

// Epochs
low_epoch_threshold = 2500;
medium_epoch_threshold = 5000;
high_epoch_threshold = 7500;

function showEpochsLabel(){
    newVal = document.getElementById("epochs").value;
    text = newVal.toString();
    text += addSuggestion(newVal, low_epoch_threshold, medium_epoch_threshold, high_epoch_threshold);
    document.getElementById("epochs_label").innerHTML = text;
    estimateTime();
}
showEpochsLabel();

// Dataset
low_dataset_threshold = 60 * 60;
medium_dataset_threshold = 180 * 60;
high_dataset_threshold = 300 * 60;

function showDatasetInfo(){
    datasetpath = document.getElementById("path").value;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            j = JSON.parse(this.response);
            duration = j.duration;
            document.getElementById("duration").value = duration;
            total_clips = j.total_clips;
            document.getElementById("total_clips").value = total_clips;
            hours = Math.floor(duration / 60 / 60);
            minutes = Math.floor(duration / 60) - (hours * 60);
            text = hours+" hours, "+minutes+" minutes";
            text += addSuggestion(duration, low_dataset_threshold, medium_dataset_threshold, high_dataset_threshold);
            document.getElementById("dataset_label").innerHTML = text;
            estimateTime();
        }
    };
    xmlhttp.open("GET", "/dataset-duration?dataset="+datasetpath, true);
    xmlhttp.send();
}
showDatasetInfo();

// Batch size
function showBatchSize(){
    newVal = document.getElementById("batch_size").value;
    document.getElementById("batch_size_label").innerHTML = newVal.toString();
    estimateTime();
}
showBatchSize();
