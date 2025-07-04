import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const [totalVideos, totalSubscribers, totalVideoLikes, totalViews] = await Promise.all([
        Video.countDocuments({ owner: userId }),
        Subscription.countDocuments({ channel: userId }),
        Like.countDocuments({ likedBy: userId, video: { $exists: true } }),
        Video.aggregate([
            { $match: { owner: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ])
    ])

    const viewsCount = totalViews[0]?.totalViews || 0

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalSubscribers,
            totalVideoLikes,
            totalViews: viewsCount
        }, "Channel stats fetched successfully")
    )
})


const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { page = 1, limit = 10 } = req.query

    const videos = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $sort: { createdAt: -1 }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ])

    const total = await Video.countDocuments({ owner: userId })

    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            videos
        }, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats,
    getChannelVideos
}
