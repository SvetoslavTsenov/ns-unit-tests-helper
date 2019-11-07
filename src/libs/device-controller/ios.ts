import { spawn, spawnSync } from "child_process";

const XCRUN = "/usr/bin/xcrun ";
const SIMCTL = `${XCRUN} simctl`;

export const getScreenshot = (fileFullName: string, deviceId: string = "booted") => {
    console.log(`Execute command: ${XCRUN} ${SIMCTL} io ${deviceId} screenshot ${fileFullName}`);
    const output = spawnSync(XCRUN, [SIMCTL, "io", deviceId, "screenshot", fileFullName], {
        shell: true,
        encoding: "UTF8",
        timeout: 5000
    });

    return fileFullName;
}