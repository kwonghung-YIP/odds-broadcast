import { useImmer } from "use-immer"
import ForecastOddsTableView from "./ForecastOddsTableView"
import { ForecastOdd, Horse } from "./OddsTable"

import horseSample from "./sample-data-horse.json"
import oddsSample from "./sample-data-odds.json"
import { enableMapSet } from "immer"
import { SocketIOAdapter } from "./SocketIOAdapter"

enableMapSet()

const ForecastOddsTable = () => {

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
            <SocketIOAdapter serverConfig={{uri:"http://192.168.19.130:3005/",event:"odds"}} updateOdds={updateOdds}/>
        </>
    )
}

export default ForecastOddsTable