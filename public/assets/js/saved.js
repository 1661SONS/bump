$(document).ready(function() {

	// render saved articles on page load
	$.getJSON("/articles", function(data) {
        console.log("\n--------------------");
        console.log("SAVED ARTICLE:".green);
        console.log("--------------------");

	  for (var i = 0; i < data.length; i++) {
          
        // if article has been marked as saved
	  	if (data[i].saved === true) {
           
            // display saved article cards on the page
            $("#saved-results").append(`<div id="savedCard" class="uk-card uk-card-default uk-grid-collapse uk-child-width-1-2@s uk-margin" uk-grid>

                <div class="uk-flex-last@s uk-card-media-left uk-cover-container">
                    <img src="`+data[i].image+`" alt="article image" uk-cover>
                    <canvas width="300" height="200"></canvas>
                </div>

                <div>
                    <div class="uk-card-body">
                        <h3 class="uk-card-title">`+data[i].title+`</h3>

                        <a data-id="`+data[i]._id+`" class="viewComments uk-button uk-button-default" href="#commentsTrigger" uk-toggle><span uk-icon="commenting"></span>&nbsp;comments</a>&nbsp;&nbsp;

                    <a><button data-id=`+data[i]._id+` class="removeButton uk-button uk-button-default"><span uk-icon="trash"></span>&nbsp;remove</button></a>
                    </div>
                </div>
            </div>`);
          }
	  }
	});

    // comment button opens the comments modal & displays any comments
	$(document).on("click", ".viewComments", function() {
		// trigger comments modal
		$(".commentsModal").toggleClass("is-active");
		// get article by ID
		var articleID = $(this).attr("data-id");
		// make ajax call for article
	  $.ajax({
	    method: "GET",
	    url: "/articles/" + articleID
	  }).done(function(data) {
	  	// update modal header
	  	$("#comments-header").html("article comments (ID: " + data._id + ")");
	  	// if the article has comments
	  	if (data.comments.length !== 0) {
	  		// clear comment div
	  		$("#attachedComments").empty();
	  		for (i = 0; i < data.comments.length; i++) {
	  			// append all article comments
                $("#attachedComments").append("<div class='comment-div'><p class='comment'>" + data.comments[i].body + "</p></div>");
	  		}
	  	}
	  	// Append save comment button with article's ID saved as data-id attribute
	  	$("footer.modal-card-foot").html("<button id='save-comment' class='button is-success' data-id='" + data._id + "'>Save Comment</button>")
	  });
	});

	// Modal X button closes modal and removes comments
	$(document).on("click", ".delete", function() {
		$(".commentsModal").toggleClass("is-active");
		$("#attachedComments").html("<p>Write the first comment for this article.</p>");
	});

	// Saving Comments
	$(document).on("click", "#save-comment", function() {
	  // Grab the id associated with the article from the submit button
	  var articleID = $(this).attr("data-id");
	  // Run a POST request to add a comment, using what's entered in the inputs
	  $.ajax({
	    method: "POST",
	    url: "/comment/" + articleID,
	    data: {
	      // Value taken from body input
	      body: $("#new-comment-field").val()
	    }
	  }).done(function(data) {
      // Log the response
      console.log("data: ", data);
		});

	  // Also, remove the values entered in the inputs for comment entry
	  $("#new-comment-field").val("");
	  // Close comment modal
	  $(".commentsModal").toggleClass("is-active");
	});

	// Deleting Comments
	$(document).on("click", ".delete-comment", function() {
		// delete comment
	});

	// Removing Saved Articles
	$(document).on("click", ".removeButton", function() {
		// Get article id
		var articleID = $(this).attr("data-id");
		console.log(articleID);
		// Run a POST request to update the article to be saved
	  $.ajax({
	    method: "POST",
	    url: "/unsave/" + articleID,
	    data: {
	      saved: false
	    }
      });
      location.reload();
	});

});