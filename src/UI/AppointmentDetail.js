import React from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView, FlatList, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Config
import { env } from '../config/env';

// UI
import Card from "./Card";
import HyperLink from "./HyperLink";

export default function AppointmentDetail(props) {
    const renderItem = ({ item }) => (
        <Text>{details.analysis}</Text>
    );
    
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={ styles.container }>
            <View style={ [styles.cardContainer] }>
                <View style={{ width: '30%'}}>
                    <Image
                        style={{ width: 80, height: 80, borderRadius: 40 }}
                        source={{ uri: `${env.API}/storage/${props.data.specialist.user.avatar}` }}
                    />
                </View>
                <View style={{ width: '60%', marginTop: 5 }}>
                    <Text style={{ fontSize: 18, color: 'black' }} numberOfLines={1}>{ props.data.specialist.full_name }</Text>
                    <Text style={ styles.textMuted } numberOfLines={3}>{ props.data.specialist.description }</Text>
                </View>
            </View>

            <Card title='Motivo de la consulta' color='#20AE09' textColor='#fff'>
                <Text style={ styles.textMuted }>{ props.data.observations }</Text>
            </Card>
            <Card title='Prescripciones médicas' color='#1783D3' textColor='#fff'>
                <View style={{ flex: 1 }}>
                    {
                        props.data.prescription.map(prescription => {
                            return(
                                <View>
                                    <FlatList
                                        style={{ paddingVertical: 10 }}
                                        data={prescription.details}
                                        renderItem={({item, index})=>
                                            <View>
                                                <Text key={item.id}> <Icon name='checkmark-outline'/> {parseInt(item.quantity)} {item.medicine_name}</Text>
                                                <Text style={[styles.textMuted, { marginLeft: 20 }]}>{item.medicine_description}</Text>
                                            </View>
                                        }
                                        keyExtractor={item => item.id}
                                    />
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <HyperLink url={`${env.API}/home/prescriptions/details/${prescription.id}/download`} color={env.color.primary}>
                                            Descargar
                                        </HyperLink>
                                    </View>
                                    <View style={{ borderWidth: 1, borderColor: '#EBEBEB' }}></View>
                                </View>
                            )
                        })
                    }
                </View>
            </Card>
            <Card title='Ordenes de laboratorios' color='#D88307' textColor='#fff'>
                <View style={{ flex: 1 }}>
                    {
                        props.data.analysis.map(analysi => {
                            return(
                                <View>
                                    <FlatList
                                        style={{ paddingVertical: 10 }}
                                        data={analysi.details}
                                        renderItem={({item, index})=>
                                            <Text key={item.id}> <Icon name='checkmark-outline'/> {item.analysis.name}</Text>
                                        }
                                        keyExtractor={item => item.id}
                                    />
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <HyperLink url={`${env.API}/home/order_analysis/details/${analysi.id}/download`} color={env.color.primary}>
                                            Descargar
                                        </HyperLink>
                                    </View>
                                    <View style={{ borderWidth: 1, borderColor: '#EBEBEB' }}></View>
                                </View>
                            )
                        })
                    }
                </View>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginVertical: 20
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    textMuted: {
        fontSize: 13,
        color: '#6A6969',
        marginTop: 3
    }
});