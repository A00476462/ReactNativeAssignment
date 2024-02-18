// Screen2.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image,Alert } from 'react-native';
import { Button, TextInput, List } from 'react-native-paper'; 
import { API_KEY } from '../utils/WeatherAPIKey';
import * as SQLite from 'expo-sqlite';

export default function Screen2({navigation}) {    
  const [cityName, setCityName] = useState(''); // store city name
  const [cityData, setCityData] = useState(null); // store city data
  const [weatherData, setWeatherData] = useState(null); // store weather data
  const [selectedCity, setSelectedCity] = useState(''); // store selected city 
  const [showList, setShowList] = useState(true); // control to show/hide list
  const textInputRef = useRef(null);
  const db = SQLite.openDatabase('city_database.db'); //open DB
  //console.log(db);

  //async可以保证如果API返回数据为空的话，也能继续执行，不会报错
  const handleSearch = async () => {
    if (cityName.length <= 3) {
      // 当 cityName 字符少于等于 3 个时，不执行 fetch 请求
      return;
    }

    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`);
      const data = await response.json();
      setCityData(data.results);
      //console.log('renturn 10 cityData: ',cityData);
    } catch (error) {
      //console.error('Error fetching city data:', error);
    }
  };

  const handleInputChange = (text) => {
    setCityName(text);
    if (text === '') {
      // if input content is empty, then hide list
      setShowList(false);
    } else {
      setShowList(true); // if input content is not empty, then hide list
      handleSearch(); 
    }
    // clean selected city info
    setWeatherData(null);
  };

  const handleWeatherFetch = (latitude, longitude) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`)
      .then(response => response.json())
      .then(data => {
        const weatherDataWithLocation = { ...data, latitude, longitude };
        setWeatherData(weatherDataWithLocation);
        //console.log('show weatherData:',weatherData); 
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };
  
  const handleAddToDatabase = () => {
    // check how many rows in DB
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT COUNT(*) AS count FROM Cities;',
          [],
          (_, { rows }) => {
            const count = rows._array[0].count;
            if (count >= 4) {
              // If there are more than 4 pieces of data, a prompt box will be displayed.
              Alert.alert('Cannot add more than 4 pieces of data!!!');
            } else {
              // If there are no more than 4 items, you can continue to add data
              // Check if data for the same city already exists in the database
              tx.executeSql(
                'SELECT * FROM Cities WHERE key = ?',
                [weatherData.id],
                (_, { rows }) => {
                  if (rows.length > 0) {
                    // If the same city data already exists, display a prompt box
                    Alert.alert('You have added the city!!!');
                  } else {
                    // If the same city data does not exist, perform the insertion operation
                    tx.executeSql(
                      'INSERT INTO Cities (key, name, latitude, longitude, temperature, weatherCondition) VALUES (?, ?, ?, ?, ?, ?)',
                      [weatherData.id, weatherData.name, weatherData.latitude, weatherData.longitude, weatherData.main.temp, weatherData.weather[0].main],
                      () => {
                        // If the data is successfully saved, a success message is displayed
                        Alert.alert('Weather data saved successfully');                      
                        console.log('Weather data saved successfully')},
                      (_, error) => console.error('Error saving weather data:', error)
                    );
                  }
                },
                (_, error) => console.error('Error checking existing data:', error)
              );
            }
          },
          (_, error) => console.error('Error counting data:', error)
        );
      },
      null,
      null
    );
  };

  // handle selected city
  const handleSelectCity = (item) => {
    setSelectedCity(item);
    setShowList(false); // hide list after selecting city in the list
    //console.log('Selected city coordinates:', item.name, item.latitude, item.longitude);
    handleWeatherFetch(item.latitude, item.longitude);
    //console.log('WeatherFetch:', item.latitude, item.longitude);
  };

  // Render list items: display all the data in the list, display 10 items
  const renderItem = ({ item }) => (
    <List.Item
      title={`${item.name}, ${item.admin1}, ${item.country}`}
      onPress={() => handleSelectCity(item)} 
    />
  );

  return (
    <View style= {styles.container} >      
      {/* Enter city name: input box component */}
      <View style={styles.inputContainer}>
        <TextInput
          ref={textInputRef}
          label="Enter city name"
          value={cityName}
          onChangeText={handleInputChange}
          style={styles.input}
          clearButtonMode='while-editing' //Show clear button only when user is editing text
        />
      </View>

      {/* Use flatlist to display all cities */}
      {showList && cityData &&(
        <FlatList
          data={cityData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={{ width: '100%' }} //Set the List width to 100%, otherwise it will not fit the screen
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            backgroundColor: 'lavender', // Set a light purple background color
            padding: 10,
            marginVertical: 1,
            position: 'absolute',
            top: 60,
            width: '100%',
           }} 
        />
      )}

      {/* Section showing weather data */}
      {weatherData && (
        <View style={styles.weatherDataContainer}>
          <Image
            source={{ uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
            style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 10 }}
          />
          <Text style={styles.cityText}>{weatherData.name}</Text>
          <Text style={styles.weatherText}>{weatherData.main.temp}°C</Text>
          <Text style={styles.bodyweatherText}>{weatherData.weather[0].main}</Text>          
          <Text style={styles.bodyweatherText}>{weatherData.wind.speed}m/s</Text>
           {/* Add additional weather data here  */}
        </View>
      )}

      {/* Add a button of "Add" */}
      {weatherData && (
        <View style={[styles.addButtonContainer, { marginTop: 20 }]}>
          <Button mode="contained" onPress={handleAddToDatabase}>
            Add
          </Button>
        </View>
      )}

      {/* Bottom navigation button: left button */}
      <View style={styles.buttonContainer}>
        <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Screen1')}
        >
            Current Location
        </Button>
      </View>

      {/* Bottom navigation button: right button */}
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "white",
    },
    weatherDataContainer: {
      alignItems: 'center',
      marginTop: -260,
    },
    cityText: {
      fontSize: 48,
      color: '#5B4A90',
      fontWeight: 'bold',
      marginBottom: 5,
    },
    weatherText: {
      fontSize: 48,
      color: '#5B4A90',
      marginBottom: 5,      
    },
    bodyweatherText: {
      fontSize: 24,
      color: '#5B4A90',
      marginBottom: 5,      
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
    },
    rightButtonContainer: {
      left: 'auto', // cancle left style
      right: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 60,
      width: '100%',
      position: 'absolute', 
      top: 0, 
    },
    input: {
      marginBottom: 20,
      width: '100%',
      position: 'absolute',
      top: 0,
    },
    searchbuttonContainer: {
      position: 'absolute',
      top: 8,
      right: 15,
    },
    listItem: {
      backgroundColor: 'lavender',
      padding: 10,
      marginVertical: 1,
      width: '120%',             
    },
  });

  