let express = require('express');
let parser = require('body-parser');
let jsonP = parser.json();
let morgan = require('morgan');
let uuid = require('uuid');
let cors = require('cors');
let app = express();

app.use(express.static('public'));
app.use( morgan( 'dev' ) );

var existingPosts = [
  {
    id : uuid.v4(),
    title : 'It, best spooky book?',
    content : 'It, indeed is the best spooky book',
    author: 'Stephen King',
    publishDate: new Date(),
  },
  {
    id : uuid.v4(),
    title : 'Elon Musk talk',
    content : 'Elon Musk has crazy ideas',
    author: 'Ashlee Vance',
    publishDate: Date.now(),
  }
] //Before the server starts running, there is just [2] posts.

app.get('/blog-posts', function(req, res){
  console.log("/blog-posts get was triggered");
  return res.status(200).json(existingPosts);
});

app.get('/blog-posts/:author', function(req, res){
  console.log("/blog-posts:author get was triggered");

  if(req.params.author = ''){
    res.statusMessage("Author must be present in the query.");

    return res.status(406);
  }
  var authorsPosts = []
  for(var i = 0; i < existingPosts.length; i++){
    if(existingPosts[i].author == req.params.author){
      authorsPosts.push(existingPosts[i]);
    }
  }

  if(authorsPosts.length > 0){
      return res.status(200).json(authorsPosts);
  }

  res.statusMessage = "Author does not exist";
  return res.status(404);
});

app.post('/blog-posts', jsonP, function(req, res, next){

  var anyBlank = false;

  if(req.body.title == ""){
    anyBlank = true;
  }
  if(req.body.content == ""){
    anyBlank = true;
  }
  if(req.body.author == ""){
    anyBlank = true;
  }
  if(!anyBlank){
    var newPost = {
      id : uuid.v4(),
      title : req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: Date.now(),
    }

    existingPosts.push(newPost);

    return res.status(201).json(newPost);
  }
  res.statusMessage = "some fields are missing";
  return res.status(406);
});

app.delete('/blog-posts/:id', function(req, res){
  if(req.params.id == ''){
    res.statusMessage('Id must be present in the query');
    return res.status(406);
  }

  let filteredPosts = []

  for(var i = 0; i < existingPosts.length; i++){
    if(req.params.id != existingPosts[i].id){
      filteredPosts.push(existingPosts[i]);
    }
  }

  existingPosts = filteredPosts;

  return res.status(200);
});

app.put('/blog-posts/:id', jsonP, function(req, res){
  if(req.body.id != ''){
    if (req.params.id == req.body.id) {
      for(var i = 0; i < existingPosts.length; i++){
        if(existingPosts[i].id == req.params.id){
          if(req.body.title != ""){
            existingPosts[i].title = req.body.title;
          }
          if(req.body.content != ""){
            existingPosts[i].content = req.body.content;
          }
          if(req.body.author != ""){
            existingPosts[i].author = req.body.author;
          }
          return res.status(202).json(existingPosts[i]);
        }
      }

    }
    else{
      res.statusMessage('Id does not match');
      return res.status(409);
    }

  }
  else{
    res.statusMessage('Id must be present in the query');
    return res.status(406);
  }
});

app.listen('8000', () => {
  console.log("server is running");
});
