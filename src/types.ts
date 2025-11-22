export interface Shot {
    id: string | number;
    doseIn: number;
    doseOut: number;
    time: number;
    ratio: string;
    timestamp: string;
    coffeeBean?: string;
}
