import React from 'react';
import { Button, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pickDirectory = async () => {
  console.log("hi!!!!!");
  try {
    const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permission.granted) {
      const dirUri = permission.directoryUri;
      console.log('Selected Directory URI:', dirUri);
      await AsyncStorage.setItem('selectedDirectoryUri', dirUri); // Save the directory URI persistently
      console.log('Saved Directory URI to AsyncStorage:', dirUri);
      router.push({
        pathname: '/SongList',
        params: { dirUri }
      });
    } else {
      console.log('Directory selection cancelled.');
    }
  } catch (error) {
    console.log('Error picking directory:', error);
  }
};

interface Permission {
  granted: boolean;
  directoryUri: string;
}

const extractDocumentUri = (dirUri: string): string => {
  // Extract the document URI from the directory URI
  const documentUri = dirUri.replace('/tree/', '/document/');
  return documentUri;
};

const readDirectoryUri = async () => {
  try {
    const dirUri = await AsyncStorage.getItem('selectedDirectoryUri');
    if (dirUri) {
      console.log('Read Directory URI from AsyncStorage:', dirUri);
      const documentUri = extractDocumentUri(dirUri);
      console.log('Passing Document URI to metadata parser:', documentUri);
      // Pass documentUri to metadata parser here
    } else {
      console.log('No Directory URI found in AsyncStorage.');
    }
  } catch (error) {
    console.log('Error reading directory URI from AsyncStorage:', error);
  }
};

export default function Index() {
  React.useEffect(() => {
    readDirectoryUri();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button title="Go to Song List" onPress={() => { router.push('/SongList') }} />
      <Button title="Go to Playback Screen" onPress={() => { router.push('/PlaybackScreen') }} />
      <Button title="Select Folder" onPress={pickDirectory} />
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
