

export class Ratings {
    _id
    comments
    danceStyle
    technique
    userRatedId
    userRatingId
    nicknameUserRating
    /**
     * 
     * @param {string} _id 
     * @param {string} comments
     * @param {string} danceStyle
     * @param {number} technique 
     * @param {string} userRatedId
     * @param {string} userRatingId
     * @param {string} nicknameUserRating
     */
    constructor(_id, comments, danceStyle, technique, userRatedId, userRatingId, nicknameUserRating) {
        this._id = _id
        this.comments = comments
        this.danceStyle = danceStyle
        this.technique = technique
        this.userRatedId = userRatedId
        this.userRatingId = userRatingId
        this.nicknameUserRating = nicknameUserRating
    }
}