import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    SafeAreaView,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Modal
} from 'react-native';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

// UI
import CardProfileHorizontal from "../../UI/CardProfileHorizontal";
import ClearFix from "../../UI/ClearFix";

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            specialist: this.props.route.params.specialist,
            paymentModal: false
        }
    }

    handleCreditCard = form => console.log(form);

    render(){
        return (
            <SafeAreaView style={ styles.container }>
                <CardProfileHorizontal
                    name={this.state.specialist.name}
                    location={this.state.specialist.location}
                    avatar={this.state.specialist.avatar}
                    price={this.state.specialist.price}
                    rating={this.state.specialist.rating}
                    available={this.state.specialist.available}
                    onPress={() => this.setState({paymentModal: true})}
                />
                <Modal
                    animationType="slide"
                    // transparent={true}
                    visible={this.state.paymentModal}
                    height={screenHeight}
                    onRequestClose={()=> this.setState({paymentModal: false})}
                >
                    <View style={{ marginTop: 30, marginHorizontal: 10 }}>
                        <CreditCardInput onChange={this.handleCreditCard} />
                    </View>
                </Modal>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});