var User = require('./userSchema.js');
var articles_collection;

exports.update_articles = function(articles){
	articles_collection = articles;
}

exports.handle_request = function (req,res){
	if (req.body.email && req.body.username && req.body.password) {

	  imageData = req.body.avatarImage != undefined ? req.body.avatarImage: null;

	  var userData = {
	  	avatarImage: imageData,
	    email: req.body.email,
	    username: req.body.username,
	    password: req.body.password
	  }

	  //insert user into Mongodb
	  User.create(userData, function (err, user) {
	    if (err) {
	      console.log(err)
	      return res.send(err.message)
	    } 
	    else {
	      return res.send({status: 200});
	    }
	  });
	}
	else if (req.body.logemail && req.body.logpassword) {
	    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
	      if (error || !user) {
	        var err = new Error('Wrong email or password.');
	        err.status = 401;
	        return res.send(err);
	      } else {
	        req.session.userId = user._id;
	        return res.send({status: 200});
	      }
	    });
	  }
	  else if(req.session.userId){
	  	if (req.body.signout != undefined) {
	  		req.session.userId = null;
	  		return res.send({signout: true})
	  	}

	  	var query = {"_id":0};
	  	if (req.body.length == 2 && req.body.username && req.body.avatarImage) {
	  		query['avatarImage'] = 1;
	  		query['username'] = 1;
	  	}
	  	else{
	  		for(key in req.body){query[key] = 1;}
	  	}

	  	User.find({_id: req.session.userId},query).exec(function(err, rez){
	  		if (Object.keys(req.body).length == 1 && 'articles' in req.body) {
				article_titles = rez[0].articles.map(function(a){return a.title;});
				return res.send(article_titles);
	  		}
	  		res.send(rez);
	  	})
	  }
	  else if(!req.session.userId){
	  	return res.send({status: 401});
	  }
}
