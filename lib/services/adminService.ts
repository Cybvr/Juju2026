import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
    getCountFromServer,
    limit
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User, Project } from "@/app/common/types"

export const adminService = {
    // User Management
    async getAllUsers(): Promise<User[]> {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => {
            const data = doc.data()
            let createdAt = new Date()
            const rawCreatedAt = data.createdAt
            if (rawCreatedAt) {
                if (typeof rawCreatedAt.toDate === 'function') createdAt = rawCreatedAt.toDate()
                else if (rawCreatedAt instanceof Date) createdAt = rawCreatedAt
                else createdAt = new Date(rawCreatedAt)
            }

            return {
                id: doc.id,
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL,
                plan: data.plan || "free",
                role: data.role || "user",
                createdAt,
            }
        })
    },

    async updateUser(userId: string, data: Partial<User>) {
        const docRef = doc(db, "users", userId)
        await updateDoc(docRef, {
            ...data,
        })
    },

    async deleteUser(userId: string) {
        await deleteDoc(doc(db, "users", userId))
    },

    // Project Management
    async getAllProjects(): Promise<Project[]> {
        const q = query(collection(db, "projects"), orderBy("updatedAt", "desc"))
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

    async updateProject(projectId: string, data: Partial<Project>) {
        const docRef = doc(db, "projects", projectId)
        await updateDoc(docRef, {
            ...data,
        })
    },

    async deleteProject(projectId: string) {
        await deleteDoc(doc(db, "projects", projectId))
    },

    // Dashboard Stats
    async getStats() {
        const usersSnapshot = await getCountFromServer(collection(db, "users"))
        const projectsSnapshot = await getCountFromServer(collection(db, "projects"))
        return {
            totalUsers: usersSnapshot.data().count,
            totalProjects: projectsSnapshot.data().count,
        }
    },

    async getRecentActivity() {
        const usersQ = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
        const projectsQ = query(collection(db, "projects"), orderBy("updatedAt", "desc"), limit(5))
        
        const [usersSnapshot, projectsSnapshot] = await Promise.all([
            getDocs(usersQ),
            getDocs(projectsQ)
        ])

        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data()
            const createdAt = data.createdAt
            let timestamp = new Date()
            
            if (createdAt) {
                if (typeof createdAt.toDate === 'function') {
                    timestamp = createdAt.toDate()
                } else if (createdAt instanceof Date) {
                    timestamp = createdAt
                } else {
                    timestamp = new Date(createdAt)
                }
            }

            return {
                id: doc.id,
                type: "user",
                text: `New user: ${data.displayName || data.email}`,
                timestamp
            }
        })

        const projects = projectsSnapshot.docs.map(doc => {
            const data = doc.data()
            const updatedAt = data.updatedAt
            let timestamp = new Date()

            if (updatedAt) {
                if (typeof updatedAt.toDate === 'function') {
                    timestamp = updatedAt.toDate()
                } else if (updatedAt instanceof Date) {
                    timestamp = updatedAt
                } else {
                    timestamp = new Date(updatedAt)
                }
            }

            return {
                id: doc.id,
                type: "project",
                text: `Project created: ${data.name}`,
                timestamp
            }
        })

        return [...users, ...projects].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)
    }
}
