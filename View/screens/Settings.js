import React from 'react';
import { View } from 'react-native';
import { Avatar, Title, Subheading, Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';

const Settings = ({ username }) => {
    const navigation = useNavigation();

    return (
        <View style={{ alignItems: "center", marginTop: 90 }}>
            <Avatar.Text label={username.substring(0, 2).toUpperCase()} />
            <Title>{username}</Title>
            <Subheading>name@gmail.com</Subheading>
            <Button mode="contained" onPress={() => navigation.navigate('Login') }>Çıkış yap</Button>
            <Button onPress={() => navigation.navigate('UpdatePassword', { username })}>Profil ayarları</Button>
        </View>
    );
};

export default Settings;
