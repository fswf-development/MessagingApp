const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Application Routes
    // DOM: Show '/' Page
    router.get('/', function(req,res){
      res.render('page_login', {
        title: 'Login Page'
      });
    });

// Export statement
module.exports=router;
