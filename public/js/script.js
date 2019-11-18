var url = "/blog-posts"

$(document).ready(function(){
  var settings = {
    url : url,
    method : 'GET',
    contentType : "application/json",
    success : function(response){
      console.log(response);
      restartBlogs(response);
      for(var i = 0 ; i < response.length; i++){
        var newDiv = document.createElement("div");
        var titleH4 = document.createElement("h4");
        var contentP = document.createElement("p");
        var authorP = document.createElement("p");
        $(titleH4).text(response[i].title);
        $(contentP).text(response[i].content);
        $(authorP).text(response[i].author);
        $(newDiv).append(titleH4, contentP, authorP);
        $(newDiv).addClass("blog-entry justify-content-center");
        $(newDiv).attr('id', response[i].id);
        $("#blogs-wrap").append(newDiv);
      }
    },
    error : function(errorResponse){
      alert(errorResponse.json.statusMessage);
    }
  };

  $.ajax(settings);

})

$("#button-post").on("click", function(event){
  event.preventDefault();
    var newPost = {
      title : $("#blog-title").val(),
      content : $("#blog-content").val(),
      author : $("#blos-author").val(),
    }

    console.log($("#blog-title").val());

    settings = {
      url : url,
      method : 'POST',
      data : JSON.stringify(newPost),
      datatype : 'JSON',
      contentType : "application/json",
      success : function(response){
        updateBlogs(response);
        updateMain(response);
      },
      error : function(errorResponse){
        alert(errorResponse.json.statusMessage);
      }
    }

    $.ajax(settings);
});

$("#button-delete").on("click", function(event){

  var options = $("#delete-select").children();
  console.log(options);

  for(var i = 0 ; i < options.length; i++){
    if(options[i].selected){
      console.log(options[i].className);
      settings = {
        url : url + "/" +options[i].className,
        method : 'DELETE',
        contentType : "application/json",
        success : function(response){
          restartBlogs(response);
          restartMain(response);

        },
        error : function(errorResponse){
          alert(errorResponse.json.statusMessage);
        }
      }

      $.ajax(settings);
    }
  }
});

$("#button-update").on("click", function(event){
    var options = $("#update-select").children();

    for(var i = 0 ; i < options.length; i++){
      if(options[i].selected){
        var sendingPost = {
          id : options[i].className,
          title : $("#update-title").val(),
          content : $("#update-content").val(),
          author : $("#update-author").val(),
        }
        console.log(options[i].className);
        settings = {
          url : url + "/" +options[i].className,
          method : 'PUT',
          data : JSON.stringify(sendingPost),
          dataType : 'JSON',
          contentType : "application/json",
          success : function(response){
            changePost(response);
          },
          error : function(errorResponse){
            alert(errorResponse);
          }
        }

        $.ajax(settings);
      }
    }
});

$("#button-search").on("click", function(evenet){
  var authorName = $("#search-title").val();


  var authorData = {
    author : authorName,
  };

  console.log(authorData);

  settings = {
    url : url + "/" + authorName,
    method : 'POST',
    data : JSON.stringify(authorData),
    dataType : 'JSON',
    contentType : "application/json",
    success : function(response){

      if(response.length != 0){
        $("#blogs-wrap").empty();
        restartMain(response);
      }
      else{
        $("#blogs-wrap").empty();
      }

    },
    error : function(errorResponse){
      console.log("error");
    }
  }

  $.ajax(settings);
})

function updateBlogs(blog){
  console.log(blog.title);
    var opt = document.createElement("option");
    $(opt).text(blog.title);
    $(opt).addClass(blog.id);
    $("#delete-select").append(opt);

    var opt = document.createElement("option");
    $(opt).text(blog.title);
    $(opt).addClass(blog.id);
    $("#update-select").append(opt);

};

function restartBlogs(blogs){
  $("#delete-select").empty();
  $("#update-select").empty();
  for(var i = 0; i < blogs.length; i++){
    var opt = document.createElement("option");
    $(opt).text(blogs[i].title);
    $(opt).addClass(blogs[i].id);
    $("#delete-select").append(opt);

  }

  for(var i = 0; i < blogs.length; i++){
    var opt = document.createElement("option");
    $(opt).text(blogs[i].title);
    $(opt).addClass(blogs[i].id);
    $("#update-select").append(opt);
  }

};

function restartMain(blogs){
  $("#blogs-wrap").empty();

  for(var i = 0 ; i < blogs.length; i++){
    var newDiv = document.createElement("div");
    var titleH4 = document.createElement("h4");
    var contentP = document.createElement("p");
    var authorP = document.createElement("p");
    $(titleH4).text(blogs[i].title);
    $(contentP).text(blogs[i].content);
    $(authorP).text(blogs[i].author);
    $(newDiv).append(titleH4, contentP, authorP);
    $(newDiv).addClass("blog-entry justify-content-center");
    $(newDiv).attr('id', blogs[i].id);
    $("#blogs-wrap").append(newDiv);
  }
}

function updateMain(blog){

    var newDiv = document.createElement("div");
    var titleH4 = document.createElement("h4");
    var contentP = document.createElement("p");
    var authorP = document.createElement("p");
    $(titleH4).text(blog.title);
    $(contentP).text(blog.content);
    $(authorP).text(blog.author);
    $(newDiv).append(titleH4, contentP, authorP);
    $(newDiv).addClass("blog-entry justify-content-center");
    $(newDiv).attr('id', blog.id);
    $("#blogs-wrap").append(newDiv);

}

function changePost(post){
  var options = $("#update-select").children();
  for(var i = 0; i < options.length; i++){
    if(options[i].className == post.id){
      options[i].text(post.title);
    }
  }

  var options = $("#delete-select").children();
  for(var i = 0; i < options.length; i++){
    if(options[i].className == post.id){
      options[i].text(post.title);
    }
  }

  var divs = $("#blogs-wrap").children();
  for(var i = 0; i < divs.length; i++){
    if(divs[i].id == post.id){
      divs[i].text(post.title);
    }
  }

}
