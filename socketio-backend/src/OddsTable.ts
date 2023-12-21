export interface ForecastOdd {
    id: string;
    odds: number;
    lastUpdated?: Date; 
}

export interface Horse {
    no: number;
    horseName: string;
    jockey: string;
}