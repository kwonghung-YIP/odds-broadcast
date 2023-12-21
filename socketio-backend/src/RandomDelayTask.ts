import random from "random";

type callbackFn = () => void;

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
        console.log(`run task ${execCount}...`);
        clearTimeout(timeoutId);

        if (execCount<noOfExec) {
            callback();
            callSetTimeout();
        } else {
            console.log(`task completed`);
        }
    }

    return {
        run: ():void => {
            callSetTimeout();
        }
    };
}