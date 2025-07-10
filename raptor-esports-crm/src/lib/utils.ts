import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const MAPS = [
  "Ascent", "Bind", "Breeze", "Fracture", "Haven", 
  "Icebox", "Lotus", "Pearl", "Split", "Sunset"
] as const

export type MapType = typeof MAPS[number]

export const ROLES = [
  'admin', 'manager', 'coach', 'player', 'analyst'
] as const

export type RoleType = typeof ROLES[number]