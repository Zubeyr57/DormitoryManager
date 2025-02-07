import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const db = SQLite.openDatabase('new4db.db');

const StudentReg = ({ route }) => {
    const { roomNum, bedNum } = route.params;
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [section, setSection] = useState('');
    const [gender, setGender] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [roomNumber, setRoomNumber] = useState(roomNum.toString());
    const [bedNumber, setBedNumber] = useState(bedNum.toString());
    const navigation = useNavigation();

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS student (name TEXT, idNumber INTEGER PRIMARY KEY, phone TEXT, birthdate TEXT, section TEXT, roomNum TEXT, bedNum TEXT, gender TEXT);',
                [],
                () => { console.log('Students table created successfully'); },
                (tx, error) => { console.log('Table creation error:', error); }
            );
        });
    }, []);

    const handleRegister = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM student WHERE roomNum = ? AND bedNum = ?',
                [roomNumber, bedNumber],
                (_, { rows: roomBedRows }) => {
                    if (roomBedRows.length > 0) {
                        Alert.alert('Hata', 'Bu oda ve yatak numarası zaten kayıtlı');
                    } else if (parseInt(roomNumber) > 30 || parseInt(bedNumber) > 3) {
                        Alert.alert('Hata', 'Böyle bir oda veya yatak bulunmamaktadır')
                    } else {
                        tx.executeSql(
                            'SELECT * FROM student WHERE idNumber = ?',
                            [idNumber],
                            (_, { rows: idNumberRows }) => {
                                if (idNumberRows.length > 0) {
                                    Alert.alert('Hata', 'Bu kimlik numarası zaten kayıtlı');
                                } else {
                                    tx.executeSql(
                                        'INSERT INTO student (name, idNumber, phone, birthdate, section, roomNum, bedNum, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                        [name, idNumber, phone, birthDate, section, roomNumber, bedNumber, gender],
                                        (_, result) => {
                                            if (result.rowsAffected > 0) {
                                                Alert.alert('Başarılı', 'Öğrenci kaydedildi', [
                                                    { text: 'OK', onPress: () => navigation.goBack() },
                                                ]);
                                            } else {
                                                Alert.alert('Hata', 'Öğrenci kaydedilirken bir hata oluştu');
                                            }
                                        },
                                        (_, error) => {
                                            Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
                                        }
                                    );
                                }
                            },
                            (_, error) => {
                                Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
                            }
                        );
                    }
                },
                (_, error) => {
                    Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
                }
            );
        });
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(Platform.OS === 'ios');
        setBirthDate(currentDate.toLocaleDateString());
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Öğrenci Adı"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Kimlik Numarası"
                value={idNumber}
                onChangeText={text => setIdNumber(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Telefon Numarası"
                value={phone}
                onChangeText={text => setPhone(text)}
                style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <TextInput
                    placeholder="Doğum tarihi"
                    value={birthDate}
                    editable={false}
                    style={{ color: birthDate ? 'black' : 'gray' }}
                />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <TextInput
                placeholder="Bölümü"
                value={section}
                onChangeText={text => setSection(text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Cinsiyet"
                value={gender}
                onChangeText={text => setGender(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Oda numarası"
                value={roomNumber}
                onChangeText={text => setRoomNumber(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Yatak numarası"
                value={bedNumber}
                onChangeText={text => setBedNumber(text)}
                style={styles.input}
            />
            
            <Button title="Kaydet" onPress={handleRegister} />
        </View>
    );
};

/*<TouchableOpacity onPress={pickImage}>
                <View style={styles.imagePicker}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Button title="Resim Seç" onPress={pickImage} />
                    )}
                </View>
            </TouchableOpacity> */   //resim için kullanılan kısım

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    imagePicker: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 200,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default StudentReg;
