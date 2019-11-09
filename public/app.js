// Grab the articles as a json
function starter(){
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    if(data[i].saved === false){
    $("#articles").append("<div id='articlecontain'><p data-id='" + data[i]._id + "'>" + data[i].title + '<br /><a href="' + data[i].link + '">'+data[i].link+'</a></p> <button class="btn btn-danger save" id="'+data[i]._id+'">Save</button></div>');
    }else if(data[i].saved === true){
      $("#savedarticles").append("<div id='articlecontain'><p data-id='" + data[i]._id + "'>" + data[i].title + '<br /><a href="' + data[i].link + '">'+data[i].link+'</a></p> <button class="btn btn-danger unsave" id="'+data[i]._id+'">Unsave</button>'+'<button class="btn btn-danger notes" id="'+data[i]._id+'">Notes</button></div>');

    }
  }
});}

// Whenever someone clicks a p tag
$(document).on("click", ".notes", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      $("#notes").append("<button data-id='" + data._id + "' id='clearnote'>Clear Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
$(document).on("click", "#clearnote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/clearnote/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
$(document).on("click", ".scrape-new", function() {
  // Grab the id associated with the article from the submit button
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
    // With that done
    .then(function(data) {
      // Log the response
      starter()
      // Empty the notes section
    });

  // Also, remove the values entered in the input and textarea for note entry
});
$(".clear").on("click", function() {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clear",
    // On a successful call, clear the #results section
    success: function(response) {
      $("#articles").empty();
    }
  });
});
$(document).on("click", ".save", function() {
  var thisId = $(this).attr("id");

  $.ajax({
    method: "POST",
    url: "/save/" + thisId
  })
    // With that done
    .then(function(data) {
      $("#articles").empty();
      starter()
      // Log the response
      console.log(data);
      // Empty the notes section
    });
})
$(document).on("click", ".unsave", function() {
  var thisId = $(this).attr("id");

  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
  })
    // With that done
    .then(function(data) {
      $("#savedarticles").empty();
      starter()
      // Log the response
      console.log(data);
      // Empty the notes section
    });
})


starter()
