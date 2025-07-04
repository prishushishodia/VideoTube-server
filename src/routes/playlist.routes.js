import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);  // Protect all playlist routes

// Create a Playlist
router.post("/", createPlaylist);

// Get Playlists for a User
router.get("/user/:userId", getUserPlaylists);

// Playlist Operations by ID
router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

// Add/Remove Video to/from Playlist - better naming
router.patch("/:playlistId/videos/:videoId", addVideoToPlaylist);
router.delete("/:playlistId/videos/:videoId", removeVideoFromPlaylist);

export default router;
