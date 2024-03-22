import moment from "moment";
import pino from "pino";
import { createClient } from "redis";

const logger = pino.pino();

logger.info("Starting...");

const client = createClient();

await client.connect();

await client.ping();

await client.hSet('odds:123:1:2',{
    id: "1-2",
    odds: 9.9,
    lastUpd: moment().format()
});

await client.hSet('odds:123:1:3',{
    id: "1-3",
    odds: 9.9,
    lastUpd: moment().format()
});

await client.hSet('odds:123:1:4',{
    id: "1-4",
    odds: 9.9,
    lastUpd: moment().format()
});

const odds = await client.hGetAll('odds:123');

logger.info("object : " + JSON.stringify(odds));

const keys = await client.keys("odds:123:*");

logger.info(keys);

client.disconnect();