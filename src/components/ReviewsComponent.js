//component that fetches and displays movie reviews
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReviews } from "../slices/loadedSlice";
import { fetchReviewsThunk, resetReviewsToIdle } from "../slices/reviewsSlice";
import "../css/reviews.css";

const ReviewsComponent = ({ movieId }) => {
  const dispatch = useDispatch();
  const reviewsState = useSelector((state) => state.reviews);
  const loadedState = useSelector((state) => state.loaded);

  //fetch movie reviews if they were not fetched
  useEffect(() => {
    if (
      movieId in loadedState.loadedMovies &&
      !("reviews" in loadedState.loadedMovies[movieId])
    )
      dispatch(fetchReviewsThunk(movieId));
  }, [dispatch, movieId, loadedState.loadedMovies]);

  //if reviews were fetched, add them to loaded movies state
  useEffect(() => {
    if (reviewsState.reviewsStatus === "succeeded") {
      dispatch(addReviews({ reviews: reviewsState.reviews, id: movieId }));
      dispatch(resetReviewsToIdle());
    }
  }, [dispatch, reviewsState.reviewsStatus, movieId, reviewsState.reviews]);
  return (
    <div>
      <h2 className="detailsSubTitle">Reviews</h2>
      {reviewsState.reviewsStatus === "loading" ? (
        <h1 className="loading">
          Loading reviews
          <div className="loading-spinner" />
        </h1>
      ) : reviewsState.reviewsStatus === "failed" ? (
        <div className="error">
          <h1>We encountered an error</h1>
          <p>{reviewsState.reviewsError} </p>
        </div>
      ) : loadedState.loadedMovies[movieId] !== undefined &&
        "reviews" in loadedState.loadedMovies[movieId] ? (
        loadedState.loadedMovies[movieId].reviews.length === 0 ? (
          <h3 key="no-reviews" style={{ textAlign: "center" }}>
            This movie has no reviews
          </h3>
        ) : (
          <div className="reviewsContainer" key="reviews-container">
            {loadedState.loadedMovies[movieId].reviews.map((review) => {
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
        )
      ) : null}
    </div>
  );
};

export default ReviewsComponent;
