import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Confirm() {
  const { petType, petName, petWeight } = useLocalSearchParams(); // Get parameters from Pet Name page
  const router = useRouter();

  const handleConfirm = () => {
    router.push("/petfeeder"); // Navigate to the Pet Feeder page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Pet's Details</Text>

      {/* Ensure petType is shown correctly */}
      <Text style={styles.info}>Pet Type: {petType ? petType : "Not Provided"}</Text>
      <Text style={styles.info}>Pet Name: {petName ? petName : "Not Provided"}</Text>
      <Text style={styles.info}>Pet Weight: {petWeight ? petWeight : "Not Provided"} kg</Text>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  info: { fontSize: 18, marginBottom: 10, color: "#333" },
  confirmButton: { padding: 15, backgroundColor: "#28a745", borderRadius: 10, width: 200, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
