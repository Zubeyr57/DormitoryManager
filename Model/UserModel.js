import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

  

const db = SQLite.openDatabase('new4db.db')


const handleLogin = (username,password,navigation) => {
    console.log('Username:', username);
    console.log('Password:', password);

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (tx, results) => {
          console.log('Query executed');
          if (results.rows.length > 0) {
            Alert.alert('Başarılı', 'Giriş yapıldı', [
              {
                text: 'OK',
                onPress: () =>  navigation.navigate('Ana ekran',{ username })  ,
              },
            ]);
          } else {
            Alert.alert('Hata', 'Kullanıcı adı veya şifre hatalı');
          }
        },
        (tx, error) => {
          Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
        }
      );
    });
  };

  const handleRegister = (username,password) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert('Başarılı', 'Kullanıcı kaydedildi');
          } else {
            Alert.alert('Hata', 'Kullanıcı kaydedilirken bir hata oluştu');
          }
        },
        (tx, error) => {
          Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
        }
      );
    });
  };

  const initializeDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);',
          [],
          () => { console.log('Table created successfully'); },
          (tx, error) => { console.log('Table creation error:', error); }
        );
      });
  }

  const handleWorker = (name,surname,idNumber,phone,position,permission,navigation) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO workers (name, surname, idNumber, phone, position, permission) VALUES (?, ?, ?, ?, ?, ?)',
            [name, surname, idNumber, phone, position, parseInt(permission)],
            (_, result) => {
                if (result.rowsAffected > 0) {
                    Alert.alert('Başarılı', 'İşçi kaydedildi', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                    ]);
                } else {
                    Alert.alert('Hata', 'İşçi kaydedilirken bir hata oluştu');
                }
            },
            (_, error) => {
                Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
            }
        );
    });
};



export default {
    handleLogin,
    handleRegister,
    initializeDatabase,
    handleWorker,
};