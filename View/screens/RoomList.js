import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';


const db = SQLite.openDatabase('new4db.db');

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();


    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT roomNum, bedNum FROM student',
                [],
                (_, { rows }) => {
                    let occupiedRooms = [];
                    for (let i = 0; i < rows.length; i++) {
                        occupiedRooms.push(rows.item(i));
                    }
                    setRooms(generateRoomList(occupiedRooms));
                },
                (_, error) => {
                    console.log('Error fetching rooms:', error);
                }
            );
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchRooms();
        setRefreshing(false);
    };

    const generateRoomList = (occupiedRooms) => {
        let allRooms = [];
        for (let roomNum = 1; roomNum <= 30; roomNum++) {
            for (let bedNum = 1; bedNum <= 3; bedNum++) {
                let isOccupied = occupiedRooms.some(room => room.roomNum === roomNum.toString() && room.bedNum === bedNum.toString());
                allRooms.push({ roomNum, bedNum, status: isOccupied ? 'Dolu' : 'Boş' });
            }
        }
        return allRooms;
    };

    const handleRoomPress = (roomNum, bedNum) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM student WHERE roomNum = ? AND bedNum = ?',
                [roomNum.toString(), bedNum.toString()],
                (_, { rows }) => {
                    if (rows.length > 0) {
                        const student = rows.item(0);
                        Alert.alert(
                            'Öğrenci Bilgileri',
                            `Adı: ${student.name}\nKimlik Numarası: ${student.idNumber}\nTelefon: ${student.phone}\nDoğum Tarihi: ${student.birthdate}\nBölümü: ${student.section}\nOda Numarası: ${student.roomNum}\nYatak Numarası: ${student.bedNum}`
                        );
                    }
                },
                (_, error) => {
                    console.log('Error fetching student:', error);
                }
            );
        });
    };
    const navigateToStudentReg = (roomNum, bedNum) => {
        navigation.navigate('StudentReg', { roomNum, bedNum });
    };

    const renderRoom = ({ item }) => (
        <TouchableOpacity
            onPress={() => item.status === 'Dolu' ? handleRoomPress(item.roomNum, item.bedNum) : navigateToStudentReg(item.roomNum, item.bedNum)}
            style={[styles.roomContainer, item.status === 'Dolu' ? styles.occupied : styles.unoccupied]}
        >
            <Text style={styles.roomText}>Oda Numarası: {item.roomNum}</Text>
            <Text style={styles.roomText}>Yatak Numarası: {item.bedNum}</Text>
            <Text style={styles.roomText}>Durum: {item.status}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={rooms}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderRoom}
                numColumns={3} 
                columnWrapperStyle={styles.row} 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    roomContainer: {
        flex: 1,
        margin: 5,
        padding: 16,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomText: {
        fontSize: 16,
        textAlign: 'center',
    },
    occupied: {
        backgroundColor: '#ffcccc',
    },
    unoccupied: {
        backgroundColor: '#ccffcc',
    },
    row: {
        flex: 1,
        justifyContent: "space-between"
    }
});

export default RoomList;
