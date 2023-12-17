import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReviews } from "../slices/loadedSlice";
import { resetReviewsToIdle } from "../slices/reviewsSlice";
import '../css/reviews.css';

const ReviewsComponent = ({ movieId }) => {
    const dispatch = useDispatch();
    const reviewsState = useSelector(state => state.reviews);
    const loadedState = useSelector(state => state.loaded);

    useEffect(() => {
        if (reviewsState.reviewsStatus === "succeeded") {
            dispatch(addReviews({ reviews: reviewsState.reviews, id: movieId }));
            dispatch(resetReviewsToIdle());
        }
    }, [dispatch, reviewsState.reviewsStatus, movieId]);

    return (
        <div>
            <h2 className="detailsSubTitle">Reviews</h2>
            {reviewsState.reviewsStatus === 'loading' ? <h1 className="loading">Loading reviews<div className="loading-spinner"/></h1> :
                reviewsState.reviewsStatus === 'failed' ?
                    <div className="error">
                        <h1>We encountered an error</h1>
                        <p>{reviewsState.reviewsError} </p>
                    </div>
                    :
                    loadedState.loadedMovies.map((movie) => {
                        if (movie.id === movieId && "reviews" in movie) {
                            return (
                                movie.reviews.length === 0 ?
                                    <h3 key="no-reviews" style={{ textAlign: "center" }}>This movie has no reviews</h3>
                                    :
                                    <div className="reviewsContainer" key="reviews-container">
                                        {movie.reviews.map((review) => {
                                            return (
                                                <div key={review.id}>
                                                    <div dangerouslySetInnerHTML={{ __html: review.content }} />
                                                    <div className="reviewAuthorAndDate">
                                                        <h4>by {review.author}</h4>
                                                        <p>{review.created_at.substring(0, 10)}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                            );
                        }
                    })}
        </div>
    );
}

export default ReviewsComponent;
