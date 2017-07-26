// var xhr = new XMLHttpRequest();
// xhr.open("GET", "http://www.freesound.org/apiv2/search/text/?query=dogs&token=FuiD28l1Fo8cd4FeYJZSkPHo5A0y8JMM8yVfckox", true);
// xhr.send();

window.onload = function(){
        freesound.setToken("FuiD28l1Fo8cd4FeYJZSkPHo5A0y8JMM8yVfckox");
        
        var fields = 'id,name,url';
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

    function displayError(text){
        document.getElementById('error').innerHTML=text;
    }
    function displayMessage(text,place){
        document.getElementById(place).innerHTML=text;
    }
