# Mirage 

**The unofficial best way to play Dofus Touch**

## Installing a dev environment

Simply follow the Dockerfile requirements (JDK, Node, SDK, etc) and adapt it to your own operating system. 

## NPM commands

There are many NPM commands in the `packge.json`, they're mostly here for reference.

The most important dev commands to remember are 

```bash
npm run build
npm run start
npm run ng:serve
```

The first one builds the app, the second one makes Cordova run the built app, and the third one is used to avoid using Cordova to develop the app. 
This is notably useful when doing non-game related features, as Cordova's only addition is installing the game. 

## About Docker

- `./docker.sh` can be ran to get a TTY into the Cordova docker container
  - From there, you can build the app, **but not run it on a device** with `cordova run` (working on it)

## About Cordova

- Make sur to have a `www` folder to let Cordova know that this is a Cordova-ready folder. 
- `platforms/android/local.properties` can sometimes be created and mess up the SDK path. In cas you encounter this issue, there is a NPM command for that. 
- In `platforms/android/CordovaLib/src/org/apache/cordova/engine/SystemWebViewEngine.java @ initWebViewSettings` add this to allow the viewport to be resized

```java
settings.setUseWideViewPort(true);
settings.setLoadWithOverviewMode(true);
```

## About Android

- **DO NOT REMOVE THE APK FOLDER**, it contains the keystore to sign the app
- `apk/keystore.jks` must be existing to sign the app