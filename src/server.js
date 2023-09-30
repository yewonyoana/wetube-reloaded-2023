import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
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
app.use(express.json());
//backend understands text is sent from frontend
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
//session기반으로 작동하기 때문에 session middleware 아래에 작성
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Cross-Origin-Embedder-Policy", "credentialless");
	res.header("Cross-Origin-Opener-Policy", "same-origin");
	next();
});
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

export default app;
