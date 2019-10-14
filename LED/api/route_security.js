let express = require('express')
let routes = express.Router();
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const env = require('../config/env')
const registerAllowed = false;
const fs = require('fs')

const pool = mysql.createPool({
		connectionLimit: 10,
		host :env.env.dbhost,
		user : env.env.dbuser,
		password : env.env.dbpassword,
		database : env.env.database
});



routes.post('/login', (req, res) => {
		


		const username = req.body.username;
		const password = req.body.password;
					
				let sql = 'select password from user where username = ?'
				let values = [[username]]
				
				pool.getConnection((err, connection)=>{
						connection.query(sql, [values], (err, result) => {
							connection.release();
							console.log(result[0].password)
							if(err){
								 console.log(err) 
							}else{
								if(result.length == 1){
										bcrypt.compare(password, result[0].password, (err, resCompare) => {
										if(resCompare){
											const token = jwt.sign({data: username}, env.env.secretkey, {expiresIn: '1d'});
											
											res.status(200).json({
												authorized: true,
												token: token
											})
											
										}else{
											res.status(401).send('wrong username or password')
											
										}
									})
								}else{
									res.status(402).json({authorized: false, error: 'user does not exist'})
								}
							}
						})
				})
						
		
		
		
				

})

routes.post('/register', (req, res) => {
		

			if(registerAllowed){
			const username = req.body.username;
			const password = req.body.password;
			
			
			
			if (password && username){
				
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(password, salt ,(err, hash) => {
						let sql = 'insert into user  (username, password) values ?';
						let values = [[username, hash]]
						
						pool.getConnection((err, connection)=>{
							connection.query(sql, [values], (err, result) => {
							connection.release();
							if(err){
								 console.log(err) 
							}else{
								console.log('result: ' + result.affectedRows);
								res.send('you have been registered')
							}
							
						})
						})
					})
		
				
			})
			}else{
				res.status(400).json({registation: false, error: 'username and password are required'})
			}
			
		}else{
			res.status(500).json({registation: false, error: 'registration not allowed at this time'})
		}
		
		
		
		

		
		
		
})


module.exports = routes;
