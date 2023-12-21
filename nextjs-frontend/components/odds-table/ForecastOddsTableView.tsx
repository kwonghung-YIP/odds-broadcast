import { ForecastOdd, Horse } from "./OddsTable"
import "./ForecastOddsTable.css"
import { ReactElement } from "react";
import classNames from "classnames";
import moment from "moment";

const ForecastOddsTableView = ({
    horses,odds
}:{
    horses:Map<number,Horse>,
    odds:Map<string,ForecastOdd>
}) => {

    const maxOdds = Array.from(odds.values())
        .reduce((result,item) => Math.max(item.odds,result),0);
    const minOdds = Array.from(odds.values())
        .reduce((result,item) => Math.min(item.odds,result),99999);

    //console.log(odds);
    //console.log(`render odds max: ${maxOdds}, min: ${minOdds}`);

    let oddsCells: Array<Array<ReactElement>> = [];

    const justUpdated = (date?:Date):boolean => {
        if (date===undefined) {
            return false
        } else {
            return moment().subtract(3,'second').isBefore(date)
        }
    }

    for (let f=1;f<=horses.size;f++) {
        oddsCells.push([])
        for (let s=1;s<=horses.size;s++) {
            const key = f+"-"+s;
            let item = odds.get(key);
            if (item===undefined) {
                oddsCells[f-1].push(
                    <div key={key}>-</div>
                )
            } else {
                // classNames reference: https://www.npmjs.com/package/classnames
                let cellClass = classNames({
                    "cell": true,
                    "max": item.odds >= maxOdds,
                    "min": item.odds <= minOdds,
                    "updated": justUpdated(item.lastUpdated)
                })
                oddsCells[f-1].push(
                    <div key={key} className={cellClass}>{item.odds}</div>
                )
            }
        }
    }

    return (
        <div className="odds-table-wrapper" style={{"--no-of-horse":horses.size} as React.CSSProperties}>
            <div key="top-left" className="row-header">-</div>
        {Array.from(horses.values()).map(horse => (
            <>
                <div key={"row-"+horse.no} className="row-header">
                    {horse.no}
                </div>
                <div key={"col-"+horse.no} className="col-header">
                    {horse.no}
                </div>
            </>
        ))}
        {oddsCells}
        </div>
    )
}

export default ForecastOddsTableView