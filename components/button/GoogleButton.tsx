import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch } from '../../store/hooks';
import { setUserInfo } from '../../store/slices/userSlice';

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
  const { setToken } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSigningIn, setIsSigningIn] = useState(false);

  return (
    <View>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        style={{ width: 300, height: 58, borderRadius: 5 }}
        disabled={isSigningIn}
        onPress={async () => {
          // Prevent concurrent sign-in attempts
          if (isSigningIn) {
            console.log("Sign-in already in progress, ignoring duplicate request");
            return;
          }

          setIsSigningIn(true);

          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (!userInfo || !userInfo?.data?.idToken) {
              Alert.alert("Google sign-in failed", "Not able to fetch user data from google Account");
              return;
            }

            // Extract user information from Google response
            const user = userInfo.data.user;
            if (user) {
              // Store user info in Redux
              dispatch(setUserInfo({
                email: user.email || '',
                name: user.name || user.givenName || 'User',
                photo: user.photo || undefined,
                id: user.id || undefined,
              }));
            }

            // Store temporary JWT token in AsyncStorage
            const tempToken = 'Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzaGFoYjM3MDNAZ21haWwuY29tIiwibmFtZSI6IkJoYXZ5YSBTaGFoIiwidXNlcklkIjoiNTI4YzZlOGItOGY1NC00OWRkLWIzN2EtZDMxZGUzZDBjYWY5IiwiaWF0IjoxNzY5MTc1Nzk3LCJleHAiOjE3NjkyNjIxOTd9.4RhgL1Ou2NSSg467hlOMz-wjwY0bhprZyHu3MXS69bAVxRjqrNURCf9IKmUJFXpc';
            await setToken(tempToken);

            // Navigate to home screen
            router.replace('/(drawer)');
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              console.log("User cancelled the login");
            } else if (error.code === statusCodes.IN_PROGRESS) {
              Alert.alert("Google sign-in", "Sign-in in progress");
              console.log("User sign-in in progress already");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              console.log("play services are not available or outdated");
              Alert.alert("Google sign-in", "Play services are not available\ntry after some time");
            } else {
              console.log(error);
              Alert.alert("Google sign-in failed", "Please try after some time");
            }
          } finally {
            setIsSigningIn(false);
          }
        }}
      />
    </View>
  );
};

export default GoogleButton;