import { createAdapter } from "@socket.io/redis-adapter";
import * as pino from "pino";
import { createClient } from "redis";
import { Server } from "socket.io";
import { RandomDelayTask } from "./RandomDelayTask.js";
import { ForecastOdd } from "./OddsTable.js";
import random from "random";

const SOCKETIO_PATH = process.env["SOCKETIO_PATH"] || "/my-socketio-path/";
const REDIS_HOST = process.env["REDIS_HOST"] || "localhost:6379";

const logger = pino.pino();

const io = new Server({
    path: SOCKETIO_PATH
});

const pubClient = createClient({url:`redis://${REDIS_HOST}`});
const subClient = pubClient.duplicate();

const task = RandomDelayTask(() => {
    const odds:ForecastOdd = {
        id: `${random.int(1,7)}-${random.int(1,7)}`,
        odds: random.int(0,99),
        lastUpdated: new Date()
    }
    io.emit("odds",odds);
},20,2000);

Promise.all([pubClient.connect(),subClient.connect()]).then(() => {
    logger.info("redis clients connected");
    io.adapter(createAdapter(pubClient,subClient));
    task.run();
});