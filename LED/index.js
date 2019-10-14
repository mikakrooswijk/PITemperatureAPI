let http = require('http')
let express = require('express')
let bodyParser = require('body-parser')
//let route_led = require('./api/route_led')
let route_temp = require('./api/route_temp')
let route_sec = require('./api/route_security')
const env = require('./config/env')
const jwt = require('jsonwebtoken')



let app = express();

module.exports = {};

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

app.set('port', 3000)
app.set('env', 'development')

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:4200');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//app.use('/api/led', route_led);

app.use(express.static('./'))

app.use('/api/security', route_sec)

app.use('*', (req, res, next) =>{
	
	console.log('request')
	
		const token = req.headers.token;
		
		if(token){
			jwt.verify(token, 'TESTKEY', (err, decode) => {
			if(err){
				res.status(401).json({token: 'token invalid'})
			}else{
				next()
			}
		})
		}else{
			res.status(401).send('please supply a token')
		}
		
})
app.use('/api/temp', route_temp);


app.listen(3000, () => {
	console.log('listening on port ' + app.get('port'))
})

module.exports = app;


