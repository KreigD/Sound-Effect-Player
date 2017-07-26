// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://www.freesound.org/apiv2/search/text/?query=dogs&token=FuiD28l1Fo8cd4FeYJZSkPHo5A0y8JMM8yVfckox", true);
// xhr.send();

window.onload = function(){
        freesound.setToken("FuiD28l1Fo8cd4FeYJZSkPHo5A0y8JMM8yVfckox");
        
        var fields = 'id,name,url';
        // Example 1
        // Example of geeting the info of a sound, queying for similar sounds (content based) and showing some analysis
        // features. Both similar sounds and analysis features are obtained with additional requests to the api.
        freesound.getSound(96541,
                function(sound){
                    var msg = "";
                    msg = "<h3>Getting info of sound: " + sound.name + "</h3>";
                    msg += "<strong>Url:</strong> " + sound.url + "<br>";
                    msg += "<strong>Description:</strong> " + sound.description + "<br>";
                    msg += "<strong>Tags:</strong><ul>";
                    for (i in sound.tags){
                        msg += "<li>" + sound.tags[i] + "</li>";
                    }
                    msg += "</ul><br>";
                    msg += "<img src='" + sound.images.waveform_l + "'>";
                    snd = new Audio(sound.previews['preview-hq-mp3']);
                    msg += '<br><button onclick="snd.play()">play</button><button onclick="snd.pause()">pause</button><br><br>';
                    displayMessage(msg,'resp1');                    
                    // When we have printed some sound info, ask for analysis
                    sound.getAnalysis(null,function(analysis){
                        msg += "<strong>Mfccs:</strong><ul>";
                        for (i in analysis.lowlevel.mfcc.mean){
                            msg += "<li>" + analysis.lowlevel.mfcc.mean[i] + "</li>"
                        }
                        msg += "</ul>";
                        displayMessage(msg,'resp1')
                        // When we have printed the analysis, ask for similar sounds
                        sound.getSimilar(function(sounds){
                            msg += "<strong>Similar sounds:</strong><ul>";
                            
                            for (i =0;i<=10;i++){                                
                                var snd = sounds.getSound(i);
                                msg += "<li>" + snd.id + ": " + snd.url + "</li>"
                            }
                            msg += "</ul>";
                            displayMessage(msg,'resp1')
                        }, function(){ displayError("Similar sounds could not be retrieved.")},
                        {fields:fields});
                    }, function(){ displayError("Analysis could not be retrieved.")},
                    true);// showAll
                }, function(){ displayError("Sound could not be retrieved.")}
        );
        
        
        // Example 2
        // Example of searching sounds: querying the freesound db for sounds
        var query = "violoncello"
        var page = 1
        var filter = "tag:tenuto duration:[1.0 TO 15.0]"
        var sort = "rating_desc"
        freesound.textSearch(query, {page:page, filter:filter, sort:sort, fields:fields},
            function(sounds){
                var msg = ""
                
                msg = "<h3>Searching for: " + query + "</h3>"
                msg += "With filter: " + filter +" and sorting: " + sort + "<br>"
                msg += "Num results: " + sounds.count + "<br><ul>"
                for (i =0;i<=10;i++){  
                    var snd = sounds.getSound(i);
                    msg += "<li>" + snd.name + " by " + snd.username + "</li>"
                }
                msg += "</ul>"
                displayMessage(msg,"resp2")
            },function(){ displayError("Error while searching...")}
        );
        
        // Example 3
        // Example of content based searching
        var t = '.lowlevel.pitch_salience.mean:1.0 .lowlevel.pitch.mean:440';
        var f = ".lowlevel.pitch.var:[* TO 20] AND .metadata.audio_properties.length:[1 TO 10]";
        var page_size  = 10;
        
        freesound.contentSearch({target:t,filter:f, page_size : page_size, fields:fields},
            function(sounds){                
                var msg = ""
                msg = "<h3>Content based searching</h3>"
                msg += "Target: " + t +"<br>"
                msg += "Filter: " + f +"<br>"
                msg += "Fields: " + fields +"<br>"
                msg += "Num results: " + sounds.count + "<br><ul>"
                msg += "<li> ---------- PAGE 1 ---------- </li>"
                for (i in sounds.results){                                        
                    msg += "<li>" +  sounds.results[i].id+ " | " +
                        sounds.results[i].name + " | " + sounds.results[i].url + "</li>"
                }
                msg += "</ul>"
                displayMessage(msg,"resp3")
                // Once we got the first page of results, go to the following one
                sounds.nextPage(
                        function(sounds){
                            msg += "<ul><li> ---------- PAGE 2 ---------- </li>"
                            for (i in sounds.results){
                                var j = parseInt(i);
                                msg += "<li>" +  sounds.results[j].id.toString(10) + 
                                    " | " + sounds.results[j].name + " | " + sounds.results[j].url + "</li>"
                            }
                            msg += "</ul>"
                            displayMessage(msg,"resp3")
                        },
                        function(){ displayError("Error getting next page...")})
            },function(){ displayError("Error while content based searching...")}
        );
        
        // Example 4
        // Example of geoquerying
        var min_lat = 41.3265528618605;
        var max_lat = 41.4504467428547;
        var min_lon = 2.005176544189453;
        var max_lon = 2.334766387939453;
        filterString = "geotag:\"Intersects("+min_lon.toFixed(3)+" "+min_lat.toFixed(3)+" "+max_lon.toFixed(3)+" "+max_lat.toFixed(3)+")\"";
        freesound.textSearch("",{filter:filterString, fields:fields},
                function(sounds){
                    var msg = ""
                    msg = "<h3>Geoquerying</h3>"
                    msg += "Min lat: " + min_lat +"<br>"
                    msg += "Max lat: " + max_lat +"<br>"
                    msg += "Min lon: " + min_lon +"<br>"
                    msg += "Max lon: " + max_lon +"<br>"
                    msg += "Num results: " + sounds.count + "<br><ul>"
                    for (i in sounds.results){
                        msg += "<li>" +  sounds.results[i].id + " | " + 
                            sounds.results[i].name + " | " + 
                            sounds.results[i].url + "</li>";
                    }
                    msg += "</ul>"
                    displayMessage(msg,"resp4")
                },function(err){ console.log(err);displayError("Error while geoquerying...")}
        );
        
        freesound.getUser("Jovica",
            function(user){
                var msg = "";
                msg = "<h3>User info</h3>";
                msg += "Username: " + user.username +"<br>";
                // Get user sounds
                user.sounds(
                        function(sounds){
                            msg += "User sounds:<ul>"
                            for (i in sounds.results){
                                msg += "<li>" +  sounds.results[i].id + " | " + 
                                    sounds.results[i].name + " | " + 
                                    sounds.results[i].url + "</li>";
                            }
                            msg += "</ul>"
                            displayMessage(msg,"resp5")
                        },null,{fields:fields}
                )
            }, function(){ displayError("Error getting user info...")}
        );
    };
    function displayError(text){
        document.getElementById('error').innerHTML=text;
    }
    function displayMessage(text,place){
        document.getElementById(place).innerHTML=text;
    }
