import React, { Component } from "react";

import "./RestaurantListing.css";


class RestaurantListing extends Component {
	constructor (props) {
		super(props);
		this.state = {
		}

		this.deliverID = this.deliverID.bind(this);
	}

	deliverID() {
		// When clicked, deliver ID of restaurant to <RestaurantPanel />
		let id = this.props.placesID;
		let userAdded = this.props.userAdded;
		this.props.handleClick(id, userAdded)
	}


	render() {
		// Return restaurant info, with click handler that delivers ID
		return (
			<div 
				className="RestaurantListing" 
				onClick={this.deliverID}>
				<div className="RestaurantListing-details-box">
					<h3 className="RestaurantListing-details-title">{this.props.title}</h3>
					<span className="RestaurantListing-details-rating"> Rating: {this.props.avgRating} <i className="fas fa-star"></i> </span> 
					<p className="RestaurantListing-details-address">{this.props.address}</p>
					<p 
						className="RestaurantListing-details-openNow">
						{this.props.openNow 
						? <span className="RestaurantListing-details-open">Open</span> 
						: <span className="RestaurantListing-details-closed">Closed</span>}
					</p>
				</div>
			</div>
		);
	}
}
// this.state.streetViewURL
export default RestaurantListing;
