Running development on Android:

```bash
nix-shell -p web-ext -p android-tools
```

```bash
web-ext run -t firefox-android --adb-device "$ADB_DEVICE" --firefox-apk org.mozilla.firefox
```

`about:debugging` -> USB devices
