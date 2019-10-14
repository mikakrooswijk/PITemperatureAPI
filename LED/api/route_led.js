let express = require('express')
let routes = express.Router();
let Gpio = require('onoff').Gpio;
let RED = new Gpio(4, 'out')
let GREEN = new Gpio(17, 'out')
let BLUE = new Gpio(27, 'out')


routes.get('/red', (req, res) => {
		if(RED.readSync() === 0){
			RED.writeSync(1);
			res.send('on')
		}else{
			RED.writeSync(0);
			res.send('off')
		}
})

routes.get('/green', (req, res) => {
		if(GREEN.readSync() === 0){
			GREEN.writeSync(1);
			res.send('on')
		}else{
			GREEN.writeSync(0);
			res.send('off')
		}
})

routes.get('/blue', (req, res) => {
		if(BLUE.readSync() === 0){
			BLUE.writeSync(1);
			res.send('on')
		}else{
			BLUE.writeSync(0);
			res.send('off')
		}
})



module.exports = routes;
