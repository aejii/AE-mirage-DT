# Stop the script on error
set -o errexit

# Build the application
npx ng build -c electron-prod

# Create a reference package.json
touch electron/package.json && echo {} > electron/package.json

# Build for Windows and Linux
npx electron-packager electron Mirage --out electron/dist --platform=win32 --arch=x64 --asar --icon=src/app/assets/logo.ico
npx electron-packager electron Mirage --out electron/dist --platform=linux --arch=x64 --asar --icon=src/app/assets/logo.ico
# npx electron-packager electron Mirage --out electron/dist --platform=darwin --arch=x64 --asar --icon=src/app/assets/logo.ico

# For each directory of the dist folder
for dirpath in `find ./electron/dist/ -maxdepth 1 -mindepth 1 -type d`
do
  # Get only the dirname from the dirpath
  dirname=$(basename "$dirpath")
  # Zip the folder
  cd electron/dist && zip -r "$dirname".zip "$dirname" && cd -
  # Move the folder to dist (copy to avoid having file lock errors)
  cp -r electron/dist/"$dirname".zip release/desktop
done

# Remove the artifacts
rm -rf electron/dist electron/app electron/package.json