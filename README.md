# Foodizzy

## Overview

Foodizzy is a tool for keeping track of countless shopping lists and reducing needless food waste. Integrating seamlessly into everyday life, Foodizzy will become your best friend and indispensable assistant on the way to a better, healthier, and well-organized life.
Your shopping lists are automatically updated if you run out of the most popular items in the storage or if you want to do a new recipe and lack some ingredients. You can also add a family member to make a meal plan for the following week and make sure that nobody will buy the same product twice. Hands are full, and you want to add something to the list? Just Google Assistant or Alexa what you want to do, and they will do it for you!

Check it out here:
https://foodizzy-app.web.app/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development

`npm run serve-dev` - run with firebase emulators
`npm run serve` - run with production data

### Runs the Firebase emulators

`npm run emulate` - run the emulators
`npm run emulate-export` - run the emulators and save any changes to the emulator data

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Seeds the `allProducts` collection
(make sure you have your Firebase Admin Service Account credentials in `src/utils/data.json`)
```
npm run emulator-sync:allProducts
```
