import { Stack } from "expo-router";
import React from 'react';
import HomeHeader from "../../components/HomeHeader";

export default function _layout() {
  return (
    <Stack >
      <Stack.Screen
      name="home"
      options={{
        header: ()=> <HomeHeader />
      }}
    /> 
    <Stack.Screen name="chatList" />
    <Stack.Screen name="chatRoom" />

    </Stack>
  )
}