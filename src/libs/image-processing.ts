import * as BlinkDiff from "blink-diff";
import * as PngJsImage from "pngjs-image";
import { resolve, extname } from "path";
import { existsSync, readFileSync, mkdirSync, writeFileSync, copyFileSync } from "fs";
import { takeScreenshot } from "./screen-capture-helper";

export interface IImageComparisonQuery {
    imageName: string,
    imageData?: any,
    sdkVersion: string,
    osVersion: string,
    model: string,
    uuid: string,
    os: "ios" | "android",
    density: number,
    height: number,
    width: number,
    elementWidth?: number;
    elementHeight?: number;
    elementY?: number;
    elementX?: number;
}

export const compareImage = async (imageComparisonData: IImageComparisonQuery) => {
    const imageStorageByDevice = resolveImagesStorage(imageComparisonData);
    const { actualImage, expectedImage, diffImage } = resolveImages(imageStorageByDevice, imageComparisonData);

    const diff = new BlinkDiff({
        imageAPath: actualImage,
        imageBPath: expectedImage,
        imageOutputPath: diffImage,
        imageOutputLimit: BlinkDiff.OUTPUT_ALL,
        thresholdType: BlinkDiff.THRESHOLD_PIXEL,
        threshold: 0,
        verbose: true,
    });

    const result = await runDiff(diff);

    return result;
}

const saveImageToBase64 = (imageName: string, data: any) => {
    writeFileSync(imageName, data, "base64");
}
const resolveImages = (imageStorageByDevice: string, imageComparisonData: IImageComparisonQuery) => {
    const imageData = imageComparisonData.imageData && decodeURIComponent(imageComparisonData.imageData);
    const imageName = imageComparisonData.imageName.endsWith(".png") ? imageComparisonData.imageName : `${imageComparisonData.imageName}.png`;
    const tempFolder = resolve(imageStorageByDevice, "temp-images");
    if (!existsSync(tempFolder)) {
        mkdirSync(tempFolder);
    }

    const actualImage = resolve(tempFolder, imageName);
    if (imageData) {
        saveImageToBase64(actualImage, imageData);
    } else {
        takeScreenshot(imageComparisonData.os, imageComparisonData.uuid, actualImage);
    }

    const expectedImage = resolve(imageStorageByDevice, imageName);
    if (!existsSync(expectedImage)) {
        if (imageData) {
            saveImageToBase64(expectedImage, imageData);
        } else {
            copyFileSync(actualImage, expectedImage);
        }
    }

    const ext = extname(expectedImage);
    const diffImage = actualImage.replace(ext, `_diff${ext}`);

    return { actualImage: actualImage, expectedImage: expectedImage, diffImage: diffImage };
}

const resolveImagesStorage = (imageComparisonData: IImageComparisonQuery) => {
    const mainImagesStorage = process.argv.includes("--path") ?
        process.argv[process.argv.indexOf("--path") + 1] : resolve(__dirname, "..", "..");

    const folderSpecification = resolve(mainImagesStorage, "folders-info.json");
    let folderSpecificationJson;
    if (existsSync(folderSpecification)) {
        folderSpecificationJson = JSON.parse(readFileSync(folderSpecification).toString());
    } else {
        throw new Error(`Missing: ${folderSpecification} file!`);
    }

    const devices = folderSpecificationJson.filter(device => {
        return Object.getOwnPropertyNames(imageComparisonData)
            .every(d => (device[d] && imageComparisonData[d]) ? device[d] === imageComparisonData[d] : true);
    });

    folderSpecificationJson.filter(device => {
        return Object.getOwnPropertyNames(imageComparisonData)
            .forEach(d => {
                const r = (device[d] && imageComparisonData[d]) ? device[d] === imageComparisonData[d] : true;
                if (!r) {
                    console.log("[d] ", d);
                    console.log("imageComparisonData[d] ", imageComparisonData[d]);
                }
            })
    });

    if (devices.length != 1) {
        throw new Error("Devices count should be 1!");
    }

    const deviceStorage = resolve(mainImagesStorage, devices[0].folderName);
    if (!existsSync(deviceStorage)) {
        throw new Error(`Missing folder: ${deviceStorage}!`);
    }

    console.log("images: ", deviceStorage);

    return deviceStorage;
}

const runDiff = (diffOptions: BlinkDiff) => {
    return new Promise<boolean>((resolve, reject) => {
        diffOptions.run(function (error, result) {
            if (error) {
                throw error;
            } else {
                const resultCode = diffOptions.hasPassed(result.code);
                if (resultCode) {
                    console.log('Screen compare passed! Found ' + result.differences + ' differences.');
                    return resolve(true);
                } else {
                    const message = `Screen compare failed! Found ${result.differences} differences.\n`;
                    console.log(message);
                    return resolve(false);
                }
            }
        });
    });
}
