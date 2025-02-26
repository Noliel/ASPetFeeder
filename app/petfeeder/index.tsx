import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useNavigation } from "expo-router";

interface Schedule {
  time: string;
  weight: string;
  isOn: boolean;
}

export default function PetFeederScreen() {
  const { petName } = useLocalSearchParams<{ petName: string }>();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [time, setTime] = useState<Date>(new Date());
  const [weight, setWeight] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const navigation = useNavigation();

  // DISABLE GESTURES
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, 
      gestureEnabled: false, 
    });

    // DISABLE BACK 
    const handleBackPress = () => true; 
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [navigation]);

  const addSchedule = () => {
    if (weight.trim() !== "") {
      const newSchedule: Schedule = { time: time.toLocaleTimeString(), weight, isOn: true };
      setSchedules([...schedules, newSchedule]);
      setWeight("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{petName}'s Feeding Schedule</Text>
      <ScrollView style={styles.scrollContainer}>
        {schedules.length === 0 ? (
          <Text style={styles.noScheduleText}>No schedules yet. Add one below.</Text>
        ) : (
          schedules.map((schedule, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text>Time: {schedule.time}</Text>
              <Text>Weight: {schedule.weight}g</Text>
              <TouchableOpacity>
                <Text style={styles.toggleText}>{schedule.isOn ? "ON" : "OFF"}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <TextInput
        style={styles.input}
        placeholder="Food weight (g)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowTimePicker(true)}>
        <Text>Select Time: {time.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addSchedule}>
        <Text style={styles.buttonText}>Add Feeding Time</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    width: "100%",
    marginBottom: 20,
  },
  noScheduleText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginVertical: 20,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  toggleText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
