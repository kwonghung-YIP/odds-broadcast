import { createServer } from "node:http";
import { Namespace, Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import 'dotenv/config';
import * as pino from "pino";

const logger = pino.pino();

const SERVER_PORT = process.env["SERVER_PORT"];
const SOCKETIO_PATH = process.env["SOCKETIO_PATH"] || "/my-socketio-path/";
const REDIS_HOST = process.env["REDIS_HOST"] || "localhost:6379";

const httpServer = createServer();
const io = new Server({
    path: SOCKETIO_PATH,
    cors: {
        origin: "http://192.168.19.130:3000",
        methods: ["GET","POST"]
    }
});
const pubClient = createClient({url:`redis://${REDIS_HOST}`});
const subClient = pubClient.duplicate();

io.on("connection",(socket:Socket) => {
    logger.info(`new session connected:${socket.id}`);

    socket.on('disconnect',(reason:String)=>{
        logger.info(`session disconnect:${socket.id} because ${reason}`);
    });
});

io.on("new_namespace",(namespace:Namespace) => {
    logger.info(`new namespace created: ${namespace.name}`);
});

Promise.all([pubClient.connect(),subClient.connect()]).then(() => {
    logger.info("redis clients connected");
    io.adapter(createAdapter(pubClient,subClient));
    httpServer.listen(SERVER_PORT,() => {
        logger.info(`server listen to port ${SERVER_PORT}...`);
        io.attach(httpServer);   
    });
})

process.on("SIGINT",() => {
    logger.info("SIGNINT received...");
    gracefulShutdown();
});

process.on("SIGTERM",() => {
    logger.info("SIGNTERM received...");
    gracefulShutdown();
});

const gracefulShutdown = () => {
    httpServer.close(() =>{
        logger.info("httpServer closed...")
    });
    io.close(() => {
        logger.info("all socket.io connections closed");
    });
    Promise.all([pubClient.quit(),subClient.quit()]).then(() => {
        logger.info("all redis clients closed...");
    });
}