# ReactNativeListComparison

## prerequisite

### install flashlight

To enable `flashlight` dash in Flipper. `flashlight` is only for Android devices. 

```bash
$ curl https://get.flashlight.dev/ | bash
```

## How to start

```bash
$ yarn install

# install iOS deps
$ cd ios & pod install
$ cd ..

$ npx react-native run-ios 
# $ npx react-native run-ios --simulator="iPhone 13 Pro"

$ npx react-native run-android
```

## setup flipper

- install `rn-perf-monitor`