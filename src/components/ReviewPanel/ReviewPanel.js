import React from "react";

import Review from "./Review";
import "./ReviewPanel.css";


const ReviewPanel = (props) => {
	
	// Create array of reviews from props
	let allReviewsArray = props.allReviews.map( (review, index) => {
		return <Review 
			key={index}
			author={review.author_name}
			avatar={review.profile_photo_url}
			rating={review.rating}
			text={review.text}
		/>
	});


	return (
		<div className="reviewPanel">
			{allReviewsArray.length > 0 ? 
				allReviewsArray 
			: 
			<div className="reviewPanel-noReviews">
				<p>There are no reviews for this restaurant yet.</p>
			</div>
			}
		</div>
	);
}


export default ReviewPanel;

