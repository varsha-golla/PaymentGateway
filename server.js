var express = require('express')
var app = express()
app.use(express.static('static-files'))

var Insta = require('instamojo-nodejs');

var url = require('url');

var request = require('request')
app.set('view engine', 'ejs')


app.get('/pay', function(req, res) {
	Insta.setKeys('9c8b2128c4e22bb1def7c0d818f792dc', 'fa378705aa0d308a8e274e401c65c2ee'); //real api
	//Insta.setKeys('test_b1e2cebe7a4bdcb43e71639e0f1', 'test_3fac1a58187cf5e1018060c41cb');	//test api
	var data = new Insta.PaymentData();
	Insta.isSandboxMode(false);

	data.purpose = "Test";
	data.amount = '9';
	data.buyer_name =  "svecw";
	data.user_id = '345';
	data.redirect_url =  "http://localhost:3000/callback?user_id=345";
	data.email =  "ravikumars@svecw.edu.in";
	data.phone =  "9394747838";
	data.send_email =  false;
	data.webhook= 'http://www.example.com/webhook/';
	data.send_sms= false;
	data.allow_repeated_payments =  false;
	console.log("paid");
	//data.setRedirectUrl("http://localhost:3000/response/user_id=345");
	Insta.createPayment(data, function(error, response) {
		if (error) {
			// some errors`
			console.log(error)
		} else {
			// Payment redirection link at response.payment_request.longurl
			const responseData = JSON.parse( response );
			console.log(responseData);
			const redirectUrl = responseData.payment_request.longurl;
			console.log( redirectUrl );
	
		res.redirect(301, redirectUrl);
	// 		res.status( 200 ).json( redirectUrl );
	 	}
	});
})

app.get( '/callback', function( req, res ){
	let url_parts = url.parse( req.url, true),
		responseData = url_parts.query;
		console.log(responseData);
	if ( responseData.payment_id ) {
		let userId = responseData.user_id;
		console.log(userId);
		console.log(responseData.payment_id)
		// Save the info that user has purchased the bid.
		// const bidData = {};
		// bidData.package = 'Bid100';
		// bidData.bidCountInPack = '10';

		// User.findOneAndUpdate( { _id: userId }, { $set: bidData }, { new: true } )
		// 	.then( ( user ) => res.json( user ) )
		// 	.catch( ( errors ) => res.json( errors ) );

		// Redirect the user to payment complete page.
		//res.send('successful');
		res.render('success',{res:responseData})
	}	else {
		res.render('failure',{})
	}

})

app.get('/', function (req, res) {
	res.sendFile(__dirname+'/static-files/pay.html')
})

app.listen(3000, function(){
	console.log('we started the server')
})