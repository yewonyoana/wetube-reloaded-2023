// // ** 2~ SET UP & EXPRESS **
// import express from "express";
// import morgan from "morgan";

// const PORT = 4000;

// const app = express();
// const logger = morgan("dev");
// // 1. created application
// // application is to listen, server is connected to the internet listening to requests

// const gossipMiddleware = (req, res, next) => {
// 	console.log(`Someone is going to: ${req.url}`);
// 	next();
// };

// const handleHome = (req, res) => {
// 	return res.send("I love Middleware");
// };
// app.use(logger);
// app.get("/", gossipMiddleware, handleHome);
// // 2. configure the app
// // REQUEST = user asking for something (GET REQUEST = get the website)
// // app.get = creating callback after user asks a get request to a root server (i.e "/")
// // A FUNCTION MUST BE SENT!!!
// // REQ, RES is needed!!! -> express will take handleHome and put in response object
// // same as button.addEventListener ("click", handle Click)

// //WHEN browser REQUESTED, WE MUST RESPOND!

// //middle(soft)ware is btw request and response (After browser requests and before I response)
// //all handlers == controllers == middlewares (i.e. gossipMiddleware) --> (req, res, NEXT)
// //next -> calls the next function, does not respond, just continues
// // with "next();", it'll send to the next function. But with "return res.send", it'll end it.

// const handleListening = () =>
// 	console.log(`Server Listening on Port http://localhost:${PORT} 🚀`);
// // 3. listening to external connections
// // http -> how servers communicate with each other
// // GET = http method -> Getting the http page for us

// app.listen(4000, handleListening);
// // 4. listen and open the app to the outside world

//-----------------------

// ** 4~ ROUTERS = group URLS based on the subject
//GLOBAL ROUTERS = pages close to the root
// / -> Home
// /join -> Join
// /login -> Login
// /search -> Search

//USER ROUTERS
//user/:id -> See user
//user/logout -> Logout
// user/edit -> Edit MY Profile
// user/delete -> Delete MY Profile

//VIDEO ROUTERS
// video/:id (watch) -> Watch Video
// video/:id/edit -> Edit Video
// video/:id/delete Video -> Delete Video
//video/upload -> Upload Video

// comments -> Comment on Video
// comments/delete -> Delete Commend on Video

//!! EVERY FILE IS A MODULE
// Export, then Import
//":id" = PARAMETER, allows to have URLs with variables inside

//---
//ONLY FOR EXPRESS

import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
//req.body doesn't exist here!
app.use(express.urlencoded({ extended: true }));
// middleware translating form into javascript before the router
//req.body exists here!
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		//string of text ot sign the cookie
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
	})
);

app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
