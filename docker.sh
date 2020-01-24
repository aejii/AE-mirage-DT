if docker run \
  -it \
  -v /$(pwd):/usr/src/mirage maryannah/cordova:latest npm run release ; then
    echo "Running TTY in Docker"
else
    echo "Running WINPTY in Docker"
    winpty docker run \
      -it \
      -v /$(pwd):/usr/src/mirage maryannah/cordova:latest npm run release
fi