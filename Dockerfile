FROM ubuntu:18.04

WORKDIR /tmp

RUN apt update
RUN apt install -y openjdk-8-jdk curl wget unzip make git python
# Run {  update-alternatives --config java  } and remove /bin/java from the desired java path 
ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/jre

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs

RUN npm i -g @angular/cli cordova
RUN cordova telemetry off

RUN wget -O tools.zip https://dl.google.com/android/repository/commandlinetools-linux-6200805_latest.zip
RUN mkdir /usr/lib/Android
RUN unzip tools.zip -d /usr/lib/Android
RUN wget -O gradle.zip https://services.gradle.org/distributions/gradle-6.3-bin.zip
RUN mkdir /usr/lib/Gradle
RUN unzip gradle.zip -d /usr/lib/Gradle

ENV ANDROID_HOME /usr/lib/Android
ENV GRADLE_HOME /usr/lib/Gradle/gradle-6.3/bin
ENV ANDROID_SDK_ROOT ${ANDROID_HOME}

ENV PATH ${ANDROID_HOME}/tools:${PATH}
ENV PATH ${ANDROID_HOME}/tools/bin:${PATH}
ENV PATH ${ANDROID_HOME}/platform-tools:${PATH}
ENV PATH ${ANDROID_SDK_ROOT}:${GRADLE_HOME}:${PATH}

# Don't know why but the sdk root has to be precised. Look into it ? 
RUN yes | sdkmanager --sdk_root="/usr/lib/Android" --licenses
RUN sdkmanager --sdk_root="/usr/lib/Android" --install  "build-tools;29.0.3" "platform-tools"

RUN rm tools.zip
RUN rm gradle.zip

WORKDIR /usr/src/mirage
VOLUME /usr/src/mirage

CMD ["bash"]
