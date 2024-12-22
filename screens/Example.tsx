import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";

const Example = () => {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    grade: "",
    contact: "",
    address: "",
    image: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all students from the backend
  const handleGetStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/test/students.php");
      if (res.data) {
        setStudents(res.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Add a new student to the database with image handling
  const handleAddStudent = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/test/add.php",
        newStudent
      );
      console.log("Student added:", res.data);
      setModalVisible(false);
      setNewStudent({
        name: "",
        age: "",
        grade: "",
        contact: "",
        address: "",
        image: "",
      });
      setSuccessMessage("Student successfully added!");
      handleGetStudents();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    handleGetStudents();
  }, []);

  // Render each student item
  const renderStudentItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Image
        source={{
          uri: item.image ? `data:image/jpeg;base64,${item.image}` : "https://via.placeholder.com/150",
        }}
        style={styles.studentImage}
      />
      <View style={styles.studentDetailsContainer}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>
          Age: {item.age}, Grade: {item.grade}
        </Text>
        <Text style={styles.studentDetails}>Contact: {item.contact}</Text>
        <Text style={styles.studentDetails}>Address: {item.address}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Student" onPress={() => setModalVisible(true)} />

      {students.length > 0 ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStudentItem}
        />
      ) : (
        <Text>No students found!</Text>
      )}

      {/* Success Message */}
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}

      {/* Add Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Student</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newStudent.name}
              onChangeText={(text) =>
                setNewStudent((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={newStudent.age}
              keyboardType="numeric"
              onChangeText={(text) =>
                setNewStudent((prev) => ({ ...prev, age: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Grade"
              value={newStudent.grade}
              onChangeText={(text) =>
                setNewStudent((prev) => ({ ...prev, grade: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Contact"
              value={newStudent.contact}
              onChangeText={(text) =>
                setNewStudent((prev) => ({ ...prev, contact: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={newStudent.address}
              onChangeText={(text) =>
                setNewStudent((prev) => ({ ...prev, address: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL (base64 string)"
              value={newStudent.image}
              onChangeText={(text) =>
                setNewStudent((prev) => ({ ...prev, image: text }))
              }
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleAddStudent} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  studentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  studentDetailsContainer: { flex: 1 },
  studentName: { fontSize: 18, fontWeight: "bold" },
  studentDetails: { fontSize: 14, color: "#555" },
  successMessage: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  input: { width: "100%", borderWidth: 1, padding: 10, marginVertical: 10 },
});

export default Example;
