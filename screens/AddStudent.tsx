

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
      const res  = await axios.post('http://localhost:8080/test/add.php', data);

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
