import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Create a Tweet
const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, tweet, "Tweet created successfully")
    );
});

// Get User's Tweets
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ owner: userId })
        .populate("owner", "username fullName avatar")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const total = await Tweet.countDocuments({ owner: userId });

    return res.status(200).json(
        new ApiResponse(200, {
            tweets,
            total,
            page,
            limit
        }, "Tweets fetched successfully")
    );
});

// Update a Tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if (!content) {
        throw new ApiError(400, "Updated content is required");
    }

    const tweet = await Tweet.findOne({ _id: tweetId, owner: req.user._id });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(
        new ApiResponse(200, tweet, "Tweet updated successfully")
    );
});

// Delete a Tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOne({ _id: tweetId, owner: req.user._id });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized");
    }

    await tweet.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Tweet deleted successfully")
    );
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
