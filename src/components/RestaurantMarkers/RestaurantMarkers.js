import React, { Component } from 'react';

import restaurantMarker from '../../img/restaurantMarker.png';
import '../../components/InfoWindow.css';


class RestaurantMarkers extends Component {
	constructor (props) {
		super(props);
		// State
		this.state = {
			displayMarkers: true,
			restaurantMarkersArray: []
		}
	
		// Bindings
		this.createMarkers = this.createMarkers.bind(this);
	}

	createMarkers () {
		// Array of markers from props
		let restaurantMarkersArray = this.props.restaurants.map( restaurant => {
			// New marker object for each restaurant in props
			let marker = new window.google.maps.Marker({
	    		position: {lat: restaurant.lat, lng: restaurant.lng},
	    		map: this.props.map,
				icon: restaurantMarker,
	    		avgRating: restaurant.avgRating,
	    		id: restaurant.id,
				title: restaurant.title,
			});
			
			// New InfoWindow with content
			let infoWindow = new window.google.maps.InfoWindow({
				content: 
				'<div class="InfoWindow">' + 
					'<h3 class="InfoWindow-title">' + restaurant.title +'</h3>' +
					'<h4 class="InfoWindow-address">' + restaurant.address + '</h4>' +
					'<span class="InfoWindow-rating"> Rating: ' + restaurant.avgRating + '<i class="fas fa-star"></i></span>' +
				'</div>'
			});
			
			// Storing reference to map for marker listeners
			let markerMap = this.props.map;
			// Adding click listener to markers
			marker.addListener("click", function() {
				infoWindow.open(markerMap, this);
			});
			// Return marker for reference
			return marker;
		});
		
		// Set restaurantMarkersArray to state
		this.setState({restaurantMarkersArray: restaurantMarkersArray});	

		
	}


	componentDidUpdate (prevProps) {
		// If this.props.restaurants has updated
		if (prevProps.restaurants !== this.props.restaurants) {
			
			// Remove any previous markers from map and rerun createMarkers()
			if (this.state.restaurantMarkersArray.length > 0) {
				for (let i = 0; i < this.state.restaurantMarkersArray.length; i++) {
					this.state.restaurantMarkersArray[i].setMap(null);
				}
				this.createMarkers();
			// Else rerun createMarkers()
			} else {
				this.createMarkers();
			}
		}
	}


	render () {	
		return (
			<div>{null}</div>
			);
	}
}


export default RestaurantMarkers;
