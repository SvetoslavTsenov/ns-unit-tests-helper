import { getScreenshot as getScreenshotFromAndroidDevice } from "./android"
import { getScreenshot as getScreenshotFromIOSDevice } from "./ios"

export const takeScreenshot = (os: "ios" | "android", deviceId: string, fullImageName: string) => {
    if (os.toLowerCase() === "android") {
        return getScreenshotFromAndroidDevice(deviceId, fullImageName);
    } else {
        return getScreenshotFromIOSDevice(fullImageName, deviceId);
    }
}
