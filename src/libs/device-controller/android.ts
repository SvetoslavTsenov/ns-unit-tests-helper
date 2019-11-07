import { basename, resolve, dirname } from "path";
import { existsSync } from "fs";
import { spawnSync } from "child_process";

export const getScreenshot = async (deviceId: string, fullFileName: string) => {
    const pathToScreenshotPng = `/sdcard/${basename(fullFileName)}`;

    const command = deviceId ? ["-s", deviceId, "shell", "screencap", pathToScreenshotPng] : ["shell", "screencap", pathToScreenshotPng];
    const result = executeAdbCommand(command);
    console.log(result.output.toString());

    pullFile(deviceId, pathToScreenshotPng, fullFileName);

    return fullFileName;
}

const getAndroidHome = () => {
    if (process.env["ANDROID_HOME"]) {
        return process.env["ANDROID_HOME"];
    }
    let androidHome = `${process.env["HOME"]}/Library/Android/sdk`;
    if (existsSync(androidHome)) {
        return androidHome;
    }

    androidHome = `/usr/local/share/android-sdk`;
    if (existsSync(androidHome)) {
        return androidHome;
    }

    androidHome = `${process.env["HOME"]}/Android/Sdk`;
    if (existsSync(androidHome)) {
        return androidHome;
    }

    return androidHome;
}

const pullFile = (deviceId: string, remotePath: string, destinationFile: string) => {
    const destinationFolder = dirname(destinationFile);
    // Verify remotePath
    const remoteBasePath = remotePath.substring(0, remotePath.lastIndexOf("/"));

    const command = deviceId ? ["-s", deviceId, "shell", "ls", remoteBasePath] : ["shell", "ls", remoteBasePath]
    const sdcardFiles = executeAdbCommand(command).output.toString();
    if (!sdcardFiles.includes(basename(destinationFile))) {
        const error = remoteBasePath + " does not exist.";
        console.error(error);
        return undefined;
    }

    if (!existsSync(destinationFolder)) {
        console.error(`The folder ${destinationFolder} doesn't exist!`);
        return undefined;
    }

    // Pull files
    const pullCommand = deviceId ? ["-s", deviceId, "pull", remotePath, destinationFile] : ["pull", remotePath, destinationFile];
    const output = executeAdbCommand(pullCommand).output.toString();
    console.log(output);
    const o = output.toLowerCase();
    if ((o.includes("error")) || (o.includes("failed")) || (o.includes("does not exist"))) {
        const error = "Failed to transfer " + remotePath + " to " + destinationFolder;
        console.error(error);
        console.error("Error: " + output);
        return undefined;
    } else {
        console.log(`${remotePath} transferred to ${destinationFile}`);
    }

    return destinationFile;
}

const executeAdbCommand = (commands: Array<string>, timeout: number = 5000) => {
    console.log(`Executing command: ${ADB}`, commands.join(" "));
    return spawnSync(ADB, commands, {
        shell: true,
        encoding: "UTF8",
        timeout: timeout
    });
};

const ADB = resolve(getAndroidHome(), "platform-tools", "adb");