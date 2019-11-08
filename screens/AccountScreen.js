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
	static navigationOptions = { title: 'Account' };
	
	constructor(props){
		super(props);
		this.state = {
			CustomerInfoList : [],
			AccountInfoList : []
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
				`select * from CustomerInfo;`,
				[],
				(_, { rows: { _array } }) => this.setState({ CustomerInfoList: _array })
				);
		});
		
		db.transaction(tx => {
			tx.executeSql(
				`select * from AccountInfo;`,
				[],
				(_, { rows: { _array } }) => this.setState({ AccountInfoList: _array })
				);
		});
	}
	
	render() {
		
		return ( 		
	  
		  <View style={styles.container}>
			
			<Text style={{fontSize: 25,fontWeight: "bold",textAlign: "center",color: "white",marginTop: 20,marginBottom: 10}}>Account Information</Text>
			
			<ScrollView style={styles.listArea}>
			
				<View
					style = {{
					flexDirection: 'row',
				}}>
					<View 
						style={{
						padding: 10,
						marginTop: 5,
						marginBottom: 5,
						marginLeft: 5,
						backgroundColor: 'rgba(240, 240, 240, 0.8)',
						borderRadius: 20,
						shadowColor: "#000",
						shadowOffset: {width: 0,height: 12},
						shadowOpacity: 0.58,
						shadowRadius: 16,
						elevation: 24,
						justifyContent: 'center'
					}}>
						<Avatar
							rounded
							size = "large"
							alignSelf = "center"
							source={require('./../assets/images/avatargirl.jpg')}
						/>
						
						{	
							
							this.state.CustomerInfoList.map(({ id, EnterpriseID, CustomerName, Gender, Priority, DoB, PoB  }) => (
								<View key = {id} style = {{margin:5}}>
									<Text style = {{marginTop : 5, marginBottom : 2}}> Enterprise ID </Text>
									<TouchableOpacity style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {EnterpriseID} </Text>
									</TouchableOpacity>
									
									<Text style = {{marginTop : 5, marginBottom : 2}}> Customer Name </Text>
									<TouchableOpacity style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {CustomerName} </Text>
									</TouchableOpacity>
									
									<Text style = {{marginTop : 5, marginBottom : 2}}> Gender </Text>
									<TouchableOpacity style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {Gender} </Text>
									</TouchableOpacity>
									
									<Text style = {{marginTop : 5, marginBottom : 2}}> Priority Status </Text>
									<TouchableOpacity style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {Priority} </Text>
									</TouchableOpacity>
									
									<Text style = {{marginTop : 5, marginBottom : 2}}> DoB </Text>
									<TouchableOpacity style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {DoB} </Text>
									</TouchableOpacity>
									
									<Text style = {{marginTop : 5, marginBottom : 2}}> PoB </Text>
									<TouchableOpacity style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {PoB} </Text>
									</TouchableOpacity>
									 
								</View>
							))
						}
					
					</View>
					
					<View style = {{marginLeft: 20, marginRight: 10, paddingRight: 5}}>
			
						{	
							
							this.state.AccountInfoList.map(({ id, EnterpriseID, SourceSystem, CIFID, AccountID, AccountBalance  }) => (
								<View key = {id} style = {{margin:5}}>
									<Text style = {{fontWeight: 'bold', fontSize: 12, marginTop : 7, marginBottom : 2, color: "white"}}> {SourceSystem} </Text>
									
									<View style ={{flexDirection:'row'}}>
										<View>
											<Text style = {{marginTop : 3, marginBottom : 1, color: 'white'}}> CIF ID </Text>
											<View style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
												<Text> {CIFID} </Text>
											</View>
										</View>
										
										<View>
											<Text style = {{marginTop : 3, marginBottom : 1, color: 'white'}}> Account ID </Text>
											<View style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
												<Text> {AccountID} </Text>
											</View>
										</View>	
									</View>
									
									<Text style = {{marginTop : 3, marginBottom : 1, color: 'white'}}> {(SourceSystem == 'Cardlink') ? 'Available Limit':'Available Balance'} </Text>
									<View style={{backgroundColor: "#fff",borderColor: "#000",borderWidth: 1, padding: 5}}>
										<Text> {AccountBalance} </Text>
									</View>	
									
								</View>
							))
						}
					</View>
					
				</View>
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
  flexRow: {
    flexDirection: "row"
  },
  listArea: {
    //backgroundColor: "#f0f0f0",
	backgroundColor: "#044e94",
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