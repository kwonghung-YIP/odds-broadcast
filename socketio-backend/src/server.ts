import { createServer } from "node:http";
import { Namespace, Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import 'dotenv/config';
import random from "random";
import * as pino from "pino";

import { RandomDelayTask } from "./RandomDelayTask.js";
import { ForecastOdd } from "./OddsTable.js";


const port = process.env["SERVER_PORT"];
const socketIOPath = process.env["SOCKETIO_PATH"] || "/my-socketio-path/";
const redisHost = process.env["REDIS_HOST"] || "localhost:6379";

const logger = pino.pino();
const httpServer = createServer();
const io = new Server({
    path: socketIOPath,
    cors: {
        origin: "http://192.168.19.130:3000",
        methods: ["GET","POST"]
    }
});
const pubClient = createClient({url:`redis://${redisHost}`});
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

const task = RandomDelayTask(() => {
    const odds:ForecastOdd = {
        id: `${random.int(1,7)}-${random.int(1,7)}`,
        odds: random.int(0,99),
        lastUpdated: new Date()
    }
    io.emit("odds",odds);
},20,2000)

Promise.all([pubClient.connect(),subClient.connect()]).then(() => {
    logger.info("redis clients connected");
    io.adapter(createAdapter(pubClient,subClient));
    httpServer.listen(port,() => {
        logger.info(`server listen to port ${port}...`);
        io.attach(httpServer);
        task.run();    
    });
})

