import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen1 from './screens/Screen1';
import Screen2 from './screens/Screen2';
import Screen3 from './screens/Screen3';
import * as SQLite from 'expo-sqlite';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // create or open SQLite 
    const db = SQLite.openDatabase('city_database.db');
    //console.log(db);

    // create table:Cities
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Cities (key INTEGER PRIMARY KEY, name TEXT NOT NULL, latitude REAL, longitude REAL, temperature REAL, weatherCondition TEXT);',
        [],
        () => console.log('Table Cities created successfully'),
        (_, error) => console.error('Error creating table Cities:', error)
      );
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen1} options={{ title: 'Current Location' }} />
        <Stack.Screen name="Screen2" component={Screen2} options={{ title: 'Search Location' }} />
        <Stack.Screen name="Screen3" component={Screen3} options={{ title: 'Saved Weather' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


