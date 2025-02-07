import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('new4db.db');

const UpdatePassword = ({ route }) => {
    const { username } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const handleUpdatePassword = () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Hata', 'Şifreler eşleşmiyor.');
            return;
        }

        db.transaction(tx => {
            tx.executeSql(
                'UPDATE users SET password = ? WHERE username = ?',
                [newPassword, username],
                (_, result) => {
                    if (result.rowsAffected > 0) {
                        Alert.alert('Başarılı', 'Şifre güncellendi.', [
                            { text: 'OK', onPress: () => navigation.goBack() },
                        ]);
                    } else {
                        Alert.alert('Hata', 'Şifre güncellenemedi.');
                    }
                },
                (_, error) => {
                    Alert.alert('Hata', `Veritabanı hatası: ${error.message}`);
                }
            );
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Yeni Şifre"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
            />
            <TextInput
                placeholder="Şifreyi Onayla"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleUpdatePassword}>
                Şifreyi Güncelle
            </Button>
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
});

export default UpdatePassword;
