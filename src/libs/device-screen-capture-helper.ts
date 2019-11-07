import { getScreenshot as getScreenshotFromAndroidDevice } from "./device-controller/android"
import { getScreenshot as getScreenshotFromIOSDevice } from "./device-controller/ios"


export const takeScreenshot = (os: "ios" | "android", deviceId: string, fullImageName: string) => {
    if (os.toLowerCase() === "android") {
        return getScreenshotFromAndroidDevice(deviceId, fullImageName);
    } else {
        return getScreenshotFromIOSDevice(fullImageName);
    }
}
