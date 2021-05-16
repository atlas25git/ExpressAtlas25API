//jshint esversion:6
const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.RESTREVIEWS_DB_URI, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post",postSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.route("/")
.get(function(req,res){
  res.send('<h1>Hello, This is backend API(RESTful) of the database deployed on <a href="https://safe-depths-08690.herokuapp.com/">atlas25express</a></h1><br><h3>With the following functionalities:</h3> <br><ol><li><strong>GET</strong><hr><strong>/posts</strong> : Makes a get request to fetch all the articles from the database.</li><br><li><strong>POST</strong><hr><strong>/</strong> : Makes a POST request to add a article to the database.</li><br><li><strong>DELETE</strong><hr><strong>/</strong> : Makes a DELETE request to delete the article from the database.</li><br><li><strong>GET</strong><hr><strong>/posts/:postTitle</strong> : Makes a GET request to fetch an article from the database, with provided title.</li><br><li><strong>PUT</strong><hr><strong>/posts/:postTitle</strong> : Makes a PUT request to update an article from the database, with provided title.</li><br><li><strong>PATCH</strong><hr><strong>/posts/:postTitle</strong> : Makes a PATCH request to patch an article from the database, with provided title.</li><br><li><strong>DELETE</strong><hr><strong>/posts/:postTitle</strong> : Makes a DELETE request to delete an article from the database, with provided title.</li>');
})

app.route("/posts")

.get(function(req, res){
  Post.find(function(err, posts){
    if (!err) {
      res.send(posts);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newPost = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(req.body.title);
  newPost.save(function(err){
    if (!err){
      res.send("Successfully added a new post.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Post.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all posts.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targetting A Specific Article////////////////////////

app.route("/posts/:postTitle")

.get(function(req, res){

  Post.findOne({title: req.params.postTitle}, function(err, postArticle){
    if (postArticle) {
      res.send(postArticle);
    } else {
      res.send("No posts matching that title was found.");
    }
  });
})

.put(function(req, res){

  Post.update(
    {title: req.params.postTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected post.");
      }
    }
  );
})

.patch(function(req, res){

  Post.update(
    {title: req.params.postTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated post.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Post.deleteOne(
    {title: req.params.postTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding post.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(process.env.PORT ||3000, function() {
  console.log("Server started on port 3000");
});
