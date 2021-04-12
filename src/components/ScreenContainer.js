import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import {Theme} from '../constants';

export default function ScreenContainer({
  children,
  color = 'background',
  style,
  position = 'center',
  backgroundImage,
  noScroll,
}) {
  const [keyboard, setKeyboard] = useState(0);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  });
  const _keyboardDidShow = () => {
    const pad = noScroll ? 300 : 0;
    setKeyboard(pad);
  };

  const _keyboardDidHide = () => {
    setKeyboard(0);
  };

  const colorStyle = color && Theme.COLORS[color.toUpperCase()];
  const containerStyles = [
    styles.container,
    color && {backgroundColor: colorStyle},
    {justifyContent: position},
  ];
  const subContainerStyles = [
    styles.subContainer,
    {marginBottom: keyboard},
    {...style},
  ];

  return (
    <KeyboardAvoidingView
      contentContainerStyle={styles.container}
      behavior={Platform.OS === 'ios' ? 'position' : ''}>
      <ImageBackground source={backgroundImage} style={containerStyles}>
        <TouchableWithoutFeedback
          style={styles.container}
          onPress={Keyboard.dismiss}>
          <View style={subContainerStyles}>{children}</View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  subContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    flex: 1,
  },
});
