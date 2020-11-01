import React, {useEffect, useState} from 'react';
import { Text, TextInput, StyleSheet, View, Keyboard, Alert, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';

// components
import CustomHeader from '~/components/CustomHeader';
import Geolocation from "react-native-geolocation-service";





function Settings({navigation}) {
    const [userName, setUserName] = useState('');


    const saveName = async () => {
        try {
            await AsyncStorage.setItem('username', userName);
            Keyboard.dismiss();
            Alert.alert('Sucesso', 'Nome de usuário salvo com sucesso!');
        } catch (e) {
            Alert.alert(e);
        }
    };

    const saveLocation = async () => {
        const [hasLocationPermission, setHasLocationPermission] = useState(false);
        const [userPosition, setUserPosition] = useState(false);

        async function verifyLocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('permissão concedida');
                    setHasLocationPermission(true);
                } else {
                    console.error('permissão negada');
                    setHasLocationPermission(false);
                }
            } catch (err) {
                console.warn(err);
            }
        }

        useEffect(() => {
            verifyLocationPermission();

            if (hasLocationPermission) {
                Geolocation.getCurrentPosition(
                    position => {
                        setUserPosition({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    error => {
                        console.log(error.code, error.message);
                    }
                );
            }
        }, [hasLocationPermission]);
        console.log(userPosition.latitude, userPosition.longitude);
    }


    return (
        <>
            <CustomHeader />
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite um nome de usuário"
                    onChangeText={(text) => setUserName(text)}
                />

                <TouchableOpacity style={styles.botao} onPress={saveName}>
                    <Text style={styles.textBotao}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botao} onPress={saveLocation}>
                    <Text style={styles.textBotao}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}




const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginTop: 10,
        padding: 10,
        width: 300,
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 3,
    },
    botao: {
        width: 300,
        height: 42,
        backgroundColor: '#3498db',
        marginTop: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBotao: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});

export default  Settings;

