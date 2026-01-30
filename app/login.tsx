import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Text } from 'react-native-paper';
import loginBg from '../assets/images/login-page.png';
import GoogleButton from '../components/button/GoogleButton';

export default function LoginScreen() {
    return (
        <ImageBackground
            source={loginBg}
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 justify-between">
                <View className="justify-start items-center mt-24">
                    <Text className="text-4xl text-white" style={{ fontFamily: 'EBGaramond-Bold'}}>
                        Arilo.
                    </Text>
                </View>
                <View className="flex-1 mb-24 justify-end">
                <View className="px-6 items-center">
                    <Text className="text-center text-2xl text-white font-medium shadow-sm" style={{ fontFamily: 'EBGaramond-Medium' }}>
                        Don't let your moments fade away
                    </Text>
                    <Text className="text-center text-lg text-gray-200 mt-2 shadow-sm" style={{ fontFamily: 'EBGaramond' }}>
                        The daily journal that writes itself.
                    </Text>
                </View>
                <View className="mb-12 px-6 items-center ">
                   <GoogleButton />
                </View>
                </View>
            </View>
        </ImageBackground>
    );
}

