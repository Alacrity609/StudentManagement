
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const AddStudent = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(''); // age is stored as a string
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async () => {
    // alert("Hello")
    setLoading(true);
    console.log(name, age, grade);



    try{
      const data = {
        name: name,
        age: parseInt(age),
        grade: parseFloat(grade).toFixed(2)
      }
      const res  = await axios.post('http://localhost:8080/test/delete.php', data);

      if(res.data){
        alert(res.data)
      }
      console.log(res);
    } 

    catch(e){
      console.log(e)

    }
    finally {
      setLoading(false)
    }


    // if (!name || !age || !grade) {
    //   Alert.alert('Validation Error', 'All fields are required!');
    //   return;
    // }

    // const parsedAge = parseInt(age, 10); // Ensure `age` is converted to a number
    // if (isNaN(parsedAge) || parsedAge <= 0) {
    //   Alert.alert('Validation Error', 'Please enter a valid age.');
    //   return;
    // }

    // setLoading(true);

    // try {
    //   const res = await axios.post('http://localhost:8080/test/add.php', {
    //     name,
    //     age: parsedAge, // Use the parsed number here
    //     grade,
    //   });

    //   console.log(res)
    //   // Alert.alert('Success', 'Student added successfully!');
    //   // navigation.goBack();
    // } catch (error) {
    //   console.error(error);
    //   Alert.alert('Error', 'Failed to add student. Please try again.');
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        style={styles.input}
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Age"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setAge}
        value={age}
      />
      <TextInput
        placeholder="Grade"
        style={styles.input}
        onChangeText={setGrade}
        value={grade}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Add Student" onPress={() => handleSubmit()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default AddStudent;
