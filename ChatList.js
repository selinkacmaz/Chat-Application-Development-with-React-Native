import ChatItem from 'C:\Users\slnkc\OneDrive\Masaüstü\NewApp\NewApp\components\ChatItem.js';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function ChatList({ users, currentUser }) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                contentContainerStyle={styles.flatListContent}
                keyExtractor={(item) => item.userId} 
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <ChatItem 
                        noBorder={index + 1 === users.length}
                        router={router}
                        currentUser={currentUser}
                        item={item}
                        index={index}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flatListContent: {
        flex: 1,
        paddingVertical: 25,
    },
});
