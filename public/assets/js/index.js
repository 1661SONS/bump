$(document).ready(function() {

	// grab articles as json when page loads, then append to page
	$.getJSON("/articles", function(data) {

        for (var i = 0; i < data.length; i++) {

            var link = "https://theoutline.com" + data[i].link;

            $("#scrape-results").append(`<div id="articleCard" class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>

                <div class="uk-flex-last@s uk-card-media-right uk-cover-container">
                    <img src="`+data[i].image+`" alt="article image" uk-cover>
                    <canvas width="300" height="200"></canvas>
                </div>

                <div>
                    <div class="uk-card-body">
                        <h3 class="uk-card-title">`+data[i].title+`</h3>
                        <button data-id='` + data[i]._id + 
                    `' type="submit" class="save-article uk-button uk-button-default"><span uk-icon="bookmark"></span>&nbsp;save article</button>&nbsp;&nbsp;

                    <a target="_blank" href=`+link+`><button class="read-article uk-button uk-button-default">read article&nbsp;<span uk-icon="arrow-right"></span></button></a>
                    </div>
                </div>
            </div>`);

        }
	});

	// save article button changes the "saved" article model from false to true
	$(document).on("click", ".save-article", function() {
        
        // change icon to check mark
		// $(this).children("span.icon").children("i.fa-bookmark").removeClass("fa-bookmark").addClass("fa-check-circle");
        
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