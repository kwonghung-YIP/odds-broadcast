import { createServer } from "node:http";
import { Namespace, Server, Socket } from "socket.io";
import 'dotenv/config';
import { RandomDelayTask } from "./RandomDelayTask.js";
import { ForecastOdd } from "./OddsTable.js";
import random from "random";

const httpServer = createServer();
const io = new Server(httpServer,{
    cors: {
        origin: "http://192.168.19.130:3000",
        methods: ["GET","POST"]
    }
});
const port = process.env["SERVER_PORT"];

io.on("connection",(socket:Socket) => {
    console.log(`new session connected:${socket.id}`);

    socket.on('disconnect',(reason:String)=>{
        console.log(`session disconnect:${socket.id} because ${reason}`);
    });
});

io.on("new_namespace",(namespace:Namespace) => {
    console.log(`new namespace created: ${namespace.name}`);
});

const task = RandomDelayTask(() => {
    const odds:ForecastOdd = {
        id: `${random.int(1,7)}-${random.int(1,7)}`,
        odds: random.int(0,99),
        lastUpdated: new Date()
    }
    io.emit("odds",odds);
},20,2000)

httpServer.listen(port,() => {
    console.log(`server listen to port ${port}...`);
    task.run();    
});
