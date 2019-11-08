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
	static navigationOptions = { title: 'Promotion' };
	
	constructor(props){
		super(props);
		this.state = {
			MerchantLocationListArray2 : [],
			finalMerchant: this.props.navigation.getParam('finalMerchant'),
			finalLatitude: this.props.navigation.getParam('finalLatitude'),
			finalLongitude: this.props.navigation.getParam('finalLongitude'),
			LastMerchantID: this.props.navigation.getParam('LastMerchantID'),
			CurrentMerchantID: this.props.navigation.getParam('CurrentMerchantID'),
			PromoMessage: this.props.navigation.getParam('PromoMessage'),
			PromoMerchantID: this.props.navigation.getParam ('PromoMerchantID')
		};
		this._isMounted = false;
	};
	
	componentWillMount() {
		this._isMounted = false;
	}
	
	componentDidMount() {
		this._isMounted = true;
		
		db.transaction(tx => {
			tx.executeSql(
				`select * from MerchantLocationList;`,
				[],
				(_, { rows: { _array } }) => this.setState({ MerchantLocationListArray2: _array })
				);
		});
	}
	
	render() {
		
		return ( 		
	  
		  <View style={styles.container}>
			
			<Text style={{fontSize: 25,fontWeight: "bold",textAlign: "center",color: "white",marginTop: 30,marginBottom: 10}}>Promo List</Text>
			
			<ScrollView style={styles.listArea}>

				{
					this.state.MerchantLocationListArray2.map(({ id, MerchantName, Promo, latitude, longitude  }) => (
						<TouchableOpacity
							key={id}
							style={{
							  backgroundColor: "#fff",
							  borderColor: "#000",
							  borderWidth: 1,
							  padding: 8
							}}
						>
							<Text style={{ color : "#000", fontSize: 12}}>{MerchantName + ": " + latitude  + " , " + longitude} </Text>
							<Text style={{ color : "#000" }}>{Promo} </Text>
						</TouchableOpacity>
					))
				}
			</ScrollView>
			
			<Text style={styles.heading}>Promo Near Me !</Text>
						
			<ScrollView style={styles.listArea}>	

				<Text style={styles.heading3}> {this.state.finalMerchant}  </Text>
				<Text style={styles.heading3}> {"(" +this.state.finalLatitude  + " , " + this.state.finalLongitude + ")"}</Text>
				<Text> {"Last Nearest Merchant ID : " + this.state.LastMerchantID} </Text> 
				<Text> {"Current Nearest Merchant ID : " + this.state.CurrentMerchantID} </Text>
				
				<TouchableOpacity style = {{
					backgroundColor: "#fff",
					borderColor: "#000",
					borderWidth: 1,
					padding: 8,
					marginTop : 10}}>
					<Text style ={{fontWeight: 'bold'}}> {this.state.PromoMessage} </Text>
				</TouchableOpacity>
			</ScrollView>
			
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