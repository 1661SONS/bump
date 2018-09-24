$(document).ready(function() {

    // grab articles as json when page loads, then append to page
    // would be nice if this also got rid of existing articles so the user would always get fresh ones - not duplicates
	$.getJSON("/articles", function(data) {

        for (var i = 0; i < data.length; i++) {

            var link = "https://theoutline.com" + data[i].link;

            $("#scrape-results").append(`<div id="homeCard" class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>

                <div class="uk-flex-last@s uk-card-media-right uk-cover-container">
                    <img src="`+data[i].image+`" alt="article image" uk-cover>
                    <canvas width="300" height="200"></canvas>
                </div>

                <div>
                    <div class="uk-card-body">
                        <h3 class="uk-card-title">`+data[i].title+`</h3>
                        <button data-id='` + data[i]._id + 
                    `' type="submit" class="saveButton uk-button uk-button-default"><span uk-icon="bookmark"></span>&nbsp;save article</button>&nbsp;&nbsp;

                    <a target="_blank" href=`+link+`><button class="readButton uk-button uk-button-default">read article&nbsp;<span uk-icon="arrow-right"></span></button></a>
                    </div>
                </div>
            </div>`);

        }

    });
    
    // when redirect finishes, play Atom Bomb song from [adult swim]
    var obj = document.createElement("audio");
        obj.src = "/assets/sounds/atomBomb.mp3";
        obj.volume = 0.15;
        obj.autoPlay = false;
        obj.preLoad = true;
        obj.controls = true;

        obj.play();

	// save article button changes the "saved" article model from false to true
	$(document).on("click", ".saveButton", function() {
        
        // change icon to check mark
		$(this).html(`<span uk-icon="check"></span>&nbsp;saved`);
        
        // get article id
		var articleID = $(this).attr("data-id");
        console.log(articleID);
        
		// update the article to be saved
	  $.ajax({
	    method: "POST",
	    url: "/save/" + articleID,
	    data: {
	      saved: true
	    }
	  }).done(function(data) {

      console.log("data: ", data);
		});
	});

});