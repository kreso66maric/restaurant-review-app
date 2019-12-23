import React, { Component } from 'react';

import Avatar from '../../img/avatar.png';
import './AddReview.css';

class AddReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameValue: '',
            commentValue: '',
            ratingValue: 1
		}
		this.submitReview = this.submitReview.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.ratingChange = this.ratingChange.bind(this);
    }

    submitReview () {
		// Create new user review object from inputs
		let userReview = {
			profile_photo_url: Avatar,
			author_name: this.state.nameValue,
			rating: this.state.ratingValue,
			text: this.state.commentValue,
		};
		// Pass new review up to <RestaurantDetails />
		this.props.handleSubmit(userReview);
	}


	handleChange (event) {
		// Set input values for author and comment
		this.setState({
			[event.target.name]: event.target.value,
			[event.target.name]: event.target.value
		});
	}



	ratingChange () {
		// Get value of rating chosen
		let select = document.getElementById("rating");
		var selectedValue = select.options[select.selectedIndex].value;
		this.setState({
			ratingValue: selectedValue
		});
	}

    render() {
        return (
            <div className="AddReview">
				<h3 className="AddReview-title">ADD YOUR REVIEW</h3>
				<form>
					<p>Rating</p>
					<select id="rating" name="rating" required onChange={this.ratingChange}>
  						<option name="rating" value="1" id="1" >1 Star</option>
  						<option name="rating" value="2" id="2" >2 Stars</option>
  						<option name="rating" value="3" id="3" >3 Stars</option>
  						<option name="rating" value="4" id="4" >4 Stars</option>
  						<option name="rating" value="5" id="5" >5 Stars</option>
					</select> 
				

					<p>Name</p>
					<input  className="AddReview-author" 
						type="text" 
						name="nameValue"
						required
						placeholder="Write your name"
						value={this.state.nameValue} 
						onChange={this.handleChange}
					/>

					<p>Comment</p>
					<textarea  className="AddReview-comment" 
						name="commentValue"
						required
						cols="40"
						rows="8"
						placeholder="Write your comment"
						value={this.state.commentValue} 
						onChange={this.handleChange} 
					/>

					<div className="AddReview-buttons">
						<button  className="AddReview-submit-button" onClick={this.submitReview} >
							SUBMIT
						</button>

						<button  className="AddReview-cancel-button" onClick={this.props.cancelSubmit} >
							CANCEL
						</button>
					</div>
				</form>
			</div>
        );
    }
}

export default AddReview;