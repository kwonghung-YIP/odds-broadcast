import random from "random";
import * as pino from "pino";

type callbackFn = () => void;

const logger = pino.pino();

export const RandomDelayTask = (
    callback:callbackFn,
    minDelay:number|undefined = 50,
    maxDelay:number|undefined = 10*1000,
    noOfExec:number|undefined = 1000
) => {
    let timeoutId:NodeJS.Timeout;
    let execCount:number = 0;

    const callSetTimeout = ():void => {
        const delay = random.int(minDelay,maxDelay);
        timeoutId = setTimeout(runCallback,delay);
    }

    const runCallback = ():void => {
        execCount++;
        logger.debug(`run task ${execCount}...`);
        clearTimeout(timeoutId);

        if (execCount<noOfExec) {
            callback();
            callSetTimeout();
        } else {
            logger.info(`task completed`);
        }
    }

    return {
        run: ():void => {
            callSetTimeout();
        }
    };
}