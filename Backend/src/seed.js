// Demo data seeder — populates the local MongoDB with realistic test data.
// Run from Backend/:  fnm use 20 && node -r dotenv/config src/seed.js
import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import { Video } from "./models/video.model.js";
import { Subscription } from "./models/subscription.model.js";
import { Comment } from "./models/comment.model.js";
import { Like } from "./models/like.model.js";
import { Playlist } from "./models/playlist.model.js";
import { Tweet } from "./models/tweet.model.js";

const PASSWORD = "Test@1234"; // shared password for every demo account

const avatar = (seed) => `https://i.pravatar.cc/300?u=${encodeURIComponent(seed)}`;
const cover = (seed) => `https://picsum.photos/seed/${seed}-cover/1280/320`;
const thumb = (seed) => `https://picsum.photos/seed/${seed}/640/360`;

// Public, real, HTML5-playable sample MP4s (Google sample bucket)
const SAMPLES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];

const USERS = [
  { username: "aarav.sharma",  fullName: "Aarav Sharma",  email: "aarav.sharma@example.com" },
  { username: "priya.patel",   fullName: "Priya Patel",   email: "priya.patel@example.com" },
  { username: "rohan.gupta",   fullName: "Rohan Gupta",   email: "rohan.gupta@example.com" },
  { username: "ananya.singh",  fullName: "Ananya Singh",  email: "ananya.singh@example.com" },
  { username: "vikram.reddy",  fullName: "Vikram Reddy",  email: "vikram.reddy@example.com" },
  { username: "sneha.iyer",    fullName: "Sneha Iyer",    email: "sneha.iyer@example.com" },
  { username: "arjun.mehta",   fullName: "Arjun Mehta",   email: "arjun.mehta@example.com" },
  { username: "kavya.nair",    fullName: "Kavya Nair",    email: "kavya.nair@example.com" },
  { username: "aditya.kumar",  fullName: "Aditya Kumar",  email: "aditya.kumar@example.com" },
  { username: "isha.joshi",    fullName: "Isha Joshi",    email: "isha.joshi@example.com" },
];

// videos keyed by owner username; sampleIdx maps to SAMPLES[]
const VIDEOS = [
  { owner: "aarav.sharma", sampleIdx: 0, duration: 1830, views: 124500, title: "Learn React in 30 Minutes (Hindi)", description: "React fundamentals explained in simple Hindi — components, props, state aur hooks. Perfect for beginners starting their web dev journey." },
  { owner: "aarav.sharma", sampleIdx: 1, duration: 2410, views: 89200,  title: "JavaScript Interview Questions Explained", description: "Top 15 JavaScript interview questions every fresher must know. Closures, hoisting, promises sab kuch covered." },
  { owner: "aarav.sharma", sampleIdx: 2, duration: 1320, views: 45600,  title: "Day in the Life of a Bangalore Techie", description: "Ek software engineer ka pura din — work, coffee, traffic aur side projects. Bangalore tech life ki jhalak." },
  { owner: "priya.patel",  sampleIdx: 3, duration: 740,  views: 256000, title: "Easy Paneer Butter Masala Recipe 🍛", description: "Restaurant-style paneer butter masala ghar par banaiye 20 minutes mein. Creamy, rich aur full of flavour!" },
  { owner: "priya.patel",  sampleIdx: 4, duration: 980,  views: 312000, title: "Mumbai Street Food Tour 🤤", description: "Vada pav se lekar pav bhaji tak — Mumbai ki best street food spots ka tour. Itni bhookh lagegi!" },
  { owner: "rohan.gupta",  sampleIdx: 5, duration: 1560, views: 178300, title: "Himalayan Trek Vlog - Day 1", description: "Kedarkantha trek shuru! Snow, breathtaking views aur thodi si thakaan. Trekking lovers ye miss mat karna." },
  { owner: "rohan.gupta",  sampleIdx: 6, duration: 1240, views: 142800, title: "Goa Travel Guide on a Budget ✈️", description: "Goa ghoomiye sirf 10,000 mein! Best beaches, cheap stays aur hidden cafes. Complete budget breakdown." },
  { owner: "ananya.singh", sampleIdx: 7, duration: 1080, views: 98700,  title: "Yoga for Beginners | Morning Routine 🧘‍♀️", description: "Subah ki 15-minute yoga routine for flexibility aur energy. No equipment needed, ghar par hi karein." },
  { owner: "ananya.singh", sampleIdx: 8, duration: 900,  views: 67400,  title: "Bollywood Dance Workout 💃", description: "Fun Bollywood dance workout — calories burn karein latest hit songs par. Zumba se zyada maza!" },
  { owner: "vikram.reddy", sampleIdx: 9, duration: 1140, views: 203500, title: "Best Budget Smartphones 2026 📱", description: "15,000 ke andar best 5 smartphones. Camera, battery aur performance ka detailed comparison." },
  { owner: "vikram.reddy", sampleIdx: 10, duration: 660, views: 154200, title: "Unboxing the New OnePlus ⚡", description: "Brand new OnePlus unboxing aur first impressions. Kya ye flagship killer abhi bhi worth it hai?" },
  { owner: "sneha.iyer",   sampleIdx: 11, duration: 480, views: 88900,  title: "Diwali Home Decor Ideas ✨", description: "Budget-friendly Diwali decoration ideas — diyas, rangoli aur lights se ghar ko sajaiye." },
  { owner: "arjun.mehta",  sampleIdx: 12, duration: 720, views: 421000, title: "Standup Comedy - Delhi Metro Stories 😂", description: "Delhi metro ke daily struggles par standup. Agar aap metro mein travel karte ho to relate karoge guaranteed!" },
];

async function run() {
  const uri = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;
  await mongoose.connect(uri);
  console.log("Connected:", mongoose.connection.host, "/", mongoose.connection.name);

  // Clean slate (safe to re-run)
  await Promise.all([
    User.deleteMany({}), Video.deleteMany({}), Subscription.deleteMany({}),
    Comment.deleteMany({}), Like.deleteMany({}), Playlist.deleteMany({}), Tweet.deleteMany({}),
  ]);
  console.log("Cleared existing collections.");

  // 1) Users (create() -> triggers password hashing hook)
  const userByName = {};
  for (const u of USERS) {
    const doc = await User.create({
      ...u,
      password: PASSWORD,
      avatar: avatar(u.username),
      coverImage: cover(u.username),
    });
    userByName[u.username] = doc;
  }
  console.log(`Created ${USERS.length} users.`);

  // 2) Videos
  const videoDocs = [];
  for (const v of VIDEOS) {
    const doc = await Video.create({
      videoFile: SAMPLES[v.sampleIdx],
      thumbnail: thumb(v.owner + "-" + v.sampleIdx),
      title: v.title,
      description: v.description,
      duration: v.duration,
      views: v.views,
      isPublished: true,
      owner: userByName[v.owner]._id,
    });
    videoDocs.push(doc);
  }
  console.log(`Created ${videoDocs.length} videos.`);

  const U = (name) => userByName[name]._id;

  // 3) Subscriptions (subscriber -> channel)
  const subs = [
    ["kavya.nair", "aarav.sharma"], ["kavya.nair", "priya.patel"], ["kavya.nair", "rohan.gupta"],
    ["aditya.kumar", "aarav.sharma"], ["aditya.kumar", "vikram.reddy"], ["aditya.kumar", "arjun.mehta"],
    ["isha.joshi", "priya.patel"], ["isha.joshi", "ananya.singh"], ["isha.joshi", "sneha.iyer"],
    ["priya.patel", "rohan.gupta"], ["rohan.gupta", "priya.patel"], ["ananya.singh", "aarav.sharma"],
    ["sneha.iyer", "vikram.reddy"], ["arjun.mehta", "aarav.sharma"], ["vikram.reddy", "arjun.mehta"],
    ["aarav.sharma", "vikram.reddy"], ["aarav.sharma", "arjun.mehta"], ["priya.patel", "ananya.singh"],
  ];
  await Subscription.insertMany(subs.map(([s, c]) => ({ subscriber: U(s), channel: U(c) })));
  console.log(`Created ${subs.length} subscriptions.`);

  // 4) Comments — spread across the first several videos
  const commentText = [
    ["kavya.nair", "Bahut helpful video! Thank you so much 🙏"],
    ["aditya.kumar", "Finally samajh aaya, great explanation 🔥"],
    ["isha.joshi", "Please make a part 2 on this topic!"],
    ["aarav.sharma", "Glad you all found it useful 😊"],
    ["sneha.iyer", "Trying this today, looks amazing!"],
    ["arjun.mehta", "Quality content as always 👌"],
    ["ananya.singh", "Subscribed! Keep it up 💯"],
    ["vikram.reddy", "Editing is on point bhai 🎬"],
  ];
  const comments = [];
  for (let i = 0; i < videoDocs.length; i++) {
    // 2 comments on each of the first 8 videos
    if (i < 8) {
      const a = commentText[i % commentText.length];
      const b = commentText[(i + 3) % commentText.length];
      comments.push({ content: a[1], video: videoDocs[i]._id, owner: U(a[0]) });
      comments.push({ content: b[1], video: videoDocs[i]._id, owner: U(b[0]) });
    }
  }
  const commentDocs = await Comment.insertMany(comments);
  console.log(`Created ${commentDocs.length} comments.`);

  // 5) Tweets (community posts)
  const tweets = [
    ["aarav.sharma", "New React tutorial dropping this weekend! Kya cover karu? Comment below 👇"],
    ["aarav.sharma", "100k subscribers! Thank you for all the love ❤️"],
    ["priya.patel", "Aaj kya banau? Drop your recipe requests 🍳"],
    ["rohan.gupta", "Next trek: Spiti Valley. Kaun aa raha hai? 🏔️"],
    ["arjun.mehta", "Delhi show tickets are live! See you there 🎤"],
    ["vikram.reddy", "Big phone review coming Monday. Guess the brand 👀"],
  ];
  const tweetDocs = await Tweet.insertMany(tweets.map(([o, c]) => ({ content: c, owner: U(o) })));
  console.log(`Created ${tweetDocs.length} tweets.`);

  // 6) Likes — on videos, comments and tweets
  const videoLikes = [
    ["kavya.nair", 0], ["kavya.nair", 3], ["kavya.nair", 5], ["aditya.kumar", 0], ["aditya.kumar", 9],
    ["aditya.kumar", 12], ["isha.joshi", 3], ["isha.joshi", 7], ["isha.joshi", 11], ["sneha.iyer", 0],
    ["arjun.mehta", 1], ["ananya.singh", 0], ["vikram.reddy", 12], ["priya.patel", 5], ["rohan.gupta", 4],
    ["aarav.sharma", 12], ["aditya.kumar", 1], ["kavya.nair", 4],
  ];
  const likes = videoLikes.map(([u, vi]) => ({ video: videoDocs[vi]._id, likedBy: U(u) }));
  // a few comment likes
  likes.push({ comment: commentDocs[0]._id, likedBy: U("aarav.sharma") });
  likes.push({ comment: commentDocs[1]._id, likedBy: U("priya.patel") });
  likes.push({ comment: commentDocs[2]._id, likedBy: U("isha.joshi") });
  // a few tweet likes
  likes.push({ tweet: tweetDocs[0]._id, likedBy: U("kavya.nair") });
  likes.push({ tweet: tweetDocs[1]._id, likedBy: U("aditya.kumar") });
  likes.push({ tweet: tweetDocs[4]._id, likedBy: U("isha.joshi") });
  await Like.insertMany(likes);
  console.log(`Created ${likes.length} likes.`);

  // 7) Playlists
  const techVids = videoDocs.filter((v) => String(v.owner) === String(U("aarav.sharma"))).map((v) => v._id);
  const travelVids = videoDocs.filter((v) => String(v.owner) === String(U("rohan.gupta"))).map((v) => v._id);
  const foodVids = videoDocs.filter((v) => String(v.owner) === String(U("priya.patel"))).map((v) => v._id);
  await Playlist.insertMany([
    { name: "Coding Tutorials", description: "Web dev aur programming ke best tutorials.", videos: techVids, owner: U("aarav.sharma") },
    { name: "Travel Diaries", description: "Mountains, beaches aur sab kuch beech mein.", videos: travelVids, owner: U("rohan.gupta") },
    { name: "Watch Later - Recipes", description: "Foodie favourites to cook this weekend.", videos: foodVids, owner: U("kavya.nair") },
  ]);
  console.log("Created 3 playlists.");

  console.log("\n✅ Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(async (err) => {
  console.error("Seed failed:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
