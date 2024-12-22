import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // For registration
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [mode, setMode] = useState<"login" | "register">("login"); // Toggle between login and register mode

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!username || !password || (mode === "register" && !email)) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous error

    const data = {
      username,
      password,
      email: mode === "register" ? email : undefined,
    };

    const url =
      mode === "register"
        ? "http://localhost:8080/test/register.php"
        : "http://localhost:8080/test/login.php";
    try {
      const res = await axios.post(url, data);
      if (res.data.status === "success") {
        Alert.alert(
          `${mode === "register" ? "Registration" : "Login"} Successful`,
          `Welcome, ${res.data.admin.username}`
        );
        navigation.navigate("dashboard"); // Navigate to Home on success
      } else {
        setError(
          res.data.message ||
            `${mode === "register" ? "Registration" : "Login"} failed. Please try again.`
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Error during request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {mode === "register" ? "Admin Registration" : "Admin Login"}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {mode === "register" && (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Submitting..."
              : mode === "register"
              ? "Register"
              : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === "register" ? "login" : "register")}>
          <Text style={styles.switchText}>
            {mode === "register" ? "Switch to Login" : "Switch to Registration"}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#00f" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E293B", // Gradient-like dark blue
  },
  card: {
    width: "85%",
    backgroundColor: "#2D3748", // Darker grayish color for the card
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E2E8F0", // Light gray for text
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1A202C", // Darker input background
    borderRadius: 5,
    paddingLeft: 10,
    color: "#E2E8F0", // Light text color
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#38BDF8", // Bright cyan
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#94A3B8", // Muted button color
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    color: "#38BDF8",
    fontSize: 14,
    marginTop: 10,
  },
  error: {
    color: "#F56565", // Light red for error messages
    marginBottom: 10,
  },
});

export default Login;
