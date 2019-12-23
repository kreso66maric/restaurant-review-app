import React, { Component } from "react";

import RestaurantListing from "../RestaurantListing/RestaurantListing";
import RestaurantDetails from "../RestaurantDetails/RestaurantDetails";
import "./RestaurantPanel.css";


let restaurantsArray = [];


class RestaurantPanel extends Component {
	constructor (props) {
		super(props);
		this.state = {
			viewList: true,
			map: true,
			detailPanel: null
		}

	
		this.placesDetailsReq = this.placesDetailsReq.bind(this);
		this.createList = this.createList.bind(this);
		this.closeDetails = this.closeDetails.bind(this);
		this.returnPlace = this.returnPlace.bind(this);
		this.userAddedDetailsRequest = this.userAddedDetailsRequest.bind(this);
		this.pushNewReview = this.pushNewReview.bind(this);
	}

	// Push new user review from RestaurantDetails to SidePanel
	pushNewReview(restaurantID, userReview) {
		this.props.pushNewReview(restaurantID, userReview);
	}
	
	// Create RestaurantDetails
	returnPlace(place, status) {
		let selectedPlace;
		let matchedRestaurant;

		// If API returns result
		if (status === window.google.maps.places.PlacesServiceStatus.OK) {
			// Get open status
			let openNow;
			if (place.opening_hours) {
				openNow = place.opening_hours.isOpen;
			} else {
				openNow = false;
			};

			// Get opening hours
			let weekdayHours;
			if (place.opening_hours && place.opening_hours.weekday_text) {
				weekdayHours = place.opening_hours.weekday_text;
			} else {
				weekdayHours = "No operating hours available";
			};

			// If no reviews exist, return empty array
			let placeReviews;
			let placeAvgRating;

			if (place.reviews) {
				placeReviews = place.reviews;
				placeAvgRating = place.rating;
			} else {
				placeReviews = [];
				placeAvgRating = 0;
			};


			// Create object of Google Place details
		   	selectedPlace = {
	   			title: place.name,
	   			address: place.vicinity,
	   			phone: place.formatted_phone_number,
	   			website: place.website,
	   			openNow: openNow,
	   			hours: weekdayHours,
	   			avgRating: placeAvgRating,
	   			lat: place.geometry.location.lat(),
	   			lng: place.geometry.location.lng(),
	   			restaurantID: place.place_id,
	   			placeReviews: placeReviews
		   	};
		} else {
		// If no Places result returned, use previous info and show message
			console.log("No details found!");
		}

		// run find on props array to find first match via place.place_id
		matchedRestaurant = this.props.restaurants.find( restaurant => restaurant.id === place.place_id);

		// Create <RestaurantDetails /> component with Place details
		let detailPanel = <RestaurantDetails 
			title={selectedPlace.title}
			phone={selectedPlace.phone}
			avgRating={selectedPlace.avgRating}
			address={selectedPlace.address}
			website={selectedPlace.website}
			openNow={selectedPlace.openNow}
			hours={selectedPlace.hours}
			placeReviews={selectedPlace.placeReviews}
			userReviews={matchedRestaurant.userReviews}
			lat={selectedPlace.lat}
			lng={selectedPlace.lng}
			restaurantID={selectedPlace.restaurantID}
			handleClose={this.closeDetails} 
			passReview={this.pushNewReview}
		/>

		// Set state of viewList to false
		this.setState({
			viewList: false,
			detailPanel: detailPanel
		});

		// Change view in parent component
		this.props.handleClick();
	}


	userAddedDetailsRequest (id) {
		// Find user restaurant from props array whose ID matches clicked listing
		function matchID(restaurant) {
			return restaurant.id === id;
		}
		// Set matched restaurant to var
		let selectedPlace = this.props.restaurants.find(matchID);

		// Create <RestaurantDetails /> component with Place details
		let detailPanel = <RestaurantDetails 
			title={selectedPlace.title}
			phone={selectedPlace.phone}
			avgRating={selectedPlace.avgRating}
			address={selectedPlace.address}
			website={selectedPlace.website}
			openNow={selectedPlace.openNow}
			hours={selectedPlace.hours}
			placeReviews={selectedPlace.placeReviews}
			userReviews={selectedPlace.userReviews}
			lat={selectedPlace.lat}
			lng={selectedPlace.lng}
			handleClose={this.closeDetails} 
			restaurantID={id}
			passReview={this.pushNewReview}
		/>;

		// Set state of viewList to false
		this.setState({
			viewList: false,
			detailPanel: detailPanel

		});
		// Change view in parent component
		this.props.handleClick();
	}


	closeDetails() {
		// Set state of viewList to true
		this.setState({
			viewList: true
		});
		// Change view in parent component when clicked on return button
		this.props.closeDetails();
	}

	// Submit places details request
	placesDetailsReq(id, userAdded) {
		// If restaurant is NOT created by user
		if (userAdded === false) {
			// set request details for Places API, passing in ID of clicked restaurant
			var request = {
	 			placeId: id,
	  			fields: ['name', 'rating', 'formatted_phone_number', 'vicinity', 'opening_hours', 'reviews', 'website', 'geometry', 'place_id']
			};

			// make request to Places API, and call returnPlace() when ready
			let service = new window.google.maps.places.PlacesService(this.props.map);
			service.getDetails(request, this.returnPlace);
		// Else do not submit Places Details request
		} else {
			this.userAddedDetailsRequest(id);
		}
	}


	createList() {
		// Create array of <RestaurantListing /> from props array
		if (this.props.restaurants.length > 0) {
			restaurantsArray = this.props.restaurants.map( restaurant => {
				return <RestaurantListing 
					key={restaurant.id}
					title={restaurant.title}
					avgRating={restaurant.avgRating}
					address={restaurant.address}
					placesID={restaurant.id}
					openNow={restaurant.openNow}
					photo={restaurant.photo}
					userAdded={restaurant.userAdded}
					handleClick={this.placesDetailsReq}
				/>	
			});
		} else {
			// Define array as loading message
			restaurantsArray = 
			<div className="restaurantPanel-noRestaurant" >
					<p className="restaurantPanel-noRestaurant-message">
						Loading Restaurants <span className="loading-dots"></span>
					</p>
					<p className="restaurantPanel-noLocationService-message"></p>
			</div>
		}
	}



	render() {
		this.createList();
		// Return either <RestaurantListing /> array or selected <RestaurantDetails />
		return (
			<div id="restaurantPanel">
				{this.state.viewList 
				?
				restaurantsArray 
				:
				this.state.detailPanel
				}
			</div>
		);
	}
}

export default RestaurantPanel;
