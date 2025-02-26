import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Switch, Button, TouchableOpacity, TextInput, ScrollView, BackHandler } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";

const PetFeeder = () => {
  const params = useLocalSearchParams();
  const petType = params?.pet || "Unknown";
  const petName = params?.petName || "Unknown";

  const [schedules, setSchedules] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [weight, setWeight] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });

    const handleBackPress = () => true;
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  useEffect(() => {
    const loadSchedules = async () => {
      const savedSchedules = await AsyncStorage.getItem("schedules");
      if (savedSchedules) setSchedules(JSON.parse(savedSchedules));
    };
    loadSchedules();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  const addFeedingTime = () => {
    if (!weight.trim()) {
      alert("Please enter the weight.");
      return;
    }
    setShowPicker(true);
  };

  const onTimeSelected = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime instanceof Date && !isNaN(selectedTime)) { 
      setSchedules([...schedules, { 
        id: Date.now().toString(), 
        time: selectedTime.toISOString(), 
        enabled: true, 
        weight: `${weight}g` 
      }]);
      setWeight("");
    }
  };

  const toggleSchedule = (id) => {
    setSchedules(schedules.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(item => item.id !== id));
  };

  const formatTime = (time) => {
    if (!(time instanceof Date)) {
      time = new Date(time);
    }
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Automatic Scheduled Pet Feeder</Text>
      <Text style={{ fontSize: 18, marginBottom: 5 }}>Pet Name: {petName}</Text>
      <Text style={{ fontSize: 18, marginBottom: 15 }}>Pet Type: {petType}</Text>
      <ScrollView style={{ marginBottom: 20 }}>
        {schedules.length === 0 ? (
          <Text style={{ fontSize: 16, textAlign: "center", marginVertical: 10 }}>No schedules yet. Add one below.</Text>
        ) : (
          schedules.map((item) => (
            <View key={item.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 10 }}>
              <Text style={{ flex: 1, fontSize: 18 }}>{formatTime(item.time)} - {item.weight}</Text>
              <Switch value={item.enabled} onValueChange={() => toggleSchedule(item.id)} />
              <TouchableOpacity onPress={() => deleteSchedule(item.id)} style={{ marginLeft: 10 }}>
                <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <TextInput
        placeholder="Enter weight (g)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 }}
      />
      <Button title="Add Feeding Time" onPress={addFeedingTime} />
      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
          display="spinner"
          onChange={onTimeSelected}
        />
      )}
    </View>
  );
};

export default PetFeeder;
