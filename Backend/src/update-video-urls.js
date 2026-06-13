// One-off: replace dead Google sample-bucket URLs with live, playable MP4s.
// Updates only videoFile on existing videos (preserves all ids/likes/subs/comments).
// Run:  node -r dotenv/config src/update-video-urls.js
import mongoose from "mongoose";
import { Video } from "./models/video.model.js";

// All verified 200 / video/mp4 (Jun 2026)
const WORKING = [
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
  "https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
];

async function run() {
  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
  const videos = await Video.find({}).sort({ createdAt: 1 });
  let i = 0;
  for (const v of videos) {
    v.videoFile = WORKING[i % WORKING.length];
    await v.save();
    console.log(`  ${v.title.slice(0, 32).padEnd(32)} -> ${v.videoFile.split("/").pop()}`);
    i++;
  }
  console.log(`\n✅ Updated ${videos.length} videos with playable URLs.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (e) => { console.error(e); try { await mongoose.disconnect(); } catch {} process.exit(1); });
