$(document).ready(function(){
  $("#uploadBtn").click(function(){
    $("#uploadInput").click();
  });

  $("#uploadInput").change(function(e){
    const reader = new FileReader();
    reader.onload = function(event){
      $("#previewImage").attr('src', event.target.result);
      $("#preview").removeClass('hidden');
    }
    reader.readAsDataURL(e.target.files[0]);
  });

  $("#analyzeBtn").click(function(){
    const imgBase64 = $("#previewImage").attr('src');
    analyzeImage(imgBase64);
  });
});

function analyzeImage(base64data) {
  $("#loader").removeClass("hidden");
  $("#results").addClass("hidden");

  const formData = new FormData();
  formData.append('file', base64ToBlob(base64data, 'image/png'), 'face.png');

  $.ajax({
    url: 'http://localhost:8000/analyze/',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(response){
      $("#loader").addClass("hidden");
      if(response.status === "success"){
        const res = response.data[0];
        $("#results").html(`
          <h3>Results</h3>
          <p><strong>Emotion:</strong> ${res.emotion.dominant_emotion}</p>
          <p><strong>Age:</strong> ${res.age}</p>
          <p><strong>Gender:</strong> ${res.gender}</p>
          <p><strong>Race:</strong> ${res.race.dominant_race}</p>
        `);
        $("#results").removeClass("hidden");
      } else {
        alert(response.message);
      }
    },
    error: function(err){
      $("#loader").addClass("hidden");
      alert("Server Error: " + err.responseText);
    }
  });
}

function base64ToBlob(base64, mime) {
  const byteChars = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], {type: mime});
}