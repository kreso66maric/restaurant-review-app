import React, { Component } from 'react';

import RestaurantMarker from '../../img/restaurantMarker.png';
import './AddRestaurant.css';
import NoImgAvailable from '../../img/headerImg.jpeg';

class AddRestaurant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coords: {lat: 0, lng: 0},
            address: '',
            placesID: false,
            nameValue: '',
            avgRating: 0,
            marker: []
        }

        this.submitRestaurant = this.submitRestaurant.bind(this);
		this.getCoordinates = this.getCoordinates.bind(this);
		this.nameChange = this.nameChange.bind(this);
		this.setCoordinates = this.setCoordinates.bind(this);
        this.cancelSubmit = this.cancelSubmit.bind(this);
        this.ratingChange = this.ratingChange.bind(this);
    }

    nameChange(event) {
        // Update state when user enters value
        this.setState({
            nameValue: event.target.value
        });
    }

    ratingChange(event) {
        this.setState({
            avgRating: event.target.value
        })
    }

    getCoordinates() {
        // Variables for coordinates
        let map = this.props.map;
        let setCoordinates = this.setCoordinates;
        let coords = [];
        let geoResult;
        let marker;
        let thisRef = this;
        // Geocoder
        let geocoder = new window.google.maps.Geocoder();
        // Change cursor to crosshair
        map.setOptions({draggableCursor: 'crosshair'});
        // Add click listener on map
        map.addListener('click', function(event) {
            coords.lat = event.latLng.lat();
            coords.lng = event.latLng.lng();
            // Remove click listener after click happens
            window.google.maps.event.clearListeners(map, 'click');
            // Change cursor back to default
            map.setOptions({draggableCursor: null});
            // Add marker to show new restaurant on map
            marker = new window.google.maps.Marker({
                position: {lat: event.latLng.lat(), lng: event.latLng.lng()},
                map: map,
                icon: RestaurantMarker,
                animation: window.google.maps.Animation.DROP
            });

            // Push marker to state
            thisRef.setState(prevState => ({
                marker: prevState.marker.concat(marker)
            }));
            

            // Get address of coordinates through Geocoder
            geocoder.geocode({location: coords}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        // Create object from first result
                        geoResult = {
                            address: results[0].formatted_address,
                            placesID: results[0].place_id
                        };
                        // Set coords and PlacesID of a new marker
                        setCoordinates(geoResult, coords);
                        // Error message if there in no results
                    } else {
                        window.alert('No results found.');
                    }
                    // Error message if conection status fails
                } else {
                    window.alert('Geocoder failed to work.')
                }
            });
        });
    }

    // Set result of coords to state
    setCoordinates(geoResult, coords) {
        this.setState({
            coords: coords,
            address: geoResult.address,
            placesID: geoResult.placesID
        });
    }

    //Submit user restaurant
    submitRestaurant() {
        // New restaurant object
        let userRestaurant = {
            // Values for RestaurantListing, RestaurantDetails and RestaurantMarker
            title: this.state.nameValue,
            address: this.state.address,
            phone: '(01) 837 9686',
            website: null,
            openNow: null,
            hours: null,
            avgRating: this.state.avgRating,
            totalRatings: 0,
            placeReviews: [],
            userReviews: [],
            id: this.state.placesID ? this.state.placesID : this.props.counter,
            lat: this.state.coords.lat,
            lng: this.state.coords.lng,
            photo: NoImgAvailable,
            userAdded: true
        };
        // Pass userRestaurant to SidePanel
        this.props.handleSubmit(userRestaurant);
    }

    // Cancel adding new restaurant
    cancelSubmit() {
        this.props.handleCancel();
    }

    render() {
        return (
            <div className="AddRestaurant">
                <h3 className="AddRestaurant-title">Add Restaurant</h3>
                <p className="AddRestaurant-name">Restaurant Name</p>
                <input
                    type="text"
                    className="AddRestaurant-name-input"
                    label="Name of restaurant"
                    value={this.state.nameValue}
                    onChange={this.nameChange}
                    size="30"
                    required
                 />

                    <p className="AddRestaurant-rating">Rating</p>
				<select id="rating" name="rating" required onChange={this.ratingChange}>
                    <option name="rating" value="0" id="1" >--Rate Restaurant--</option>
  					<option name="rating" value="1" id="1" >1 Star</option>
  					<option name="rating" value="2" id="2" >2 Stars</option>
  					<option name="rating" value="3" id="3" >3 Stars</option>
  					<option name="rating" value="4" id="4" >4 Stars</option>
  					<option name="rating" value="5" id="5" >5 Stars</option>
				</select> 

                 <input
                    className="AddRestaurant-address-input"
                    value={this.state.address}
                    required
                    readOnly
                    size="30"
                    placeholder="See instructions below"
                  />

                <p className="AddRestaurant-address-instructions">
                      Click the "Set Coordinates" button, then click a location on the map to get the address
                </p>
                <button 
                    className="AddRestaurant-coords-button"
                    onClick={this.getCoordinates}>Get Coordinates</button>

                <div className="AddRestaurant-action-buttons">
                    <button 
                        className="AddRestaurant-submit-button" 
                        onClick={this.submitRestaurant}>Submit</button>

                    <button
                        className="AddRestaurant-cancel-button"
                        onClick={this.cancelSubmit}>Cancel</button>
                  </div>
            </div>
        )
    }
}

export default AddRestaurant;