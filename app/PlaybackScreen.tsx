import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function PlaybackScreen() {
    const playSound = () => {
        const audio = new Audio('/path/to/your/soundfile.mp3');
        audio.play();
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Playback Screen</ThemedText>
            <Button title="Play Sound" onPress={playSound} />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});