import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TextInputAlt(props) {

    var [showPassword, handleShowPassword] = useState(true);

    return (
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <View style={{ width: '100%' }}>
                <Text style={{ color: '#B7B7B7', fontWeight: 'bold' }}>{props.label}</Text>
                <TextInput
                    style={[{ height: 40, borderColor: '#C4C4C4', borderBottomWidth: 2 }, props.style ? props.style : {}]}
                    placeholder={props.placeholder}
                    placeholderTextColor='#C4C4C4'
                    secureTextEntry={props.password && showPassword ? true: false}
                    keyboardType={props.keyboardType ? props.keyboardType : 'default'}
                    autoCapitalize={props.autoCapitalize ? props.autoCapitalize : 'none'}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    multiline={props.multiline ? true : false }
                    numberOfLines={props.numberOfLines ? props.numberOfLines : 1}
                    maxLength={props.maxLength ? props.maxLength : 50}
                />
                { props.password &&
                    <TouchableOpacity onPress={() => handleShowPassword(!showPassword)} style={ styles.icon }>
                        <Icon name={showPassword ? 'eye' : 'eye-off'} size={30} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        top: 25,
        right: 25,
        zIndex:1,
    },
});