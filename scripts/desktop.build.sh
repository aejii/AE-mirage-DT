# Stop the script on error
set -o errexit

#Variables
dirname="Mirage-win32-x64"

# Build the Angular application
npx ng build -c electron-prod

# Remove old version if it exists
if test -f ./release/Mirage.zip; then
  rm -rf release/Mirage.zip
fi

# Create a package.json for the package builder
touch electron/package.json && echo {} > electron/package.json

# Package for Windows 64 bits
npx electron-packager electron Mirage --out electron/dist --platform=win32 --arch=x64 --asar --icon=electron/logo.ico

# Move the artifacts into the release folder
cp -r electron/dist/"$dirname" release

# Create a zip for Windows
cd  release && zip -r Mirage.zip "$dirname" && cd -

# Remove the artifacts
rm -rf electron/dist electron/app electron/package.json release/"$dirname"