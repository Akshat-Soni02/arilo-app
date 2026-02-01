import { Ionicons } from '@expo/vector-icons';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../constants/colors';
import { useAppDispatch } from '../store/hooks';
import { uploadAudioNote } from '../store/slices/noteSlice';

const { width } = Dimensions.get('window');
const MAX_RECORDING_TIME = 60; // 60 seconds

// Wave visualizer based on actual audio amplitude
const WaveVisualizer = ({ audioRecorder, isRecording }: { audioRecorder: any; isRecording: boolean }) => {
  const bars = 30;
  const [meterLevels, setMeterLevels] = useState<number[]>(Array(bars).fill(0.2));
  const animatedValues = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && audioRecorder) {
      // Poll metering data
      interval = setInterval(() => {
        try {
          // Get current metering level (0 to 1)
          const currentLevel = audioRecorder.currentTime ? Math.random() * 0.8 + 0.2 : 0.2; // Placeholder - expo-audio doesn't expose metering yet

          // Update levels array (shift and add new level)
          setMeterLevels(prev => {
            const newLevels = [...prev.slice(1), currentLevel];

            // Animate each bar to its new level
            newLevels.forEach((level, index) => {
              Animated.timing(animatedValues[index], {
                toValue: level,
                duration: 100,
                useNativeDriver: true,
              }).start();
            });

            return newLevels;
          });
        } catch (err) {
          console.log('Metering error:', err);
        }
      }, 100); // Update 10 times per second
    } else {
      // Reset to baseline when not recording
      animatedValues.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, audioRecorder]);

  return (
    <LinearGradient
      colors={['#ffffffff', '#ffffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full h-[100px] rounded-2xl flex-row items-center justify-center gap-1 px-4"
    >
      {animatedValues.map((anim, index) => {
        const scaleY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 2.5],
        });

        return (
          <Animated.View
            key={index}
            className="w-1 h-10 rounded-full"
            style={{
              backgroundColor: palette.light.primary,
              opacity: 0.6,
              transform: [{ scaleY }],
            }}
          />
        );
      })}
    </LinearGradient>
  );
};

export default function RecordModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [recordingTime, setRecordingTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-start recording on mount
  useEffect(() => {
    startRecording();
    return () => {
      stopRecordingAndCleanup();
    };
  }, []);

  // Timer logic with auto-submit at 60 seconds
  useEffect(() => {
    if (recorderState.isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= MAX_RECORDING_TIME) {
            handleDone(); // Auto-submit when reaching max time
            return MAX_RECORDING_TIME;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recorderState.isRecording]);

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        router.back();
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setRecordingTime(0);
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecordingAndCleanup = async () => {
    if (recorderState.isRecording) {
      await audioRecorder.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleDiscard = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await stopRecordingAndCleanup();
      router.back();
    } catch (err) {
      console.error('Failed to discard', err);
      router.back();
    }
  };

  const handleDone = async () => {
    try {
      setUploading(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (uri) {
        // Upload audio note using Redux thunk
        await dispatch(uploadAudioNote(uri)).unwrap();
      }

      router.back();
    } catch (err: any) {
      console.error('Failed to upload', err);
      Alert.alert('Upload Failed', err.message || 'Failed to upload audio note');
      setUploading(false);
    }
  };

  const progress = (recordingTime / MAX_RECORDING_TIME) * 100;

  return (
    <View className="flex-1 justify-end bg-black/50">
      <TouchableOpacity
        className="absolute inset-0"
        activeOpacity={1}
        onPress={handleDiscard}
      />

      <View className="bg-[#FEFDFB] rounded-t-3xl overflow-hidden">
        {/* Linear Progress Bar - at the very top */}
        <View className="h-1 bg-[#E8E4D9] w-full">
          <View
            className="h-full bg-[#F07E54]"
            style={{ width: `${progress}%` }}
          />
        </View>

        <View className="px-6 pt-4 pb-8 ios:pb-10">
          {/* Handle */}
          <View className="w-10 h-1 bg-[#E8E4D9] self-center rounded-full mb-4" />

          {uploading ? (
            // Uploading State - Only show loader and text
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#F07E54" />
              <Text className="text-xl font-semibold text-[#2d2d2d] mt-4" style={{ fontFamily: 'Montserrat-SemiBold' }}>
                Uploading...
              </Text>
            </View>
          ) : (
            <>
              {/* Timer */}
              <View className="items-center mb-4">
                <Text className="text-xl font-semibold text-[#2d2d2d]" style={{ fontFamily: 'Montserrat-SemiBold' }}>
                  {formatTime(recordingTime)}
                </Text>
              </View>

              {/* Waveform Visualization */}
              <View className="mb-4">
                <WaveVisualizer audioRecorder={audioRecorder} isRecording={recorderState.isRecording} />
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-center items-center gap-16">
                <TouchableOpacity
                  className="items-center gap-2"
                  onPress={handleDiscard}
                  activeOpacity={0.7}
                >
                  <View className="w-16 h-16 rounded-full bg-[#FEFDFB] border-[1.5px] border-[#E8E4D9] justify-center items-center shadow-sm">
                    <Ionicons name="close" size={24} color="#2d2d2d" />
                  </View>
                  <Text className="text-xs text-[#2d2d2d]" style={{ fontFamily: 'Montserrat-Medium' }}>
                    Discard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="items-center gap-2"
                  onPress={handleDone}
                  activeOpacity={0.7}
                >
                  <View className="w-16 h-16 rounded-full bg-[#F07E54] justify-center items-center shadow-sm">
                    <Ionicons name="checkmark" size={24} color="white" />
                  </View>
                  <Text className="text-xs text-[#2d2d2d]" style={{ fontFamily: 'Montserrat-Medium' }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}
