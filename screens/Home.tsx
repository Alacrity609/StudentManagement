import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

const Home = () => {
  const [students, setStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    grade: "",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState({
    name: "",
    age: "",
    grade: "",
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

  // Add a new student to the database
  const handleAddStudent = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/test/add.php",
        newStudent
      );
      console.log("Student added:", res.data);
      setModalVisible(false);
      setNewStudent({ name: "", age: "", grade: "" });
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

  // Delete a student from the database
  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/test/delete.php?id=${id}`);
      setSuccessMessage("Student successfully deleted!");
      handleGetStudents();
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Show student details in a modal
  const handleShowDetails = (student) => {
    setSelectedStudent(student);
    setDetailsModalVisible(true);
  };

  // Show edit modal with student data
  const handleEditStudent = (student) => {
    setEditedStudent(student);
    setEditModalVisible(true);
  };

  // Update student in the backend
  const handleUpdateStudent = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/test/update.php",
        editedStudent
      );
      console.log("Student updated:", res.data);
      setEditModalVisible(false);
      setEditedStudent({ name: "", age: "", grade: "" });
      setSuccessMessage("Student successfully updated!");
      handleGetStudents();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    handleGetStudents();
  }, []);

  // Render each student item
  const renderStudentItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.cellId]}>{item.id}</Text>
      <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>
      <Text style={[styles.tableCell, styles.cellAge]}>{item.age}</Text>
      <Text style={[styles.tableCell, styles.cellGrade]}>{item.grade}</Text>
      <View style={[styles.tableCell, styles.cellActions]}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleShowDetails(item)}
        >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditStudent(item)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteStudent(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Add Student" onPress={() => setModalVisible(true)} />

      {students.length > 0 ? (
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.cellId]}>#</Text>
            <Text style={[styles.tableCell, styles.cellName]}>Name</Text>
            <Text style={[styles.tableCell, styles.cellAge]}>Age</Text>
            <Text style={[styles.tableCell, styles.cellGrade]}>Grade</Text>
            <Text style={[styles.tableCell, styles.cellActions]}>Operations</Text>
          </View>
          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStudentItem}
          />
        </View>
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
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleAddStudent} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Student Details</Text>
            {selectedStudent && (
              <View>
                <Text>ID: {selectedStudent.id}</Text>
                <Text>Name: {selectedStudent.name}</Text>
                <Text>Age: {selectedStudent.age}</Text>
                <Text>Grade: {selectedStudent.grade}</Text>
              </View>
            )}
            <Button
              title="Close"
              onPress={() => setDetailsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Student</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedStudent.name}
              onChangeText={(text) =>
                setEditedStudent((prev) => ({ ...prev, name: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={editedStudent.age}
              keyboardType="numeric"
              onChangeText={(text) =>
                setEditedStudent((prev) => ({ ...prev, age: text }))
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Grade"
              value={editedStudent.grade}
              onChangeText={(text) =>
                setEditedStudent((prev) => ({ ...prev, grade: text }))
              }
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
              <Button title="Save" onPress={handleUpdateStudent} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 10,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tableCell: { flex: 1, textAlign: "center", fontSize: 16 },
  cellId: { flex: 0.5 },
  cellName: { flex: 2 },
  cellAge: { flex: 1 },
  cellGrade: { flex: 1 },
  cellActions: { flex: 2, flexDirection: "row", justifyContent: "space-around" },
  detailsButton: {
    backgroundColor: "#555",
    padding: 5,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: "#FFA500",
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    padding: 5,
    borderRadius: 5,
  },
  buttonText: { color: "#fff", fontSize: 14 },
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

export default Home;
