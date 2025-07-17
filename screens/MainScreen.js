import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getAllProfiles, createProfile, updateProfile, deleteProfile } from '../services/api';

const initialFormState = {
  firstName: '',
  lastName: '',
  age: '',
  interests: '',
};

const MainScreen = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      setProfiles(await getAllProfiles());
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field}:`, value); // Debug log
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const validateForm = () => {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.age.trim()) return 'Age is required';
    const age = parseInt(form.age);
    if (isNaN(age) || age < 13 || age > 120) return 'Age must be between 13 and 120';
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) return Alert.alert('Validation Error', errorMsg);
    setSubmitting(true);
    const profileData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      age: parseInt(form.age),
      interests: form.interests.trim() ? form.interests.split(',').map(i => i.trim()) : [],
    };
    try {
      if (editingId) {
        await updateProfile(editingId, profileData);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        await createProfile(profileData);
        Alert.alert('Success', 'Profile created successfully');
      }
      fetchProfiles();
      resetForm();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (profile) => {
    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      age: profile.age ? profile.age.toString() : '',
      interests: profile.interests ? profile.interests.join(', ') : '',
    });
    setEditingId(profile._id);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Profile', 'Are you sure you want to delete this profile?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await deleteProfile(id);
            fetchProfiles();
            if (editingId === id) resetForm();
            Alert.alert('Success', 'Profile deleted successfully');
          } catch (error) {
            Alert.alert('Error', error.message || 'Failed to delete profile');
          }
        }
      }
    ]);
  };

  const renderProfile = ({ item }) => (
    <View style={styles.profileCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.profileName}>{item.firstName} {item.lastName}</Text>
        <Text style={styles.profileAge}>Age: {item.age}</Text>
        {item.interests && item.interests.length > 0 && (
          <Text style={styles.profileInterests}>Interests: {item.interests.join(', ')}</Text>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDelete(item._id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{editingId ? 'Edit Profile' : 'Create Profile'}</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name*"
        value={form.firstName}
        onChangeText={t => handleInputChange('firstName', t)}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={50}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name*"
        value={form.lastName}
        onChangeText={t => handleInputChange('lastName', t)}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={50}
      />
      <TextInput
        style={styles.input}
        placeholder="Age* (13-120)"
        value={form.age}
        onChangeText={t => handleInputChange('age', t)}
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={3}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests (comma-separated)"
        value={form.interests}
        onChangeText={t => handleInputChange('interests', t)}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Profile' : 'Create Profile')}
        </Text>
      </TouchableOpacity>
      {editingId && (
        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
          <Text style={styles.cancelButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profiles</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2c3e50" style={{ marginVertical: 30 }} />
      ) : (
        <>
          <FlatList
            data={profiles}
            keyExtractor={item => item._id}
            renderItem={renderProfile}
            ListEmptyComponent={<Text style={styles.emptyText}>No profiles found.</Text>}
          />
          {renderForm()} 
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ecf0f1', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16, textAlign: 'center' },
  profileCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  profileAge: { fontSize: 14, color: '#7f8c8d' },
  profileInterests: { fontSize: 13, color: '#2980b9' },
  actionButtons: { justifyContent: 'center' },
  button: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5, marginVertical: 2 },
  editButton: { backgroundColor: '#f39c12', marginBottom: 4 },
  deleteButton: { backgroundColor: '#e74c3c' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginVertical: 30 },
  formContainer: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginTop: 10, marginBottom: 80, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  formTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10, textAlign: 'center' },
  input: { backgroundColor: '#f7f7f7', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 10 },
  submitButton: { backgroundColor: '#27ae60', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { backgroundColor: '#95a5a6' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { marginTop: 8, alignItems: 'center' },
  cancelButtonText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 15 },
});

export default MainScreen;