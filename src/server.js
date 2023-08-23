import express from "express";

const PORT = 4000;

const app = express();
// 1. created application
// application is to listen, server is connected to the internet listening to requests

const gossipMiddleware = (req, res, next) => {
	console.log(`Someone is going to: ${req.url}`);
	next();
};

const handleHome = (req, res) => {
	return res.send("I love Middleware");
};

app.get("/", gossipMiddleware, handleHome);
// 2. configure the app
// REQUEST = user asking for something (GET REQUEST = get the website)
// app.get = creating callback after user asks a get request to a root server (i.e "/")
// A FUNCTION MUST BE SENT!!!
// REQ, RES is needed!!! -> express will take handleHome and put in response object
// same as button.addEventListener ("click", handle Click)

//WHEN browser REQUESTED, WE MUST RESPOND!

//middle(soft)ware is btw request and response (After browser requests and before I response)
//all handlers == controllers == middlewares (i.e. gossipMiddleware) --> (req, res, NEXT)
//next -> calls the next function, does not respond, just continues
// with "next();", it'll send to the next function. But with "return res.send", it'll end it.

const handleListening = () =>
	console.log(`Server Listening on Port http://localhost:${PORT} 🚀`);
// 3. listening to external connections
// http -> how servers communicate with each other
// GET = http method -> Getting the http page for us

app.listen(4000, handleListening);
// 4. listen and open the app to the outside world
