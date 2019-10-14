let express = require('express')
let routes = express.Router();
let ds = require('ds18b20');
const env = require('../config/env');
const mysql = require('mysql');

const pool = mysql.createPool({
		connectionLimit: 10,
		host :env.env.dbhost,
		user : 'monitor',
		password : 'monitor',
		database : 'temp'
});


routes.get('/room', (req, res) => {
	ds.sensors((err, ids)=>{
		ds.temperature(ids[0], (err, value) => {
				res.status(200).json({"temp": value})
		})
	})
})

routes.get('/room/avgtoday', (req, res) => {
	
		let d = new Date();
		let month = d.getMonth()+1
		let date = d.getFullYear() + '-' + month + '-' + d.getDate()
		let sql = "select avg(temp) from tempdata where date = ? ";
		
		values = [[date]]
		
			pool.getConnection((err, connection) =>{
				
				connection.query(sql, values, (err, result)=>{
				if(err) res.status(500).json(err);
					res.status(200).send(result[0]);
				connection.release();
				})
		})
	
})

routes.get('/room/maxtoday', (req, res) => {
		let d = new Date();
		let month = d.getMonth()+1
		let date = d.getFullYear() + '-' + month + '-' + d.getDate()
		let sql = "select max(temp) from tempdata where date = ? ";
		
		values = [[date]]
		
			pool.getConnection((err, connection) =>{
				
				connection.query(sql, values, (err, result)=>{
				if(err) res.status(500).json(err);
					res.status(200).send(result[0]);
				connection.release();
				})
		})
})

routes.get('/room/alltoday', (req, res) => {
		let d = new Date();
		let month = d.getMonth()+1
		let date = d.getFullYear() + '-' + month + '-' + d.getDate()
		let sql = "select * from tempdata where date = ? ";
		
		values = [[date]]
		
			pool.getConnection((err, connection) =>{
				
				connection.query(sql, values, (err, result)=>{
				if(err) res.status(500).json(err);
				
					let count = 0
					let resultSmall = []
					
					for(let i = 0; i < result.length; i++){
						if(count == 15){
							resultSmall.push(result[i])
							count = 0
						}else{
							count++
						}
					}
				
					res.status(200).send(resultSmall);
				connection.release();
				})
		})
})

module.exports = routes;
