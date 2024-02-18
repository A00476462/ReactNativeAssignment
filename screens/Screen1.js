// Screen1.js
import React, {useState, useEffect} from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'; 
import * as Location from 'expo-location';
import { API_KEY } from '../utils/WeatherAPIKey';
import Weather from '../components/Weather';

//Navigation button
export default function Screen1({navigation}) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false); 

  //create, and get Weather info
  const [weatherData, setWeatherData] = useState({
    temperature: 0,
    locationName: "",
    weatherCondition: "",
    conditionIcon: "",
  });

  // Request location permission when the component is loaded,
  // and obtain the current location information after the permission is granted.
  useEffect(() => {
    requestLocationPermission();   
  }, []);
  
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission: ', error);
    }
  };

  //get location: get current location  
  const getLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      fetchWeather(latitude,longitude)
    } catch (error) {
      console.error('Error getting location: ', error);
    }
  };

  //get weather info of current location
  const fetchWeather = (latitude = 41, longitude = 123) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log(json);
        //console.log(json.weather[0].icon); // 在此处添加console.log
        setWeatherData({
          temperature: json.main.temp,
          locationName: json.name,
          weatherCondition: json.weather[0].main,
          conditionIcon: json.weather[0].icon,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };


  return (
    <View style= {styles.container} >
      <Weather weatherData={weatherData} />

      <View style={styles.buttonContainer}>
        <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Screen2')}
        >
            Search Location
        </Button>
      </View>

      <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
        <Button 
            mode="contained"
            onPress={() => navigation.navigate('Screen3')}
        >
            Saved Weather
        </Button>
      </View>   
    </View>
  );
}

//set button and container style
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: "white",
      alignItems: 'center',
      paddingTop: 40, // Add top padding to create space from top
      paddingHorizontal: 20, // Add horizontal padding for content spacing
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
    },
    rightButtonContainer: {
      left: 'auto', // cancle left style
      right: 20,
    }
  });