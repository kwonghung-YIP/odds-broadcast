import { useImmer } from "use-immer"
import ForecastOddsTableView from "./ForecastOddsTableView"
import { ForecastOdd, Horse } from "./OddsTable"

import horseSample from "./sample-data-horse.json"
import oddsSample from "./sample-data-odds.json"
import { enableMapSet } from "immer"
import { SocketIOAdapter } from "./SocketIOAdapter"

enableMapSet()

const ForecastOddsTable = () => {

    const socketIOUri = process.env["SOCKET_IO_URI"] || "/";
    const socketIOPath = process.env["SOCKET_IO_PATH"] || "/my-socketio-path/";

    //console.log(socketIOUri);

    let horsesMap:Map<number,Horse> = new Map()
    let initOddsMap:Map<string,ForecastOdd> = new Map()

    oddsSample.forEach(odds => {
        initOddsMap.set(odds.id,odds)
    })

    // immer github => https://github.com/immerjs/use-immer
    const [oddsMap, setOddsMap] = useImmer(initOddsMap)

    horseSample.forEach(horse => {
        horsesMap.set(horse.no,horse)
    })

    const updateOdds = (odds:ForecastOdd) => {
        setOddsMap(draft => {
            draft.set(odds.id,odds)
        })
    }
    
    return (
        <>
            <ForecastOddsTableView horses={horsesMap} odds={oddsMap}/>
            <SocketIOAdapter serverConfig={{
                uri:socketIOUri,path:socketIOPath,event:"odds"
                }} updateOdds={updateOdds}/>
        </>
    )
}

export default ForecastOddsTable