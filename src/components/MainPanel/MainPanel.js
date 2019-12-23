import React, {Component} from "react";

import Header from '../Header/Header';
import SidePanel from '../SidePanel/SidePanel';
import MapStyle from './MapStyle';
import userMarker from "../../img/userMarker.png"
import "./MainPanel.css";

let map, marker;

class MainPanel extends Component {
constructor (props) {
		super(props);
		// State
		this.state = {
			userPos: {},
			map: null,
			mapBounds: {},
			placesData : []
		};

		// Bindings
		this.initMap = this.initMap.bind(this);
		this.mapBoundsListener = this.mapBoundsListener.bind(this);
		this.fetchPlaces = this.fetchPlaces.bind(this);
		this.pushPlaces = this.pushPlaces.bind(this);
	}

	initMap() {
		let errorMessage = document.querySelector('.restaurantPanel-noLocationService-message');
		// Check to see if browser allows Geolocation
		if (navigator.geolocation) {
			// Assining user position to state
    		navigator.geolocation.getCurrentPosition( position => {   		
      			this.setState({
      				userPos : {
						lat: position.coords.latitude,
	        			lng: position.coords.longitude
					  },
				  });
				// New Google map placed in #MainPanel-map
			    map = new window.google.maps.Map(document.getElementById("MainPanel-map"), {
					center: this.state.userPos,
					zoom: 15,
					styles: MapStyle,
					scaleControl: true,
					streetViewControl: true
				});
				 

				// Add event listener for map bounds
				this.mapBoundsListener(map);

				// Create  user marker at user position in map
				marker = new window.google.maps.Marker({
					position: this.state.userPos,
					map: map,
					icon: userMarker,
					animation: window.google.maps.Animation.DROP
				});
				marker.addListener('click', () => {
					if (marker.getAnimation() !== null) {
						marker.setAnimation(null);
					} else {
						marker.setAnimation(window.google.maps.Animation.BOUNCE)
						setTimeout(() => {
							marker.setAnimation(null);
						}, 2000);
						marker.setMap(this.state.map)
					}
				});
				// Adding map to state
				this.setState({map: map});

			// Error handeling for geolocation
			}, (error) => {
				if (error.code === 0) {
					console.log('An unknown error occured.')
				} else if (error.code === 1) {
					console.log('User denied the request for Geolocation.')
				} else if (error.code === 2) {
					console.log('Location information is unavailable.')
				} else if (error.code === 3) {
					console.log('The request to get user location timed out.')
				}

				errorMessage.innerText = 'Please Enable Location Services.'
    		});

    	// If browser does not allow Geolocation, run error function
		} else {
			errorMessage.innerText = 'Browser does not allow Geolocation.'
		}
	}

	mapBoundsListener(map) {
		// Add event listener to update state of mapBounds when map is moved
		window.google.maps.event.addListener(map, 'idle', () => {
			this.setState({
				mapBounds: map.getBounds(),
			});
			// Call fetchPlaces() to get updated Google API data
			this.fetchPlaces();
		});
	}


	fetchPlaces() { 

		// Create request for Google Places based on current map bounds 
		let request = {
			bounds: this.state.mapBounds,
			type: ['restaurant'],
		};

		// Submit request and retrieving details about a place
		let service = new window.google.maps.places.PlacesService(this.state.map);
		service.nearbySearch(request, this.pushPlaces);
	}


	pushPlaces(results, status) {

		let resultsArray;

		// If there are results from the API request
		if (status === window.google.maps.places.PlacesServiceStatus.OK) {

			// Take results and create objects array
			resultsArray = results.map( result => {

				// Return restaurant object
				return {
					title: result.name,
					id: result.place_id,
					lat: result.geometry.location.lat(),
					lng: result.geometry.location.lng(),
					address: result.vicinity,
					avgRating: result.rating,
					openNow: result.opening_hours,
					placeReviews: [],
					userReviews: [],
					userAdded: false
				}
			});

			// Set updated array of restaurants to state
			this.setState({
				placesData: resultsArray
			});

		// If no results returned from API
		} else {
			resultsArray = [];
			this.setState({
				placesData: resultsArray
			});
		}
	}

	componentDidMount () {
		this.initMap();
	}

	render() {
		return (
			<div>
				<Header />
				<div id="MainPanel">
					<SidePanel
						restaurants={this.state.placesData}
						map={this.state.map}
						updatedMapBounds={this.state.mapBounds}
					/>
					<div id="MainPanel-map" ></div>
				</div>
			</div>
		);
	}
}

export default MainPanel;

