export interface IImageComparisonQuery {
    imageName: string;
    imageData?: any;
    sdkVersion: string;
    osVersion: string;
    model: string;
    uuid: string;
    os: "ios" | "android";
    density: number;
    height: number;
    width: number;
    elementWidth?: number;
    elementHeight?: number;
    elementY?: number;
    elementX?: number;
}
export declare const compareImage: (imageComparisonData: IImageComparisonQuery) => Promise<boolean>;
