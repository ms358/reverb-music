import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseBlob } from 'music-metadata-browser';

export default function SongList() {
  const [mp3Files, setMp3Files] = useState<string[]>([]);
  const [metadataList, setMetadataList] = useState<any[]>([]);
  const [dirUri, setDirUri] = useState<string | null>(null);

  useEffect(() => {
    const loadDirectoryUri = async () => {
      const storedDirUri = await AsyncStorage.getItem('selectedDirectoryUri');
      if (storedDirUri) {
        setDirUri(storedDirUri);
      }
    };

    loadDirectoryUri();
  }, []);

  useEffect(() => {
    const fetchMp3Files = async () => {
      try {
        if (dirUri) {
          const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(dirUri);
          const mp3Files = files.filter(file => file.toLowerCase().endsWith('.mp3'));
          setMp3Files(mp3Files);
        }
      } catch (error) {
        console.error('Error reading directory:', error);
      }
    };

    fetchMp3Files();
  }, [dirUri]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const metadataPromises = mp3Files.map(async (fileUri) => {
          // Extract filename from URI for display purposes
          const filename = fileUri.split('/').pop() || fileUri;

          // Read file directly using the URI provided by readDirectoryAsync
          const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
          const fileBlob = new Blob([fileContent], { type: 'audio/mpeg' });
          const metadata = await parseBlob(fileBlob);
          return { file: filename, fileUri, metadata };
        });

        const metadataResults = await Promise.all(metadataPromises);
        setMetadataList(metadataResults);
      } catch (error) {
        console.error('Error reading metadata:', error);
      }
    };

    if (mp3Files.length > 0) {
      fetchMetadata();
    }
  }, [mp3Files]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.whiteText}>Song List</ThemedText>
      <ScrollView>
        <ThemedText>Hi from the songlist</ThemedText>
        {metadataList.map((item, index) => (
          <View key={index} style={styles.fileContainer}>
            <ThemedText style={[styles.fileText, styles.whiteText]}>{item.file}</ThemedText>
            <ThemedText style={[styles.metadataText, styles.whiteText]}>Title: {item.metadata.common.title || 'Unknown'}</ThemedText>
            <ThemedText style={[styles.metadataText, styles.whiteText]}>Artist: {item.metadata.common.artist || 'Unknown'}</ThemedText>
            <ThemedText style={[styles.metadataText, styles.whiteText]}>Album: {item.metadata.common.album || 'Unknown'}</ThemedText>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileContainer: {
    marginVertical: 8,
  },
  fileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metadataText: {
    fontSize: 14,
  },
  scrollView: {
    color: 'white',
  },
  whiteText: {
    color: 'white',
  },
});
