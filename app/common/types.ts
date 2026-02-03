export interface Album {
  id: string
  name: string
  thumbnail: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ImageItem {
  id: string
  url: string
  title: string
  albumId: string
  prompt: string
  userId: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  displayName: string
  photoURL?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: Date
}
