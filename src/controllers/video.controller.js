import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all videos with pagination, search, sort, filter by user
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

    const filter = { isPublished: true };
    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId;
    }

    const sort = { [sortBy]: sortType === "asc" ? 1 : -1 };

    const total = await Video.countDocuments(filter);
    const videos = await Video.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("owner", "fullName username avatar");

    return res.status(200).json(
        new ApiResponse(200, { total, page, limit, videos }, "Videos fetched successfully")
    );
});

// Publish a video (Upload to Cloudinary and create record)
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;

const videoLocalPath = req.files?.videoFile?.[0]?.path;  // corrected field name
const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;


    if (![title, description, duration, videoLocalPath, thumbnailLocalPath].every(Boolean)) {
        throw new ApiError(400, "All fields are required including video and thumbnail");
    }

    const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedVideo?.url || !uploadedThumbnail?.url) {
        throw new ApiError(500, "Error uploading video or thumbnail");
    }

    const video = await Video.create({
        title,
        description,
        duration,
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        owner: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

// Get video by ID and increase view count
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    ).populate("owner", "fullName username avatar");

    if (!video || !video.isPublished) {
        throw new ApiError(404, "Video not found or unpublished");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// Update video details (title, desc, thumbnail)
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this video");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    const thumbnailLocalPath = req.file?.path;
    if (thumbnailLocalPath) {
        const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!uploadedThumbnail?.url) {
            throw new ApiError(500, "Error uploading thumbnail");
        }
        video.thumbnail = uploadedThumbnail.url;
    }

    await video.save();

    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

// Delete video (Only owner can delete)
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this video");
    }

    await video.deleteOne();

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});

// Toggle publish/unpublish status (Only owner can toggle)
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to change publish status");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
};
