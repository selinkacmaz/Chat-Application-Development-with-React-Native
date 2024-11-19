import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; // useNavigation ve useRoute importları
import { StatusBar } from 'expo-status-bar';
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ChatRoomHeader from '../../components/ChatRoomHeader';
import CustomKeyboardView from '../../components/CustomKeyboardView';
import MessageList from '../../components/MessageList';
import { db } from '../../firebaseConfig';
import { getRoomId } from '../../utils/common';
import { useAuth } from '../context/authContext';

export default function ChatRoom() {
    const route = useRoute(); // useRoute hook'u
    const navigation = useNavigation(); // useNavigation hook'u
    const { user } = useAuth(); // logged in user
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    const item = route.params.item; // item parametrelerini route'dan alıyor

    useEffect(() => {
        createRoomIfNotExists();

        let roomId = getRoomId(user?.userId, item?.userId);
        const docRef = doc(db, "rooms", roomId);
        const messagesRef = collection(docRef, "messages");
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        let unsub = onSnapshot(q, (snapshot) => {
            let allMessages = snapshot.docs.map(doc => doc.data());
            setMessages([...allMessages]);
        });

        const KeyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow', updateScrollView
        );

        return () => {
            unsub();
            KeyboardDidShowListener.remove();
        };

    }, [user, item]);

    useEffect(() => {
        updateScrollView();
    }, [messages]);

    const updateScrollView = () => {
        setTimeout(() => {
            scrollViewRef?.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const createRoomIfNotExists = async () => {
        // roomId
        let roomId = getRoomId(user?.userId, item?.userId);
        console.log("Room ID: ", roomId);
        await setDoc(doc(db, "rooms", roomId), {
            roomId,
            createdAt: Timestamp.fromDate(new Date())
        });
    };

    const handleSendMessage = async () => {
        let message = textRef.current.trim();
        if (!message) return;
        try {
            let roomId = getRoomId(user?.userId, item?.userId);
            const docRef = doc(db, 'rooms', roomId);
            const messagesRef = collection(docRef, "messages");
            textRef.current = "";
            if (inputRef) inputRef?.current?.clear();
            const newDoc = await addDoc(messagesRef, {
                userId: user?.userId,
                text: message,
                profileUrl: user?.profileUrl,
                senderName: user?.username,
                createdAt: Timestamp.fromDate(new Date())
            });
        } catch (err) {
            Alert.alert('Message', err.message);
        }
    };

    return (
        <CustomKeyboardView inChat={true}>
            <View style={styles.container}>
                <StatusBar style="dark" />
                <ChatRoomHeader user={item} navigation={navigation} />
                <View style={styles.separator} />
                <View style={styles.mainContainer}>
                    <View style={styles.messageListContainer}>
                        <MessageList scrollViewRef={scrollViewRef} messages={messages} currentUser={user} />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            onChangeText={value => textRef.current = value}
                            placeholder='Type message...'
                            placeholderTextColor={'gray'}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                            <Feather name="send" size={hp(2.7)} color="#737373" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    separator: {
        height: hp(0.3),
        backgroundColor: '#CBD5E0',
        borderBottomWidth: 1,
        borderBottomColor: '#CBD5E0',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#EDF2F7',
        justifyContent: 'space-between',
    },
    messageListContainer: {
        flex: 1,
    },
    inputContainer: {
        paddingTop: hp(2),
        paddingBottom: hp(2.7),
        paddingHorizontal: wp(3),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#CBD5E0'
    },
    input: {
        flex: 1,
        fontSize: hp(2),
        marginRight: wp(2),
    },
    sendButton: {
        backgroundColor: '#E2E8F0',
        padding: hp(1.5),
        borderRadius: 100,
        marginLeft: wp(2),
    },
});