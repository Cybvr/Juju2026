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
import type { Project, GalleryImage } from "@/app/common/types"

export const projectService = {
    async createProject(userId: string, name: string): Promise<string> {
        const docRef = await addDoc(collection(db, "projects"), {
            name,
            userId,
            thumbnail: "", // Empty thumbnail for new projects
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        return docRef.id
    },

    // Get all projects for a user
    async getUserProjects(userId: string): Promise<Project[]> {
        const q = query(
            collection(db, "projects"),
            where("userId", "==", userId)
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            let createdAt = new Date()
            let updatedAt = new Date()
            const rawCreatedAt = data.createdAt
            const rawUpdatedAt = data.updatedAt

            if (rawCreatedAt) {
                if (typeof rawCreatedAt.toDate === 'function') createdAt = rawCreatedAt.toDate()
                else if (rawCreatedAt instanceof Date) createdAt = rawCreatedAt
                else createdAt = new Date(rawCreatedAt)
            }

            if (rawUpdatedAt) {
                if (typeof rawUpdatedAt.toDate === 'function') updatedAt = rawUpdatedAt.toDate()
                else if (rawUpdatedAt instanceof Date) updatedAt = rawUpdatedAt
                else updatedAt = new Date(rawUpdatedAt)
            }

            return {
                id: doc.id,
                name: data.name,
                thumbnail: data.thumbnail,
                thumbnailType: data.thumbnailType,
                userId: data.userId,
                isPublic: data.isPublic,
                isJujuTemplate: data.isJujuTemplate,
                category: data.category,
                createdAt,
                updatedAt,
            }
        })
    },

    // Get a single project
    async getProject(projectId: string): Promise<Project | null> {
        const docRef = doc(db, "projects", projectId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const data = docSnap.data()
            return {
                id: docSnap.id,
                name: data.name,
                thumbnail: data.thumbnail,
                thumbnailType: data.thumbnailType,
                userId: data.userId,
                isPublic: data.isPublic,
                isJujuTemplate: data.isJujuTemplate,
                category: data.category,
                createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
                updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
            }
        }
        return null
    },

    // Update a project
    async updateProject(projectId: string, data: Partial<Project>) {
        const docRef = doc(db, "projects", projectId)
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        })
    },

    // Delete a project
    async deleteProject(projectId: string) {
        await deleteDoc(doc(db, "projects", projectId))
    },

    // Get all images/scenes for a user
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
                imageCount: 1, // Individual scene
                timeAgo: "Recently", // Simplification
            }
        })
    },

    // Get scenes for a specific project
    async getProjectImages(projectId: string): Promise<GalleryImage[]> {
        const q = query(
            collection(db, "images"),
            where("projectId", "==", projectId),
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
    },
 
    // Get all templates
    async getTemplates(): Promise<Project[]> {
        const q = query(
            collection(db, "projects"),
            where("isJujuTemplate", "==", true)
        )
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            let createdAt = new Date()
            let updatedAt = new Date()
            const rawCreatedAt = data.createdAt
            const rawUpdatedAt = data.updatedAt

            if (rawCreatedAt) {
                if (typeof rawCreatedAt.toDate === 'function') createdAt = rawCreatedAt.toDate()
                else if (rawCreatedAt instanceof Date) createdAt = rawCreatedAt
                else createdAt = new Date(rawCreatedAt)
            }

            if (rawUpdatedAt) {
                if (typeof rawUpdatedAt.toDate === 'function') updatedAt = rawUpdatedAt.toDate()
                else if (rawUpdatedAt instanceof Date) updatedAt = rawUpdatedAt
                else updatedAt = new Date(rawUpdatedAt)
            }

            return {
                id: doc.id,
                name: data.name,
                thumbnail: data.thumbnail,
                thumbnailType: data.thumbnailType,
                userId: data.userId,
                isPublic: data.isPublic,
                isJujuTemplate: data.isJujuTemplate,
                category: data.category,
                createdAt,
                updatedAt,
            }
        })
    }
}
