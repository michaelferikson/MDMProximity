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

const db = SQLite.openDatabase("db.db");

export default class HomeScreen extends React.Component {
	static navigationOptions = { header: null }
	
	constructor(props){
		super(props);
		this.state = {
			MerchantLocationListArray : [],
			MerchantLocationListArrayNear : [],
			location: null,
			errorMessage: null,
			LastMerchantID : -1,
			CurrentMerchantID : -1,
			finalMerchant : null,
			finalLatitude : null,
			finalLongitude : null,
			PromoMessage: null,
			PromoMerchantID: null,
			clatitude: 0,
			clongitude: 0,
			notification: 0,
			PromoDate: null,
		};
		this._isMounted = false;
	}
	
	componentWillMount() {
		this._isMounted = false;
	}
	
	componentDidMount() {
		this._isMounted = true;

	  	Notifications.createChannelAndroidAsync('chat-messages', {
			name: 'Chat messages',
			sound: true,
			priority: 'max',
			vibrate: [0, 250, 250, 250],
		});
		
		db.transaction(tx => {
			tx.executeSql("delete from MerchantLocationList");
		});
		
		db.transaction(tx => {
			tx.executeSql("delete from MerchantLocationListNear");
		});
		
		db.transaction(tx => {
			tx.executeSql("delete from CustomerInfo");
		});
		
		db.transaction(tx => {
			tx.executeSql("delete from AccountInfo");
		});
		
		db.transaction(tx => {
			tx.executeSql("delete from NotificationMessage");
		});

		db.transaction(tx => {
			tx.executeSql("VACUUM");
		});

		db.transaction(tx => {
			tx.executeSql(
			"create table if not exists MerchantLocationList (id integer primary key not null, MerchantName text, Promo text, latitude float, longitude float);"
			);
		});
		
		db.transaction(tx => {
			tx.executeSql(
			"create table if not exists MerchantLocationListNear (id integer primary key not null, MerchantName text, Promo text, latitude float, longitude float);"
			);
		});
		
		db.transaction(tx => {
			tx.executeSql(
			"create table if not exists CustomerInfo (id integer primary key not null, EnterpriseID text, CustomerName text, Gender text, Priority text, DoB text, PoB text);"
			);
		});
		
		db.transaction(tx => {
			tx.executeSql(
			"create table if not exists AccountInfo (id integer primary key not null, EnterpriseID text, SourceSystem text, CIFID text, AccountID text, AccountBalance text);"
			);
		});
		
		db.transaction(tx => {
			tx.executeSql(
			"create table if not exists NotificationMessage (id integer primary key not null, PromoMerchantID integer, PromoMessage text, PromoDate text);"
			);
		});
		
		db.transaction(tx => {
			tx.executeSql("insert into MerchantLocationList (MerchantName, Promo, latitude, longitude) values ('Fore SCBD', 'Fore SCBD Discount 30% with BRI Credit Card', -6.226652, 106.810145), ('Fore Plaza Indonesia', 'Fore Plaza Indonesia Discount 30% with BRI Credit Card', -6.193764, 106.821853), ('Fore Senayan', 'Fore Senayan Discount 30% with BRI Credit Card',-6.233615, 106.792934)");
		});	
		
		db.transaction(tx => {
			tx.executeSql("insert into CustomerInfo (EnterpriseID, CustomerName, Gender, Priority, DoB, PoB) values ('235957..4969821', 'Wulan', 'Female' , 'Priority', '1 Januari 1995', 'Ujung Pandang')");
		});
		
		db.transaction(tx => {
			tx.executeSql("insert into AccountInfo (EnterpriseID, SourceSystem, CIFID, AccountID, AccountBalance) values ('..04969821', 'Saving', 'A889101' , '..054682', '1.000.000.000'), ('..04969821', 'Deposito', 'A889101' , '..879813', '125.000.000'), ('..04969821', 'Cardlink', 'A889102' , '..879892', '20.000.000')");
		});
		
	}
	
	findCurrentLocationAsync = async () => {
		if (this._isMounted){
			let { status } = await Permissions.askAsync (Permissions.LOCATION);
			if (status !== 'granted'){
				this.setState ({
					errorMessage: 'Permission to access location was denied'
				})
			}
			
			let location = await Location.getCurrentPositionAsync({});
			this.setState({ location });
		}
	}
	
	/*handleNote = () => {
		Notifications.cancelAllScheduledNotificationsAsync();
	}*/
	
	scheduleNotification = async (PromoMessage) => {		
		//this.handleNote();

		if (this._isMounted){
			let notificationId = Notifications.presentLocalNotificationAsync(
				{
					title: "BRI - Merchant Promo!",
					body: PromoMessage ,
					sound: true,
					sticky: false,
					vibrate: true,
					ios: {
						sound: true 
					 },
					 android: {
						channelId: 'chat-messages',
						sound: true,
						priority: 'max',
						vibrate: [0, 250, 250, 250],
					}
				});
			console.log(PromoMessage);
			console.log(this.state.PromoMerchantID);
		}
	};
	
	
	deg2Rad = (deg) => {
		return deg * Math.PI / 180;
	}

	pythagorasEquirectangular = (lat1, lon1, lat2, lon2) => {
		lat1 = this.deg2Rad(lat1);
		lat2 = this.deg2Rad(lat2);
		lon1 = this.deg2Rad(lon1);
		lon2 = this.deg2Rad(lon2);
		const R = 6371;
		const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
		const y = (lat2 - lat1);
		const d = Math.sqrt(x * x + y * y) * R;
		return d;
	}

	nearestCity = (clatitude, clongitude) => {
		db.transaction(tx => {
			tx.executeSql(
				`select * from MerchantLocationList;`,
				[],
				(_, { rows: { _array } }) => this.setState({ MerchantLocationListArray: _array }));
		})
		
		db.transaction(tx => {
			tx.executeSql("delete from MerchantLocationListNear");
		});
	
		db.transaction(tx => {
			tx.executeSql("VACUUM");
		});
		
		let mindif = 99999;
		let closest = 0;
		let dif;
		
		this.state.MerchantLocationListArray.map( ({ id, MerchantName, Promo, latitude, longitude  }) => {
			dif = this.pythagorasEquirectangular (clatitude, clongitude, latitude, longitude);
			if (dif < mindif) {
				closest = id;
				mindif = dif;
				this.state.finalMerchant = MerchantName;
				this.state.finalLatitude = latitude;
				this.state.finalLongitude = longitude;
				this.state.PromoMessage = Promo;
				this.state.PromoMerchantID = id;
			}
		})
		
		db.transaction(tx => {
			tx.executeSql("insert into MerchantLocationListNear (MerchantName, Promo, latitude, longitude) select MerchantName, Promo, latitude, longitude from MerchantLocationList where id = ?", [closest]);
		});
		
		db.transaction(tx => {
			tx.executeSql(
				`select * from MerchantLocationListNear;`,
				[],
				(_, { rows: { _array } }) => this.setState({ MerchantLocationListArrayNear: _array })
			 );
		})
		
		if(this.state.clatitude != 0) {this.state.CurrentMerchantID = closest;};
	}
	
	saveNotification = (PromoMerchantID, PromoMessage) => {
		var date = new Date().getDate(); //Current Date
		var month = new Date().getMonth() + 1; //Current Month
		var year = new Date().getFullYear(); //Current Year
		var hours = new Date().getHours(); //Current Hours
		var min = new Date().getMinutes(); //Current Minutes
		var datetime = date + '/' + month + '/' + year + ' ' + hours + ':' + min;

		db.transaction(tx => {
			tx.executeSql("insert into NotificationMessage (PromoMerchantID, PromoMessage, PromoDate) values (?,?,?)", [PromoMerchantID, PromoMessage, datetime]);
		});
		this.state.PromoDate = datetime;
	}
		
	render() {		
		{
			if (this.state.errorMessage) {
				this.state.clatitude = this.state.errorMessage;
				this.state.clongitude = this.state.errorMessage;
			} else if (this.state.location) {
				this.state.clatitude = this.state.location.coords.latitude;
				this.state.clongitude = this.state.location.coords.longitude;
			};
			
			if (this.state.LastMerchantID != this.state.CurrentMerchantID) {
				this.state.LastMerchantID = this.state.CurrentMerchantID;
				if (this.state.PromoMessage != null) {
					this.scheduleNotification(this.state.PromoMessage);
					this.saveNotification(this.state.PromoMerchantID, this.state.PromoMessage);
				};
			};
			
			this.findCurrentLocationAsync();
			this.nearestCity(this.state.clatitude, this.state.clongitude);
		}
		
		return ( 		
	  
		  <View style={styles.container}>
			<View
				style={{
				  flexDirection: 'row',
				  marginTop: 30,
				}}
			>
				<View style = {{flex: 0.15}}/>
				
				<View style = {{flex: 0.7, marginTop: 10}}> 
					<Image style={styles.welcomeImage} source={require('./../assets/images/bankbri.png')} /> 
				</View>
				
				<TouchableOpacity style = {{flex: 0.15}}
						onPress={() => this.props.navigation.navigate('Notification', {
								PromoMessage: this.state.PromoMessage,
								PromoMerchantID : this.state.PromoMerchantID,
								PromoDate: this.state.PromoDate
							})
						}
					>
					<Image style={{
						width: 30,
						height: 30,
						marginTop: 10,
						alignSelf: 'flex-end',
						marginRight: 15,
					 }} source={require('./../assets/images/notification_none.png')} />
				</TouchableOpacity>
			</View>	
			
			<View
				style={{
				  flexDirection: 'row',
				  marginRight: 10,
				  marginLeft: 10,
				  marginTop: 10,
				  marginBottom: 10,
				  padding: 10,
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
				  source={require('./../assets/images/avatargirl.jpg')}
				/>
				
				<View style = {{marginLeft: 10}}>
					<Text style={{fontSize: 20,fontWeight: "bold",textAlign: "center",color: "black",marginBottom: 10}}> Hi, Wulan ! </Text>
					<Text style={{fontSize: 14,textAlign: "center",alignSelf: "center",color: "black"}}>  It's bright sunshine here in Jakarta </Text>
					
					<Text style={{fontSize: 14,textAlign: "center",alignSelf: "center",color: "black"}}> {(this.state.clatitude).toFixed(8) + " , " + (this.state.clongitude).toFixed(8) }</Text>
				</View>
			</View>
			
			<ScrollView style={{marginTop: 20}}>
				<View
					style={{
					  flexDirection: 'row',
					  justifyContent: 'center',
					  marginVertical: 10,
				}}>
					<TouchableOpacity 
						style={styles.ServiceIcon}
						onPress={() => this.props.navigation.navigate('Account')}
					>
						<Image style={{
							resizeMode: 'stretch',
							height: 60,
							width: 60,
							alignSelf: 'center'
						 }} source={require('./../assets/images/accounts.png')} />
						<Text style={{fontSize: 15,fontWeight: "bold",textAlign: "center", marginTop:10}}> Account </Text>
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.ServiceIcon}>
						<Image style={{
							resizeMode: 'stretch',
							height: 60,
							width: 60,
							alignSelf: 'center'
						 }} source={require('./../assets/images/transfer.png')} />
						<Text style={{fontSize: 15,fontWeight: "bold",textAlign: "center", marginTop:10}}> Transfer </Text>
					</TouchableOpacity>
						 
					<TouchableOpacity style={styles.ServiceIcon}>
						<Image style={{
							resizeMode: 'stretch',
							height: 60,
							width: 60,
							alignSelf: 'center'
						 }} source={require('./../assets/images/apply.png')} />
						<Text style={{fontSize: 15,fontWeight: "bold",textAlign: "center", marginTop:10}}> Apply </Text>
					</TouchableOpacity>
					 
				</View>
				
				<View
					style={{
					  flexDirection: 'row',
					  justifyContent: 'center',
					  marginVertical: 10,
					  paddingBottom: 10
				}}>
					<TouchableOpacity style={styles.ServiceIcon} 
						onPress={() => this.props.navigation.navigate('Merchant', {
								finalMerchant: this.state.finalMerchant,
								finalLatitude: this.state.finalLatitude,
								finalLongitude: this.state.finalLongitude,
								LastMerchantID: this.state.LastMerchantID,
								CurrentMerchantID: this.state.CurrentMerchantID,
								PromoMessage: this.state.PromoMessage,
							})
						}
					>
						<Image style={{
							resizeMode: 'stretch',
							height: 60,
							width: 60,
							alignSelf: 'center'
						 }} source={require('./../assets/images/store.png')} />
						<Text style={{fontSize: 15,fontWeight: "bold",textAlign: "center", marginTop:10}}> Promos </Text>
					</TouchableOpacity>
					
					<TouchableOpacity style={styles.ServiceIcon}>
						<Image style={{
							resizeMode: 'stretch',
							height: 60,
							width: 60,
							alignSelf: 'center'
						 }} source={require('./../assets/images/linkaja.png')} />
						<Text style={{fontSize: 15,fontWeight: "bold",textAlign: "center", marginTop:10}}> LinkAja </Text>
					</TouchableOpacity>
						 
					<TouchableOpacity style={styles.ServiceIcon}>
						<Image style={{
							resizeMode: 'stretch',
							height: 60,
							width: 60,
							alignSelf: 'center'
						 }} source={require('./../assets/images/more.png')} />
						<Text style={{fontSize: 15,fontWeight: "bold",textAlign: "center", marginTop:10}}> More </Text>
					</TouchableOpacity>
					 
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
  welcomeImage: {
    height: 140,
	width: 140,
	resizeMode: 'stretch',
    alignSelf: 'center'
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
		height: 2,
	},
	shadowOpacity: 1,
	shadowRadius: 4,
	elevation: 10,
	justifyContent: 'center'
  }
});