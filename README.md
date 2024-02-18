# ReactNativeAssignment
This is used for submitting ReactNativeAssignment
## About This App (Weather App)

The Weather App is a React Native application that dynamically fetches and displays weather data based on the device's current location. It showcases how to integrate the `expo-location` library for geolocation services and the fetch API for retrieving weather information from the OpenWeatherMap API.

This App has 3 screens:
First Screen: It requires permission to access the device's location services. Users will be prompted to grant permission when the app is first launched. The app handles scenarios where permission is not granted by displaying an appropriate message.

Second Screen: Click the button of "Current Location", which is on the left bottom of first screen, it will go to next page. Input city name in textInput and select one of the cities showed in the list, you'll get city name, city temperature, city weather condition and wind speed. And the button of "Add" shows after searching. Click Add button to add weather info to SQLite, and there is an alter information after saving data into DB
	If you already have added 4 pieces of data to DB, it'll show alter information that you cannot add more than 4 pieces of data.
	If you already have added the same city before, it'll show alter information that you cannot add the same city information twice.
	
Third Screen: Click the button of "Saved weather", which is on the left bottom of first screen, it will go to next page. It will shows weather information on third screen, and you can delete weather data when you click delete icon.

## Running the app

To run Weather App, follow these steps:

1. Navigate to the project directory.
1. Run `npm install` to install the necessary dependencies.
1. Start the app with `npx expo start` or `npm start`

## Permissions

This app requires permission to access the device's location services. Users will be prompted to grant permission when the app is first launched. The app handles scenarios where permission is not granted by displaying an appropriate message.

## API Key
To fetch weather data, I added an API key from OpenWeatherMap.

## SQLite
CREATE TABLE IF NOT EXISTS Cities (
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    temperature REAL,
    weatherCondition TEXT
);![image](https://github.com/A00476462/ReactNativeAssignment/assets/38833830/e914117d-9d65-46a9-a899-6b499f22c119)
