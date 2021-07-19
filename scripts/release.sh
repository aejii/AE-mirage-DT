# Stop the script on error
set -o errexit

# Create the release folder if it does not exists
if test -d ./release; then
  rm -rf release
fi

# Create required folders
mkdir release
mkdir release/desktop

printf "\033[0;32mReleasing for Android ...\n\n\033[0m"
bash ./scripts/android.build.sh

printf "\033[0;32m\nReleasing for Desktop ...\n\n\033[0m"
bash ./scripts/desktop.build.sh

printf "\033[0;32m\nRelease done !\n\n\033[0m"
