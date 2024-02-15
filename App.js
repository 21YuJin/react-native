import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = "2fb8227e918ba71e2e574869d4c331f4";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps:false}
    );
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(
      json.list.filter((weather) => {
      if(weather.dt_txt.includes("03:00:00")){
        return weather;
      }
      })
    );
  };
  useEffect(() => {
    getWeather();
  }, []); 
  return <View style={styles.container}>
    <View style={styles.city}>
      <Text style={styles.cityName}>{city}</Text>
    </View>
    <ScrollView 
      pagingEnabled 
      horizontal
      showsHorizontalScrollIndicator ={false}
      contentContainerStyle={styles.weather}>
      
    { days.length === 0 ? (
      <View style={styles.day}>
        <ActivityIndicator color="white" size="large" style={{marginTop: 10}} />
      </View>
    ) : ( 
      days.map((day, index) => 
      <View key={index} style={styles.day}>
        <View style={{
          flexDirection: "row", 
          alignItems:"center",
          width: "100%",
          justifyContent: "space-between",
        }}>
          <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
          <Fontisto name={icons[day.weather[0].main]} size={68} color="white"/>
        </View>
        <Text style={styles.description}>{day.weather[0].main}</Text>
        <Text style={styles.tinyText}>{day.weather[0].description}</Text>
      </View> )
    )}
    </ScrollView>
  </View>; 
}

const styles = StyleSheet.create({
  container: {
    flex : 1, 
    backgroundColor:"tomato",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName:{
      fontSize: 58,
      fontWeight: "500",
      color: 'white',
  },
  weather: {
    
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp:{
    marginTop: 50,
    fontWeight: "600",
    fontSize: 70,
    color: 'white',
  },
  description:{
    marginTop: -10,
    fontSize: 40,
    color: 'white',
  },
  tinyText:{
    fontSize: 20,
    color: 'white',
  }
})