import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';

const db = SQLite.openDatabase('new4db.db');

const StudentSet = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const [Name, setName] = useState('');
    const [Phone, setPhone] = useState('');
    const [BirthDate, setBirthDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [Section, setSection] = useState('');
    const [RoomNum, setRoomNum] = useState('');
    const [BedNum, setBedNum] = useState('');

    const handleUpdate = () => {
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE student SET Name=?, Phone=?, birthdate=?, section=?, roomNum=?, bedNum=? WHERE idNumber=?',
                [Name, Phone, BirthDate.toISOString().split('T')[0], Section, RoomNum, BedNum, item.idNumber],
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
        });
    };

    const handleDelete = () => {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM student WHERE idNumber=?',
                [item.idNumber],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        Alert.alert('Başarılı', 'Öğrenci bilgileri silindi', [
                            {
                                text: 'OK', onPress: () => {
                                    navigation.goBack();
                                }
                            },
                        ]);
                    } else {
                        Alert.alert('Hata', 'Öğrenci silinirken bir hata oluştu');
                    }
                },
                (_, error) => {
                    Alert.alert('Hata', `Öğrenci silinirken veritabanı hatası: ${error.message}`);
                }
            );
        });
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || BirthDate;
        setShowDatePicker(false);
        setBirthDate(currentDate);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Öğrenci Adı"
                value={Name}
                onChangeText={text => setName(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Telefon Numarası"
                value={Phone}
                onChangeText={text => setPhone(text)}
                style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
                <Text>{BirthDate.toISOString().split('T')[0]}</Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={BirthDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
            <TextInput
                placeholder="Bölümü"
                value={Section}
                onChangeText={text => setSection(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Oda numarası"
                value={RoomNum}
                onChangeText={text => setRoomNum(text)}
                style={styles.input}
            />
            <TextInput
                keyboardType="numeric"
                placeholder="Yatak numarası"
                value={BedNum}
                onChangeText={text => setBedNum(text)}
                style={styles.input}
            />
            <Button title="Güncelle" onPress={handleUpdate} />
            <Button title="Öğrenci Sil" onPress={handleDelete} />
        </View>
    );
};

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
    datePickerContainer: {
        width: '100%',
        marginVertical: 10,
        alignItems: 'center',
    },
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    permissionList: {
        marginTop: 20,
        width: '100%',
    },
});

export default StudentSet;
