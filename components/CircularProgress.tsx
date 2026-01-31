import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { palette } from '../constants/colors';

interface CircularProgressProps {
    used: number;
    limit: number;
    size?: number;
    strokeWidth?: number;
}

export const CircularProgress = ({
    used,
    limit,
    size = 30,
    strokeWidth = 6
}: CircularProgressProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = limit > 0 ? Math.min(used / limit, 1) : 0;
    const strokeDashoffset = circumference - progress * circumference;

    const handlePress = () => {
        setShowTooltip(prev => !prev);
        if (!showTooltip) {
            setTimeout(() => setShowTooltip(false), 3000);
        }
    };

    return (
        <View className="items-center justify-center z-50">
            <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
                <Svg width={size} height={size}>
                    <Circle
                        stroke={palette.light.primary + '20'}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke={palette.light.primary}
                        fill="none"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${size / 2}, ${size / 2}`}
                    />
                </Svg>
            </TouchableOpacity>
            {showTooltip && (
                <View
                    style={{
                        position: 'absolute',
                        top: size + 5,
                        right: 0,
                        backgroundColor: '#2d2d2d',
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 8,
                        zIndex: 100,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        minWidth: 70,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '700', fontFamily: 'Montserrat-Bold' }}>
                        {used} / {limit}
                    </Text>
                </View>
            )}
        </View>
    );
};
