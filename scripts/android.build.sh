# Stop the script on error
set -o errexit

# Build the Angular application
npx ng build -c cordova-prod

# If the file exists, delete it (otherwise cordova will whine about not finding the SDK path)
if test -f ./platforms/android/local.properties; then
  rm platforms/android/local.properties
fi

# Remove previous version
if test -f ./release/mirageold.apk; then
  rm release/mirageold.apk
fi

# Build the Cordova (Java) application
cordova build android --release --prod

# Move the APK in a more convenient folder
cp platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk apk

# Create the release folder if it does not exists
if ! test -d ./release; then
  mkdir release
fi

# Sign the APK
apksigner sign --out release/mirageold.apk --ks apk/keystore.jks --ks-pass pass:MaxTri2012 --key-pass pass:MaxTri2012 apk/app-release-unsigned.apk

# Remove the artifacts
rm -rf apk/app-release-unsigned.apk www