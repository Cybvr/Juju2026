const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, query, limit } = require("firebase/firestore");
const dotenv = require("dotenv");
const path = require("path");

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const sceneStyles = [
  { name: "Pixar-style 3D", image: "/images/marketing/joyful.webp" },
  { name: "Anime", image: "/images/marketing/adventure.webp" },
  { name: "Claymation", image: "/images/marketing/wizard.webp" },
  { name: "Comic book", image: "/images/marketing/artist.webp" },
  { name: "Watercolor", image: "/images/marketing/cloud.webp" },
  { name: "Cinematic realistic", image: "/images/marketing/1.webp" },
];

const characterThumbnails = [
  { name: "Kid", image: "/images/dashboard/Characters/Albanian%20Boy.png" },
  { name: "Woman", image: "/images/dashboard/Characters/Nigerian%20Woman.png" },
  { name: "Man", image: "/images/dashboard/Characters/Chinese%20Man.png" },
  { name: "Elder", image: "/images/dashboard/Characters/Indian%20Elder.png" },
  { name: "Monster", image: "/images/dashboard/Characters/Purple%20Monster%20v5.png" },
  { name: "Robot", image: "/images/dashboard/Characters/White%20Robot.png" },
];

const locationThumbnails = [
  { name: "Modern office", image: "/images/dashboard/locations/Pixar%20Modern%20Office.png" },
  { name: "Classroom", image: "/images/dashboard/locations/Pixar%20Classroom.png" },
  { name: "Retail store", image: "/images/dashboard/locations/Pixar%20Retail%20Store.png" },
  { name: "Home", image: "/images/dashboard/locations/Pixar%20Home%20Interior.png" },
  { name: "Enchanted forest", image: "/images/dashboard/locations/Pixar%20Enchanted%20Forest.png" },
  { name: "City street", image: "/images/dashboard/locations/Pixar%20City%20Street.png" },
];

const audioStyles = [
  { name: "Cinematic", image: "/images/marketing/1.webp" },
  { name: "Lo-fi", image: "/images/marketing/cloud.webp" },
  { name: "Orchestral", image: "/images/marketing/adventure.webp" },
  { name: "Upbeat", image: "/images/marketing/joyful.webp" },
  { name: "Ambient", image: "/images/marketing/2.webp" },
  { name: "Playful", image: "/images/marketing/wizard.webp" },
];

const audioThumbnails = [
  { name: "Trailer score", image: "/images/marketing/adventure.webp" },
  { name: "Soft piano", image: "/images/marketing/cloud.webp" },
  { name: "Kids theme", image: "/images/marketing/joyful.webp" },
  { name: "Product beat", image: "/images/marketing/3.webp" },
];

async function seed() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const data = [
    { name: 'library_styles', items: sceneStyles },
    { name: 'library_characters', items: characterThumbnails },
    { name: 'library_locations', items: locationThumbnails },
    { name: 'library_audio_styles', items: audioStyles },
    { name: 'library_audio', items: audioThumbnails }
  ];

  for (const colData of data) {
    const q = query(collection(db, colData.name), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(`Seeding ${colData.name}...`);
      for (const item of colData.items) {
        await addDoc(collection(db, colData.name), item);
        console.log(`  Added: ${item.name}`);
      }
    } else {
      console.log(`Collection ${colData.name} already has data, skipping.`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
