import { request } from "tns-core-modules/http";
import { device, isIOS, screen } from "tns-core-modules/platform";

export const sendDataForImageComparison = (imageName: string, imageData) => {
    const nativePlatformLocalhost = isIOS ? "localhost" : "10.0.2.2";
    const base64String = imageData.toBase64String("png");
    return new Promise((resolve, reject) => {
        const content = JSON.stringify({
            imageName: imageName,
            imageData: encodeURI(base64String),
            sdkVersion: device.sdkVersion,
            model: device.model,
            os: device.os,
            uuid: device.uuid,
            osVersion: device.osVersion,
            density: screen.mainScreen.scale,
            height: screen.mainScreen.heightPixels,
            width: screen.mainScreen.widthPixels,
        });
        request({
            url: `http://${nativePlatformLocalhost}:8000/compare`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            content: content
        }).then((response) => {
            const result = response.content.toJSON();
            resolve(result);
        }, (e) => {
            console.error("Send image data throws error!", e.message);
            reject(e);
        });
    });
};