import { memo, useEffect, useState } from "react"
import { ForecastOdd } from "./OddsTable"
import { io } from "socket.io-client"
import * as pino from "pino";

type SocketIOServerConfig = {
    uri: string,
    path: string,
    event: string
};

type SocketIOAdapterProps = {
    serverConfig: SocketIOServerConfig,
    updateOdds: (odds:ForecastOdd) => void
};

const logger = pino.pino();

export const SocketIOAdapter = memo(({serverConfig,updateOdds}:SocketIOAdapterProps) => {

    const [connected, setConnected] = useState(false);

    useEffect(()=>{
        //logger.info(serverConfig.uri);
        const socket = io(serverConfig.uri,{
            path: serverConfig.path,
            transports: ["websocket"]
        });

        socket.on('connect',() => {
            logger.info(`client connect: ${socket.connected} id: ${socket.id}`);
            setConnected(socket.connected);
        });

        socket.on('disconnect', (reason:string) => {
            logger.info(`client disconnect: ${socket.connected} reason ${reason}`);
            setConnected(socket.connected);
        });

        socket.on(serverConfig.event,(event:ForecastOdd)=> {
            //console.log(`received odds ${JSON.stringify(event)}`);
            updateOdds(event);
        });

        socket.io.on("reconnect_attempt",(attempt:number) => {
            logger.error(`socket client reconnect attempt: ${attempt}`);
        });

        socket.io.on("reconnect_failed",() => {
            logger.error(`socket client reconnect failed`);
        });

        socket.io.on("error",(error:Error) => {
            logger.error(`socket client error: ${JSON.stringify(error)}`);
        });

        socket.io.on("reconnect_error",(error:Error) => {
            logger.error(`socket client reconnect_error: ${JSON.stringify(error)}`);
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
