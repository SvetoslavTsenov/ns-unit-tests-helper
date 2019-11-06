export interface IImageComparisonQuery {
    imageName: string;
    imageData: any;
    sdkVersion: string;
    osVersion: string;
    model: string;
    uuid: string;
    os: "ios" | "android";
    density: number;
    height: number;
    width: number;
}
export declare const compareImage: (imageComparisonData: IImageComparisonQuery) => Promise<boolean>;
