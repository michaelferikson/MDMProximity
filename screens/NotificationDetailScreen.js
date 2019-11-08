import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  AppLoading,
  Font
} from "react-native";
import * as SQLite from 'expo-sqlite';
import * as Constants from "expo-constants";
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Notifications } from 'expo';
import { Avatar, Header } from 'react-native-elements';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import createStackNavigator from 'react-navigation-stack';
import HomeScreen from './HomeScreen';

const db = SQLite.openDatabase("db.db");

export default class MerchantScreen extends React.Component {
	static navigationOptions = { title: 'NotificationDetail' };
	
	constructor(props){
		super(props);
		this.state = {
			NotificationMessageListArray : [],
			finalMerchant: this.props.navigation.getParam('finalMerchant'),
			finalLatitude: this.props.navigation.getParam('finalLatitude'),
			finalLongitude: this.props.navigation.getParam('finalLongitude'),
			LastMerchantID: this.props.navigation.getParam('LastMerchantID'),
			CurrentMerchantID: this.props.navigation.getParam('CurrentMerchantID')
		};
		this._isMounted = false;
	};
	
	componentWillMount() {
		this._isMounted = false;
	}
	
	componentDidMount() {
		this._isMounted = true;
	}
	
	render() {
		
		return ( 		
	  
		  <View style={styles.container}>
			
			<Text style={{fontSize: 25,fontWeight: "bold",textAlign: "center",color: "white",marginTop: 20,marginBottom: 10}}>Promo Detail</Text>
			
			<View style={{alignSelf: 'center'}}>
				<Image style={{resizeMode:'stretch', height: 350, width: 350}} source={require('./../assets/images/promodetail1.jpg')} /> 
			</View>
			
		  </View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "#077bd6",
	backgroundColor: "#044e94",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",	
	color: "white",
	marginTop: 10,
	marginBottom: 10
  },
  heading2: {
    fontSize: 15,	
    textAlign: "center",	
	alignSelf: "center",
	color: "white",
  },
  heading3: {
    fontSize: 17.5,
	fontWeight: "bold",
    textAlign: "center",	
	color: "black",
	marginTop: 10,
	marginBottom: 10,
	justifyContent: 'center',
	textAlignVertical: 'center',
  },
  flexRow: {
    flexDirection: "row"
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    padding: 10
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8
  },
  ServiceIcon: {
	height: 130,
	width: 90,
	marginHorizontal: 10	,
	backgroundColor: '#f0f0f0',
	borderRadius: 10,
	shadowColor: "#000",
	shadowOffset: {
		width: 0,
		height: 4,
	},
	shadowOpacity: 1,
	shadowRadius: 9.51,
	elevation: 15,
	justifyContent: 'center'
  }
});