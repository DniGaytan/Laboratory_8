let express = require('express');
let mongoose = require('mongoose');
let {blogFunctionalities} = require('./blog-post-model');
let parser = require('body-parser');
let jsonP = parser.json();
let morgan = require('morgan');
let uuid = require('uuid');
let cors = require('cors');
let app = express();

let {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));
app.use( morgan( 'dev' ) );

mongoose.Promise = global.Promise;


app.get('/blog-posts', function(req, res){
  blogFunctionalities.get()
  .then( (posts) => {
    return res.status(200).json(posts);
  })
  .catch( (e) => {
    res.statusMessage = "Cannot connect properly with the DB";
    return res.status(500).json({
      status : 500,
      message : res.statusMessage,
    });
  });
});

app.post('/blog-posts/:author', jsonP, function(req, res){
  if(req.params.author = ''){
    res.statusMessage = "Author must be present in the query.";
    console.log("this was triggered")

    return res.status(406).json({
      code: 406,
      message: res.StatusMessage,
    });
  }



  blogFunctionalities.getByAuthor(req.body.author)
  .then( (posts) => {
    return res.status(200).json(posts);
  })
  .catch( (e) => {
    res.statusMessage = "Cannot connect properly with the DB";
    return res.status(500).json({
      status : 500,
      message : res.statusMessage,
    });
  });
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
      publishDate: new Date(),
    }

    blogFunctionalities.post(newPost)
    .then( (post) => {
      return res.status(201).json(post);
    })
    .catch( (e) => {
      res.statusMessage = "Cannot connect properly with the DB";
      return res.status(500).json({
        status : 500,
        message : res.statusMessage,
      });
    });
  }
});

app.delete('/blog-posts/:id', function(req, res){
  if(req.params.id == ''){
    res.statusMessage('Id must be present in the query');
    return res.status(406);
  }

  blogFunctionalities.delete(req.params.id)
  .then((post) => {
    return res.status(200);
  })
  .catch( (e) => {
    res.statusMessage = "Cannot connect properly with the DB";
    return res.status(500).json({
      status : 500,
      message : res.statusMessage,
    });
  });
});

app.put('/blog-posts/:id', jsonP, function(req, res){
  if(req.body.id != ''){
    if (req.params.id == req.body.id) {
          blogFunctionalities.getId(req.body.id).then((currentBlog) => {
            console.log(currentBlog)

            if(req.body.title == ""){
              req.body.title = currentBlog[0].title;
            }
            if(req.body.content == ""){
              req.body.content = currentBlog[0].content;
            }
            if(req.body.author == ""){
              req.body.author = currentBlog[0].author;
            }
            if(req.body.publishDate == ""){
              req.body.publishDate = currentBlog[0].publishDate;
            }

            console.log(req.body);

            blogFunctionalities.put(req.body)
            .then((post) => {
              return res.status(202).json(post);
            })
            .catch( (e) => {
              res.statusMessage = "Cannot connect properly with the DB";
              return res.status(500).json({
                status : 500,
                message : res.statusMessage,
              });
            });
          });
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

let server;

function runServer(port, databaseUrl){
	return new Promise( (resolve, reject ) => {
		mongoose.connect(databaseUrl, response => {
			if ( response ){
				return reject(response);
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing the server');
				server.close( err => {
					if (err){
						return reject(err);
					}
					else{
						resolve();
					}
				});
			});
		});
}

runServer( PORT, DATABASE_URL )
	.catch( err => {
		console.log( err );
	});

module.exports = { app, runServer, closeServer };
