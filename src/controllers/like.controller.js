import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Toggle like on a Video
 */
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    let message = "";

    if (existingLike) {
        await existingLike.deleteOne();
        message = "Video unliked";
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user._id
        });
        message = "Video liked";
    }

    return res.status(200).json(new ApiResponse(200, {}, message));
});

/**
 * Toggle like on a Comment
 */
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    let message = "";

    if (existingLike) {
        await existingLike.deleteOne();
        message = "Comment unliked";
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user._id
        });
        message = "Comment liked";
    }

    return res.status(200).json(new ApiResponse(200, {}, message));
});

/**
 * Toggle like on a Tweet
 */
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    let message = "";

    if (existingLike) {
        await existingLike.deleteOne();
        message = "Tweet unliked";
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        });
        message = "Tweet liked";
    }

    return res.status(200).json(new ApiResponse(200, {}, message));
});

/**
 * Get all liked videos of the logged-in user
 */
const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true }
    })
        .populate({
            path: "video",
            populate: {
                path: "owner",
                select: "username fullName avatar"
            }
        })
        .select("video");

    const likedVideos = likes.map(like => like.video);

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
