import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet,Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import UserModel from '../../Model/UserModel';

const db = SQLite.openDatabase('new4db.db');

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    UserModel.initializeDatabase();
  }, []);

  const handleLogin = () => {
    UserModel.handleLogin(username,password,navigation);
  };

  const handleRegister = () => {
    UserModel.handleRegister(username,password);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10, width: '80%' }}
      />
      <TextInput
        keyboardType="numeric"
        placeholder="Şifre"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 10, width: '80%' }}
      />
      <View style = {styles.container}>
      <Button title="Giriş Yap" onPress={handleLogin} />
      <Button title="Kayıt Ol" onPress={handleRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width:250,
    justifyContent: 'space-between',
    padding:5,    
  },
});

export default Login;
