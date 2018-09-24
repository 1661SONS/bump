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

                <div class="uk-flex-last@s uk-card-media-right uk-cover-container">
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
	  	$(".uk-modal-title").html(data.title);
	  	// if the article has comments
	  	if (data.comments.length !== 0) {
	  		// clear comment div
	  		$("#attachedComments").empty();
	  		for (i = 0; i < data.comments.length; i++) {
	  			// append all article comments
                $("#attachedComments").append("<div class='userComments'><p class='comment'>" + data.comments[i].body + "</p></div>");
	  		}
	  	}
	  	// Append save comment button with article's ID saved as data-id attribute
	  	$(".uk-modal-footer").html(`<button id="saveComment" class="uk-button uk-button-default viewComments" data-id="`+data._id+`"><span uk-icon="check"></span>&nbsp;save comment</button>`)
	  });
	});

	// Modal X button closes modal and removes comments
	$(document).on("click", ".delete", function() {
		$(".commentsModal").toggleClass("is-active");
		$("#attachedComments").empty();
	});

	// Saving Comments
	$(document).on("click", "#saveComment", function() {
	  // Grab the id associated with the article from the submit button
	  var articleID = $(this).attr("data-id");
	  // Run a POST request to add a comment, using what's entered in the inputs
	  $.ajax({
	    method: "POST",
	    url: "/comment/" + articleID,
	    data: {
	      // Value taken from body input
	      body: $("#commentField").val()
	    }
	  }).done(function(data) {
      // Log the response
      console.log("data: ", data);
		});

	  // Also, remove the values entered in the inputs for comment entry
	  $("#commentField").val("");
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