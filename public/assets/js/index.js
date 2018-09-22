$(document).ready(function() {
	
	// hamburger menu
	$(".navbar-burger").on("click", function() {
		$(".navbar-burger").toggleClass("is-active");
		$(".dropdown").toggle();
		$(".dropdown").toggleClass("is-open");
	});

	// grab articles as json when page loads, then append to page
	$.getJSON("/articles", function(data) {

        for (var i = 0; i < data.length; i++) {

            var link = "https://theoutline.com" + data[i].link;

            $("#scrape-results").append(`<div class="uk-dark uk-padding">

            <h3>`+data[i].title+`</h3>
            
            <button data-id='` + data[i]._id + 
            `' type="submit" class="save-article uk-button uk-button-default"><span uk-icon="bookmark"></span>&nbsp;save article</button>

            <a target="_blank" href=`+link+`>read on outline</a>
            
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