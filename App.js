import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, PanResponder, Dimensions, Vibration } from 'react-native';
import { Audio } from 'expo-av';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DigitalPet = () => {
    const [happiness, setHappiness] = useState(50);
    const [hunger, setHunger] = useState(50);
    const [petPosition, setPetPosition] = useState({ x: screenWidth / 4, y: screenHeight / 4 });
    const [petImage, setPetImage] = useState(require('./assets/happy_pet.png')); // Initially happy image

    useEffect(() => {
        const interval = setInterval(() => {
            // Decrease happiness and hunger over time
            setHappiness(prevHappiness => Math.max(prevHappiness - 1, 0));
            setHunger(prevHunger => Math.max(prevHunger - 1, 0));
        }, 1000); // Decrease every second

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update pet image based on happiness and hunger levels
        if (happiness < 30 || hunger < 30) {
            setPetImage(require('./assets/sad_pet.png'));
        } else {
            setPetImage(require('./assets/happy_pet.png'));
        }
    }, [happiness, hunger]);

    const feedPet = () => {
        // Increase hunger level when feeding
        setHunger(prevHunger => Math.min(prevHunger + 10, 100));
        // Vibrate for 10 times 100 milliseconds when button is pressed
        Vibration.vibrate([100, 100, 100, 100, 100, 100, 100, 100, 100, 100]);
    };

    const playWithPet = () => {
        // Increase happiness level when playing
        setHappiness(prevHappiness => Math.min(prevHappiness + 10, 100));
        // Vibrate for 10 times 100 milliseconds when button is pressed
        Vibration.vibrate([100, 100, 100, 100, 100, 100, 100, 100, 100, 100]);
    };

    const bark = async () => {
        try {
            const soundObject = new Audio.Sound();
            await soundObject.loadAsync(require('./assets/bark.wav'));
            await soundObject.playAsync();
            // Vibrate for 100 milliseconds when button is pressed
            Vibration.vibrate(100);
        } catch (error) {
            console.log('Error playing sound: ', error);
        }
    };

    // Gesture handling
    const panResponder = React.useMemo(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const { dx, dy } = gestureState;
                let newX = petPosition.x + dx;
                let newY = petPosition.y + dy;

                // Ensure the pet stays within the screen bounds
                if (newX < 0) {
                    newX = 0;
                } else if (newX > screenWidth - 200) {
                    newX = screenWidth - 200;
                }
                if (newY < 0) {
                    newY = 0;
                } else if (newY > screenHeight - 200) {
                    newY = screenHeight - 200;
                }

                setPetPosition({ x: newX, y: newY });
            },
            onPanResponderRelease: () => {
                // You can handle pet release here, if needed
            }
        }), [petPosition]);

    return (
        <View style={styles.container}>
            <View
                {...panResponder.panHandlers}
                style={[styles.petContainer, { left: petPosition.x, top: petPosition.y }]}
            >
                <Image
                    source={petImage}
                    style={styles.petImage}
                />
            </View>
            <Text style={[styles.status, { marginTop: 20, color: '#333' }]}>Happiness: {happiness}</Text>
            <Text style={[styles.status, { color: '#333' }]}>Hunger: {hunger}</Text>
            <View style={[styles.buttonsContainer, { marginBottom: 20 }]}>
                <TouchableOpacity style={styles.button} onPress={feedPet}>
                    <Text>Feed</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={playWithPet}>
                    <Text>Play</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={bark}>
                    <Text>Bark</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFDAB9', // Pastel color (PeachPuff)
    },
    petContainer: {
        position: 'absolute',
    },
    petImage: {
        width: 200,
        height: 200,
    },
    status: {
        marginBottom: 10,
        fontSize: 18,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'lightblue', // Button color
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,
    },
});

export default DigitalPet;
