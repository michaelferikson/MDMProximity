import React, {Component} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

class FindMe extends Component {
	state = {
		latitude : null,
		longitude : null,
		location : null,
		errorMessage: null
	};
	
	findCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition (
			position => {
				const latitude = JSON.stringify (position.coords.latitude);
				const longitude = JSON.stringify (position.coords.longitude);
				this.setState({
					latitude,
					longitude
				});
			},
			{ enableHighAccuracy: true, timeout : 20000, maximumAge: 1000 }
		)
	}
	
	findCurrentLocationAsync = async () => {
		let { status } = await Permissions.askAsync (Permissions.LOCATION);
		if (status !== 'granted'){
			this.setState ({
				errorMessage: 'Permission to access location was denied'
			})
		}
		
		let location = await Location.getCurrentPositionAsync({});
		this.setState({ location });
	}
	
	render () {
		let text = '';
		if (this.state.errorMessage) {
			text = this.state.errorMessage;
		} else if (this.state.location) {
			text = JSON.stringify (this.state.location);
		}
		return (
		<View>
			<TouchableOpacity onPress = {this.findCurrentLocationAsync}>
				<Text style={styles.heading}> Detect Location Now </Text>
				<Text style={styles.heading2}> {text} </Text>
			</TouchableOpacity>
		</View>
		);
	}
}

export default FindMe;

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",	
	color: "white"
  },
    heading2: {
    fontSize: 10,
    textAlign: "center",	
	color: "white"
  },
});