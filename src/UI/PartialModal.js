import React from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);

const PartialModal = props => {
  return (
    <Modal
        transparent={true}
        animationType={props.animationType}
        visible={props.visible}
        onRequestClose={props.onRequestClose}
    >
        <View style={style.container}>
            <View style={[style.body, {height: props.height}]}>
                {props.children}
            </View>
        </View>
    </Modal>
  );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    body: {
        backgroundColor: 'white',
        width: screenWidth,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
});

export default  PartialModal;