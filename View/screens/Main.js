import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl, TextInput, Image } from 'react-native';
import { FAB, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('new4db.db');

const Main = () => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchstudents();
    }, []);

    const fetchstudents = () => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM student;',
                [],
                (tx, results) => {
                    let studentList = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        studentList.push(results.rows.item(i));
                    }
                    setStudents(studentList);
                },
                (tx, error) => {
                    console.log('Error fetching students:', error);
                }
            );
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchstudents();
        setRefreshing(false);
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.idNumber.toString().includes(searchQuery) ||
        student.section.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderStudents = ({ item }) => (
        <List.Item
            title={`${item.name}`}
            description={`Kimlik No: ${item.idNumber}\nBölümü: ${item.section}`}
            left={props => 
                item.image ? (
                    <Image source={{ uri: item.image }} style={styles.profileImage} />
                ) : (
                    <List.Icon {...props} icon="account" />
                )
            }
            style={styles.listItem}
            onPress={() => navigation.navigate('StudentSet', { item })}
        />
    );

    const navigateToStudentReg = (roomNum, bedNum) => {
        navigation.navigate('StudentReg', { roomNum, bedNum });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search ..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
            />
            <FlatList
                data={filteredStudents}
                renderItem={renderStudents}
                keyExtractor={item => item.idNumber.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigateToStudentReg('','')}
            />
            
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
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    listItem: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    list: {
        flexGrow: 1,
        marginTop: 16,
        alignItems: 'stretch',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#0066ff',
    },
    
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});

export default Main;
