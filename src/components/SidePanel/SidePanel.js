import React, { Component } from 'react';

import RestaurantPanel from '../RestaurantPanel/RestaurantPanel';
import RestaurantMarkers from '../RestaurantMarkers/RestaurantMarkers';
import AddRestaurant from '../AddRestaurant/AddRestaurant';
import './SidePanel.css';

class SidePanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            beenModified: false,
			modifiedRestaurants: [],
			filterOn: false,
			filterValue: 0,
			filteredRestaurants: [],
            viewFilter: true,
            viewNewRestaurantButton: true,
            newRestaurantCounter: 0,
			viewRestaurantPanel: true,
        }

        this.filterRestaurants = this.filterRestaurants.bind(this);
		this.passArray = this.passArray.bind(this);
		this.pushNewReview = this.pushNewReview.bind(this);
        this.addRestaurant = this.addRestaurant.bind(this);
        this.pushNewRestaurant = this.pushNewRestaurant.bind(this);
        this.hideButtons = this.hideButtons.bind(this);
        this.restoreDefaultView = this.restoreDefaultView.bind(this);
    }

    // Restaurant Filter
    filterRestaurants(event) {
		// Get number value from user input
		let ratingValue = 0;
		if (event) {
        ratingValue = Number(event.target.value);
		};

		// Create filtered array
		let filteredRestaurants = [];

		// Check restaurant rating against user rating
		function ratingFilter(restaurant) {
            let avgRatingRound = Math.round(restaurant.avgRating);
			if (avgRatingRound === ratingValue) {
                filteredRestaurants.push(restaurant);
            }
        }
        

		// Determine which array to run filter on
		if (this.state.modifiedRestaurants.length < 1) {
			this.props.restaurants.filter(ratingFilter);
		} else {
			this.state.modifiedRestaurants.filter(ratingFilter);
		}

		// If user has selected to filter, turn on filtered array
		if (ratingValue > 0) {
			this.setState({
				filteredRestaurants: filteredRestaurants,
				filterValue: ratingValue,
				filterOn: true
			});
		} 
    }

    addRestaurant() {
        // Opening AddRestaurant panel
        this.setState({
            viewRestaurantPanel: false,
            viewNewRestaurantButton: false,
            viewFilter: false
        });
    }

    hideButtons() {
        // Hiding filter stars and new restaurant button
        this.setState({
            viewNewRestaurantButton: false,
            viewFilter: false
        });
    }
    
    restoreDefaultView() {
        this.setState({
            viewRestaurantPanel: true,
            viewNewRestaurantButton: true,
            viewFilter: true,
            expandSidePanel: null
        });
    }
    

        pushNewRestaurant(userRestaurant) {
            // If user adds restaurant, add to modified array
            if (this.state.beenModified === true) {
                this.setState(prevState => ({
                    modifiedRestaurants: prevState.modifiedRestaurants.concat(userRestaurant),
                    filterOn: false
                }));
                // Else create modified array
            } else {
                this.setState({
                    modifiedRestaurants: this.props.restaurants.concat(userRestaurant),
                    beenModified: true,
                    filterOn: false
                });
            };

            // Change view back to RestaurantPanel and increase counter
            this.setState(prevState => ({
                viewRestaurantPanel: true,
                viewNewRestaurantButton: true,
                viewFilter: true,
                newRestaurantCounter: prevState.newRestaurantCounter + 1
            }));
        }

      

        // Push New Review To Array
        pushNewReview(restaurantID, userReview) {
            // If user has previously modified restaurants or reviews, add new review to modified array
            if (this.state.beenModified === true) {
                // Create new modified array from state array
                let modifiedArray = this.state.modifiedRestaurants.map(restaurant => restaurant);
                // Find restaurant from new array and push userReview to it
                let reviewedPlace = modifiedArray.find( restaurant => restaurant.id === restaurantID);
                reviewedPlace.userReviews.unshift(userReview);
    
                // Set modified array to state
                this.setState({
                    modifiedRestaurants: modifiedArray,
                    filterOn: false
                });
            } else {
                // Create modified array from props array
                let modifiedArray = this.props.restaurants.map( restaurant => restaurant);
                // Find restaurant from new array and push userReview to it
                let reviewedPlace = modifiedArray.find( restaurant => restaurant.id === restaurantID);
    
                reviewedPlace.userReviews.unshift(userReview);
    
                // Set modified array to state
                this.setState({
                    modifiedRestaurants: modifiedArray,
                    beenModified: true,
                    filterOn: false
                });
            };
        }

        // Pass Array To Restaurant Panel
        passArray () {
            // If filter is off and no modified restaurants exist
            if (this.state.filterOn === false && this.state.beenModified === false) {
                return this.props.restaurants;
            // If filter is on
            } else if (this.state.filterOn === true) {
                return this.state.filteredRestaurants;
            // If filter is off and modified restaurants exist
            } else if (this.state.filterOn === false && this.state.beenModified === true) {
                return this.state.modifiedRestaurants;
            };
        }

        // Component Did Update
        componentDidUpdate(prevProps) {
            // If mapBounds have updated pass new restaurants and reset filter
            if (prevProps.updatedMapBounds !== this.props.updatedMapBounds) {
                this.setState({
                    filterOn: false,
                    beenModified: false
                });
            }
        }

        render() {
            return (
                <div className="SidePanel">
                    <RestaurantMarkers
                        restaurants={this.passArray()}
                        map={this.props.map}
                    />

                    <div className="SidePanel-top">
                        {this.state.viewFilter ?
                        <div className="sidePanel-filter">
                            <div className="SidePanel-filter-title">
                                <h3>Filter Restaurants</h3>
                            </div>

                            <div className="SidePanel-filter-buttons">
                                <div className="txt-center">
                                    <form>
                                        <div className="rating">
                                            <input type="radio" name="star" value="5" id="star5" className="radio-btn hide" onClick={this.filterRestaurants} />
                                            <label htmlFor="star5" className="star" >☆</label>
                                            <input type="radio" name="star" value="4" id="star4" className="radio-btn hide" onClick={this.filterRestaurants} />
                                            <label htmlFor="star4" className="star" >☆</label>
                                            <input type="radio" name="star" value="3" id="star3" className="radio-btn hide" onClick={this.filterRestaurants} />
                                            <label htmlFor="star3" className="star" >☆</label>
                                            <input type="radio" name="star" value="2" id="star2" className="radio-btn hide" onClick={this.filterRestaurants} />
                                            <label htmlFor="star2" className="star" >☆</label>
                                            <input type="radio" name="star" value="1" id="star1" className="radio-btn hide" onClick={this.filterRestaurants} />
                                            <label htmlFor="star1" className="star" >☆</label>
                                            <div className="clear"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        :
                        false
                        }

                        {this.state.viewNewRestaurantButton ?
                        <button 
                            className="SidePanel-AddRestaurant-button"
                            onClick={this.addRestaurant}>Create New Restaurant</button>
                        :
                        false
                        }
                    </div>

                    {this.state.viewRestaurantPanel ?
                    <RestaurantPanel
                        restaurants={this.passArray()}
                        map={this.props.map}
                        pushNewReview={this.pushNewReview}
                        handleClick={this.hideButtons}
                        closeDetails={this.restoreDefaultView}
                    />
                    :
                    <AddRestaurant
                        handleSubmit={this.pushNewRestaurant}
                        handleCancel={this.restoreDefaultView}
                        map={this.props.map}
                        counter={this.state.newRestaurantCounter} 
                    />
                    }
                </div>
            );
        }
    }

    export default SidePanel;
