let mongoose = require('mongoose')
let uuid = require('uuid/v4');

mongoose.Promise = global.Promise;

var blogSchema = mongoose.Schema(
  {
    id : {
      type : String,
    },
    title : {
      type : String,
    },
    author : {
      type : String,
    },
    content : {
      type : String,
    },
    publishDate : {
      type : String,
    },
  });

let blogHandler = mongoose.model( 'blogHandler', blogSchema);

var blogFunctionalities = {

  get : () => {
    return blogHandler.find().then((posts) => {return posts}).catch((e) => {throw Error(e)});
  },

  getByAuthor : (authorName) => {
    return blogHandler.find({author : authorName}).then((post) => {return post}).catch((e) => {throw Error(e)});
  },

  post : (blogEntry) => {
    return blogHandler.create(blogEntry).then((post) => {return post}).catch((e) => {throw Error(e)});
  },

  put : (blogToUpdate) => {
    return blogHandler.findOneAndUpdate({id : blogToUpdate.id}, blogToUpdate).then((post) => {return post}).catch((e) => {throw Error(e)});
  },

  delete : (id) => {
    return blogHandler.findOneAndRemove({id : id}).then((post) => {return post}).catch((e) => { throw Error(e)});
  }
};

module.exports = {blogFunctionalities};
