import React from "react";

import "./Review.css";


const Review = (props) => {

	return(
		<div className="review">
			<img className="review-avatar" src={props.avatar} alt="User avatar" />
			<p className="review-author">{props.author}</p>
			<p className="review-rating">{props.rating} <i className="fas fa-star"></i></p>
			<p className="review-comment">{props.text}</p>
			<hr />
		</div>
	);
}



export default Review;