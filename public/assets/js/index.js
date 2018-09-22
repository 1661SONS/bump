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

	    $("#scrape-results").prepend("<div class='result-div'><p class='result-text'>" + data[i].title + "<br>" + "https://theoutline/com" + data[i].link +
	    	"</p><button class='save-article button is-info is-medium' data-id='" + data[i]._id + "'><span class='icon'><i class='fa fa-bookmark'></i></span>Save Article</button></div>");
	  }
	});

	// Save article button changes the "saved" article model from false to true
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