import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Home from "./Home"; // Import the Home component

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "Manage Students":
        return <Home />; // Render the Home component
      case "Manage Teachers":
        return <Text>Manage Teachers Section</Text>;
      case "Manage Exams":
        return <Text>Manage Exams Section</Text>;
      case "Attendance":
        return <Text>Attendance Section</Text>;
      default:
        return <Text>Welcome to the Dashboard!</Text>;
    }
  };

  const sections = [
    { title: "Manage Students" },
    { title: "Manage Teachers" },
    { title: "Manage Exams" },
    { title: "Attendance" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <Text style={styles.sidebarHeader}>Student Information System</Text>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.title}
            style={[
              styles.sidebarItem,
              activeSection === section.title && styles.activeSidebarItem,
            ]}
            onPress={() => setActiveSection(section.title)}
          >
            <Text style={styles.sidebarItemText}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.contentHeader}>{activeSection}</Text>
        {renderSection()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: "25%",
    backgroundColor: "#1E88E5",
    padding: 10,
  },
  sidebarHeader: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  sidebarItem: {
    padding: 10,
    backgroundColor: "#42A5F5",
    marginVertical: 5,
    borderRadius: 5,
  },
  activeSidebarItem: {
    backgroundColor: "#1976D2",
  },
  sidebarItemText: { color: "#fff", fontSize: 16 },
  content: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  contentHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});

export default Dashboard;
