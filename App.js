import React from 'react';
import * as SQLite from 'expo-sqlite';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';
import MerchantScreen from './screens/MerchantScreen';
import NotificationScreen from './screens/NotificationScreen';
import NotificationDetailScreen from './screens/NotificationDetailScreen';

const db = SQLite.openDatabase("db.db");

const MyStackNavigator = createStackNavigator(
	{
	  Home: {screen: HomeScreen},
	  Account: {screen: AccountScreen},
	  Merchant: {screen: MerchantScreen},
	  Notification: {screen: NotificationScreen},
	  NotificationDetail: {screen: NotificationDetailScreen},
	}  
);

const AppContainer = createAppContainer(MyStackNavigator);


export default class App extends React.Component {
	  
	render() {
		return <AppContainer />;
	}
}
