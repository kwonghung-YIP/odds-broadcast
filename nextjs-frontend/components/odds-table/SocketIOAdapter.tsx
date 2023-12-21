import { memo, useEffect, useState } from "react"
import { ForecastOdd } from "./OddsTable"
import { io } from "socket.io-client"

type SocketIOServerConfig = {
    uri: string,
    event: string
};

type SocketIOAdapterProps = {
    serverConfig: SocketIOServerConfig,
    updateOdds: (odds:ForecastOdd) => void
};

export const SocketIOAdapter = memo(({serverConfig,updateOdds}:SocketIOAdapterProps) => {

    const [connected, setConnected] = useState(false);

    useEffect(()=>{
        const socket = io(serverConfig.uri);

        socket.on('connect',() => {
            //console.log(`client connect: ${socket.connected} id: ${socket.id}`);
            setConnected(socket.connected);
        });

        socket.on('disconnect', (reason:string) => {
            //console.log(`client disconnect: ${socket.connected} reason ${reason}`);
            setConnected(socket.connected);
        });

        socket.on(serverConfig.event,(event:ForecastOdd)=> {
            //console.log(`received odds ${JSON.stringify(event)}`);
            updateOdds(event);
        });

        socket.io.on("reconnect_attempt",(attempt:number) => {
            console.log(`socket client reconnect attempt: ${attempt}`);
        });

        socket.io.on("reconnect_failed",() => {
            console.log(`socket client reconnect failed`);
        });

        socket.io.on("error",(error:Error) => {
            console.log(`socket client error: ${JSON.stringify(error)}`);
        });

        socket.io.on("reconnect_error",(error:Error) => {
            console.log(`socket client reconnect_error: ${JSON.stringify(error)}`);
        });

        //console.log("client socket connecting...");
        socket.connect();

        return () => {
            //console.log(`client socket disconnecting...`)
            socket.disconnect();
        }
    },[serverConfig]);

    return (<>{connected?"connected":"disconnected"}</>);
},({serverConfig:prev},{serverConfig:next}) => {
    var _ = require('lodash');
    return _.isEqual(prev,next);
});

SocketIOAdapter.displayName="SocketIdAdapter";
