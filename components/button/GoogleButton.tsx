import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { palette } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch } from '../../store/hooks';
import { loginWithGoogle } from '../../store/slices/userSlice';

// Configure Google Sign-In once at module level
GoogleSignin.configure({
  scopes: ['profile', 'email'],
  webClientId: '518868709-2jlp8cd39u29g6bt921c6gqf3ad1t5hr.apps.googleusercontent.com',
});

export const handleGoogleSignOut = async (logout?: () => void) => {
  try {
    await GoogleSignin.signOut();
    if (logout) {
      logout();
    }
  } catch (error) {
    console.error("Logout Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    Alert.alert("Error logging out", errorMessage);
  }
};

const GoogleButton = () => {
  const { setAuthData } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo || !userInfo.data?.idToken) {
        Alert.alert('Sign in failed', 'Could not retrieve ID token from Google');
        return;
      }

      const idToken = userInfo.data.idToken;
      const resultAction = await dispatch(loginWithGoogle(idToken));

      if (loginWithGoogle.fulfilled.match(resultAction)) {
        const data = resultAction.payload;
        const tokenToStore = data.type && data.token ? `${data.type} ${data.token}` : data.token;

        // Construct UserInfo object from login payload
        const userInfo = {
          id: data.userId,
          email: data.email,
          name: data.name,
          photo: data.profilePictureUrl,
          subscription: data.subscription
        };

        await setAuthData(tokenToStore, userInfo);
        router.replace('/(tabs)');
      } else {
        if (resultAction.payload) {
          console.error('Login Failed with error:', resultAction.payload);
          Alert.alert('Login Failed', String(resultAction.payload));
        } else {
          console.error('Login Failed:', resultAction.error.message);
          Alert.alert('Login Failed', resultAction.error.message || 'Authentication failed');
        }
      }

    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available', 'Please update or install Google Play Services');
      } else {
        console.error('Login Error:', error);
        Alert.alert('Login Failed', error.message || 'An unexpected error occurred');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View className="items-center">
      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isSigningIn}
        className="flex-row mt-4 items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-md w-42"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.08,
          backgroundColor: palette.light.primary,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)'
        }}
      >
        {/* Left Content */}
        <View className="flex-row justify-between items-center">
          <View className="flex justify-center items-center bg-white rounded-full p-1 mr-2">
            <Image
              source={require('../../assets/images/google-logo.png')}
              style={{ width: 15, height: 15 }}
              resizeMode="contain"
            />
          </View>
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Montserrat-Medium' }}
          >
            Continue
          </Text>
        </View>



      </TouchableOpacity>
    </View>
  );
};

export default GoogleButton;