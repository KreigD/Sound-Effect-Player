 window.onload = function () {
   freesound.setToken("FuiD28l1Fo8cd4FeYJZSkPHo5A0y8JMM8yVfckox");

   var fields = 'id,name,url';
   // Example of geeting the info of a sound, queying for similar sounds (content based) and showing some analysis
   // features. Both similar sounds and analysis features are obtained with additional requests to the api.
   var query = "piano"
   freesound.textSearch(query,
     function (sound) {
       var msg = "";
       msg = "<h3>Getting info of sound: " + sound.name + "</h3>";
       msg += "<strong>Url:</strong> " + sound.url + "<br>";
       msg += "<strong>Description:</strong> " + sound.description + "<br>";
       msg += "<img src='" + sound.images.waveform_l + "'>";
       snd = new Audio(sound.previews['preview-hq-mp3']);
       msg += '<br><button onclick="snd.play()">play</button><button onclick="snd.pause()">pause</button><br><br>';
       displayMessage(msg, 'resp1');
       console.log(XMLHttpRequest.status);
     },
     function () {
       displayError("Sound could not be retrieved.")
     }
   );

   function displayError(text) {
     document.getElementById('resp1').innerHTML = text;
   }

   function displayMessage(text, place) {
     document.getElementById(place).innerHTML = text;
   }
 }
