# mirageold 

**The unofficial best way to play Dofus Touch**

# What is this file ? 

This is a README, which is used to explain key points in the repository. 
It contains severaml points that have been raised, and things to know in order to make the app work. 

# Installing a development environment

Simply follow the Dockerfile requirements (JDK, Node, SDK, etc) and adapt it to your own operating system. 
Once done, you will have access to npm scripts in the `package.json`.

You will need two core dependencies : `electron` and `cordova`.

# How to release

easy way : docker

download/git clone this repo
```bash
docker build -t mirageold .
```

run and enter in (open port 3000 )
```bash
docker run -i -t -p 3000:3000 mirageold /bin/bash
```

then you have to get the source back (TODO copie in dockerfile?)
```bash
git clone https://github.com/aejii/AE-mirage-DT.git
git clone https://github.com/aejii/nodejs-simple-share-server.git
cd AE-mirage-DT
```

install npm package
```bash
npm i
```

run release script
```bash
./scripts/release.sh
```

how to export (optionnel)
```bash
cd release
mkdir ../../nodejs-simple-share-server/public
cp * -r ../../nodejs-simple-share-server/public
cd ../../nodejs-simple-share-server
npm i
node partage.js
```
open a nav tab on your host computer (http://127.0.0.1:3000/desktop/mirageold-win32-x64.zip)


apk and desktop app are in release folder
(just have to export them out of the docker and you are done (through web server on port 3000?))

# Android Debug Bridge (ADB)

The debug bridge is the middleware that allows cordova to deploy the app on testing devices. It should be included into the Androdi SDK.

When available in the command line, you will get the following commands : 

```bash
TODO
```

# CI/CD Scripts

The `scripts` folder contains several scripts that are used to deployment and integration. 

You can read them and use their code if you'd like to, but they're built around the Docker image.

# Cordova tweaks

- Make sur to have a `www` folder to let Cordova know that this is a Cordova-ready folder. 

# Platform specific tweaks

## Android

- `platforms/android/local.properties` can sometimes be created and mess up the SDK path. In case you encounter this issue, remove this file. 
- In `platforms/android/CordovaLib/src/org/apache/cordova/engine/SystemWebViewEngine.java @ initWebViewSettings` add this to allow the viewport to be resized
```java
settings.setUseWideViewPort(true);
settings.setLoadWithOverviewMode(true);
```
- In `platforms\android\app\src\main\java\com\mirageold\mirageoldDT\MainActivity.java @ onCreate`, at the end, add those lines to ensure the phone does not go into sleep mode and the status bar does not show up at all. This comes from `import android.view.WindowManager;`, which needs to be added too.
```java
getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
```

## Electron

- The packageer requires a `package.json` in the app root folder to properly work
- It also requires an `app` folder in the root folder, which contains the compiled application