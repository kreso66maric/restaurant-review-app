import React, { Component } from "react";

import HeaderImg from '../../img/hero.jpeg';
import AddReview from '../AddReview/AddReview';
import ReviewPanel from "../ReviewPanel/ReviewPanel";
import noStreetView from "../../img/noStreetView.jpeg";
import "./RestaurantDetails.css";


class RestaurantDetails extends Component {
	constructor (props) {
		super(props);
		this.state = {
			beenModified: false,
			modifiedReviews: [],
			avgRating: 0,
			streetViewURL: "",
			viewReviewPanel: true,
			viewRestaurantDetials: true
		};

		this.getStreetView = this.getStreetView.bind(this);
		this.openNewReview = this.openNewReview.bind(this);
		this.submitReview = this.submitReview.bind(this);
		this.cancelReview = this.cancelReview.bind(this);
	}

	// Show user review
	openNewReview () {
		// Update state to show NewReview
		this.setState({
			viewRestaurantDetials: false,
			viewReviewPanel: false,
			streetViewURL: HeaderImg
		});
	}

	// Cancel user review
	cancelReview () {
		this.setState({
			viewReviewPanel: true,
			viewRestaurantDetials: true
		});
	}

	// Submit review and change view state
	submitReview (userReview) {
		// Pass restaurantID and userReview up to <RestaurantPanel />
		let restaurantID = this.props.restaurantID;
		this.props.passReview(restaurantID, userReview);
		
		// Update state to show <ReviewPanel />
		this.setState({
			viewReviewPanel: true,
			viewRestaurantDetials: true
		});
	}

	// Street view static photo
	getStreetView() {
		// Get lat and lng from props
		let lat = this.props.lat;
		let lng = this.props.lng;
		let API_KEY = '&key=AIzaSyBBdViqGHB5is7ugGmTAsWBN1yofb5PiMo'; 

		// Set URL for streetview metadata
		let streetViewURL;
		let streetViewStatus = "https://maps.googleapis.com/maps/api/streetview/metadata?location=" +
			lat + "," + lng + "&fov=120&heading=235&pitch=10&pano" +
			API_KEY;

		// Get status from streetView API
		fetch(streetViewStatus)
			.then(response => response.json())
			.then(data => {
				// Define image URL as streetView image
				if ( data.status === "OK") {
					// Define image URL as streetView image
					streetViewURL = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" +
						lat + "," + lng + "&fov=120&heading=235&pitch=10&pano" +
						API_KEY;
						// If no streetView image exists, replace with substitution
				} else {
					streetViewURL = noStreetView;
				}
			})
			// Push result to state
			.then( () => {
				this.setState({
					streetViewURL: streetViewURL
				});
			});
	}


	componentDidMount () {
		this.getStreetView();
	}


	render() {
		return (
			<div className="RestaurantDetails">
				<div className="RestaurantDetails-top-info">
					<div 
						className="RestaurantDetails-top-info-photo-box" 
						style={{backgroundImage: "url(" + this.state.streetViewURL + ")"}}>
					</div>

					<div className="RestaurantDetails-top-info-container">
						<h3 className="RestaurantDetails-top-info-title">{this.props.title}</h3>
						<span 
							className="RestaurantDetails-top-info-rating">
								Rating:  {Math.round(this.props.avgRating)} 
							<i className="fas fa-star"></i>
						</span> 

						<div onClick={this.props.handleClose} >
							<i className="fas fa-arrow-circle-left"></i>
						</div>
					</div>
				</div>

				{this.state.viewRestaurantDetials && 
				<div className="RestaurantDetails-details">
					<div className="RestaurantDetails-details-address">
						<i className="fas fa-map-marked-alt details-icons"></i>
						<p>{this.props.address}</p>
					</div>

					<div className="RestaurantDetails-details-phone">
						<i className="fas fa-phone details-icons"></i>
						<p>{this.props.phone}</p>
					</div>

					<div className="RestaurantDetails-details-website">
						<i className="fas fa-link details-icons"></i>
						{this.props.website 
						?
						<p>
							<a href={this.props.website}>Website</a>
						</p>
						:
						<p>No Website yet</p>
						}
					</div>


					<div className="RestaurantDetails-details-open-status">
						<i className="fas fa-clock details-icons"></i>
						{this.props.isOpen 
							? 
						<div className="RestaurantDetails-details-open">OPEN</div> 
							:
							<div className="RestaurantDetails-details-closed">CLOSED</div>
						}
					</div>


					<div className="RestaurantDetails-details-operating-hours">
						<div className="RestaurantDetails-details-hours-label">
							HOURS
						</div>
					
						{this.props.hours 
						?
						<div className="RestaurantDetails-details-hours" >
							<ul>
								<li>{this.props.hours[0]}</li>
								<li>{this.props.hours[1]}</li>
								<li>{this.props.hours[2]}</li>
								<li>{this.props.hours[3]}</li>
								<li>{this.props.hours[4]}</li>
								<li>{this.props.hours[5]}</li>
								<li>{this.props.hours[6]}</li>
							</ul>
						</div> 
						:
						<p>No hours available</p>
						}
					</div>
				</div>
			
				}

				{this.state.viewReviewPanel 
				? 
				<div className="RestaurantDetails-reviews">
					<div className="RestaurantDetails-reviews-add-review-button">
						<button  className="RestaurantDetails-reviews-button"onClick={this.openNewReview}>ADD REVIEW</button>
					</div>

					<ReviewPanel allReviews={this.props.userReviews.concat(this.props.placeReviews)} /> 
				</div>
				:
				<AddReview handleSubmit={this.submitReview} cancelSubmit={this.cancelReview}/> 
				}
			</div>
		);
	}
}



export default RestaurantDetails;
