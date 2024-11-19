import { StatusBar } from 'expo-status-bar';
import { getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ChatList from '../(app)/ChatList';
import { usersRef } from '../../firebaseConfig';
import { useAuth } from '../context/authContext';

export default function Home() {
    const { logout, user } = useAuth();
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        if (user?.uid)
            getUsers();
    }, [user]);

    const getUsers = async () => {
        // fetch users
        const q = query(usersRef, where('userId', '!=', user?.uid));

        const querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc => {
            data.push({ ...doc.data() });
        });

        setUsers(data);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {
                users.length > 0 ? (
                    <ChatList currentUser={user} users={users} />
                ) : (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" />
                        {/* <Loading size={hp(10)} /> */}
                    </View>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: hp(30),
    },
});