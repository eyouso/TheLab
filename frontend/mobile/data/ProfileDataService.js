// ProfileDataService.js
import { API_URL } from './dataService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchProfileData = async (profileId) => {
  try {
    const response = await fetch(`${API_URL}/profiles/${profileId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }
    const profileData = await response.json();
    await saveProfileDataToLocal(profileData); // Save the profile data locally
    return profileData;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
};

export const loadProfileDataFromLocal = async () => {
  try {
    const storedProfileData = await AsyncStorage.getItem('profileData');
    return storedProfileData ? JSON.parse(storedProfileData) : null;
  } catch (error) {
    console.error('Failed to load profile data from local storage:', error);
    return null;
  }
};

export const saveProfileDataToLocal = async (profileData) => {
  try {
    await AsyncStorage.setItem('profileData', JSON.stringify(profileData));
  } catch (error) {
    console.error('Failed to save profile data to local storage:', error);
  }
};
