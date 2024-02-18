import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const Weather = ({ weatherData }) => {
  return (
    <View style={styles.weatherContainer}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: `http://openweathermap.org/img/wn/${weatherData.conditionIcon}@2x.png`,
          }}
          style={{ width: 120, height: 120,  }}
        />
        <Text style={styles.tempText}>{weatherData.locationName}</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>{weatherData.temperature}˚</Text>
        <Text style={styles.subtitle}>{weatherData.weatherCondition}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
    marginTop: 90,
    marginBottom: 70,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tempText: {
    fontSize: 48,
    color: "#5B4A90",//"#63519F",
    marginTop: 5,
    fontWeight: 'bold'
  },
  bodyContainer: {
    flex: 2,
    alignItems: "center",//"flex-start",
    justifyContent: "center",//"flex-end",
    //paddingLeft: 75,
    marginBottom: 380,
  },
  title: {
    fontSize: 48,
    color: "#5B4A90",
  },
  subtitle: {
    fontSize: 24,
    color: "#5B4A90",
  },
});

export default Weather;
