import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Album, GalleryImage } from "@/app/common/types"

export const albumService = {
    // Create a new album
    async createAlbum(userId: string, name: string): Promise<string> {
        const docRef = await addDoc(collection(db, "albums"), {
            name,
            userId,
            thumbnail: "/images/boxer-1.jpg", // Default thumbnail
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return docRef.id
    },

    // Get all albums for a user
    async getUserAlbums(userId: string): Promise<Album[]> {
        const q = query(
            collection(db, "albums"),
            where("userId", "==", userId),
            orderBy("updatedAt", "desc")
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                name: data.name,
                thumbnail: data.thumbnail,
                userId: data.userId,
                createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
                updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
            }
        })
    },

    // Get a single album
    async getAlbum(albumId: string): Promise<Album | null> {
        const docRef = doc(db, "albums", albumId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                name: data.name,
                thumbnail: data.thumbnail,
                userId: data.userId,
                createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
                updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
            }
        }
        return null
    },

    // Update an album
    async updateAlbum(albumId: string, data: Partial<Album>) {
        const docRef = doc(db, "albums", albumId)
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        })
    },

    // Delete an album
    async deleteAlbum(albumId: string) {
        await deleteDoc(doc(db, "albums", albumId))
    },

    // Get all images for a user
    async getUserImages(userId: string): Promise<GalleryImage[]> {
        const q = query(
            collection(db, "images"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                url: data.url,
                title: data.title || "Untitled",
                imageCount: 1, // Individual image
                timeAgo: "Recently", // Simplification
            }
        })
    },

    // Get images for a specific album
    async getAlbumImages(albumId: string): Promise<GalleryImage[]> {
        const q = query(
            collection(db, "images"),
            where("albumId", "==", albumId),
            orderBy("createdAt", "desc")
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            return {
                id: doc.id,
                url: data.url,
                title: data.title || "Untitled",
                imageCount: 1,
                timeAgo: "Recently",
            }
        })
    }
}
