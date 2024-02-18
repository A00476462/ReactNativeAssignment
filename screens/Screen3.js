// Screen3.js
import React, { useState, useEffect }  from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button,List,IconButton } from 'react-native-paper';

import * as SQLite from 'expo-sqlite';


export default function Screen3({navigation}) {
  const [savedData, setSavedData] = useState([]);

  useEffect(() => {
    // create or open SQLite connection
    const db = SQLite.openDatabase('city_database.db');

    // Execute SQL queries to retrieve data
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Cities;',
        [],
        (_, { rows }) => {
          const data = rows._array; // Get the retrieved data array
          //console.log('Fetched data:', data);
          setSavedData(data); // Store data in component state
        },
        (_, error) => console.error('Error fetching saved data:', error)
      );
    });
  }, []); // Only executed once when the component is mounted

  const deleteItem = (key) => {
    const db = SQLite.openDatabase('city_database.db');
    db.transaction(
      (tx) => {
        tx.executeSql(
          'DELETE FROM Cities WHERE key = ?;',
          [key],
          () => {
            //console.log('Item deleted successfully');
            loadSavedData(); // Reload data after deletion
          },
          (_, error) => console.error('Error deleting item:', error)
        );
      },
      null,
      null
    );
  };
  
    // Reload data
    const loadSavedData = () => {
      const db = SQLite.openDatabase('city_database.db');
  
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Cities;',
          [],
          (_, { rows }) => {
            const data = rows._array;
            setSavedData(data);
          },
          (_, error) => console.error('Error fetching saved data:', error)
        );
      });
    };

  return (
    <View style= {styles.container} >
      {/* Display saved data */}
      <View style={{ flex: 1 }}>
        <List.Section>
          {savedData.map((item, index) => (
            <List.Item
              key={index}
              title={`${item.name}`}
              description={` ${item.temperature}˚C,  ${item.weatherCondition}`}
              titleStyle = {{fontSize: 24, fontWeight: 'bold', color: "#5B4A90"}}
              descriptionStyle = {{fontSize: 20, color: "#5B4A90"}}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} //Set the width of the list item to 100% so that it fills the parent container horizontally
              right={() => (
                <IconButton
                  icon="delete"
                  color="red"
                  onPress={() => deleteItem(item.key)}
                  style={{ marginRight: -10 }} //Increase the left margin to move the icon further to the right
                />
              )}
            />
          ))}
        </List.Section>
      </View>

      {/* lower left button */}
      <View style={styles.buttonContainer}>
        <Button 
            mode="contained"
            onPress={() => navigation.navigate('Screen1')}
        >
            Current Location
        </Button>
      </View>

      {/* lower right button */}
      <View style={[styles.buttonContainer, styles.rightButtonContainer]}>
        <Button 
            mode="contained"
            onPress={() => navigation.navigate('Screen2')}
        >
            Search Location
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
    buttonContainer: {
      position: 'absolute',
      bottom: 20,
      left: 20,
    },
    rightButtonContainer: {
      left: 'auto', // cancle left style
      right: 20,
    },
  });