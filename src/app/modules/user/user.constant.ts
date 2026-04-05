import { Prisma } from "../../../generated/prisma/client";

export const userSearchableFields = ['name', 'email', 'profile.firstName', 'profile.lastName', 'profile.phone', 'profile.address', 'profile.city', 'profile.country'];

export const userFilterableFields = ['name', 'email', 'role', 'status', 'createdAt', 'updatedAt', 'profile.firstName', 'profile.lastName', 'profile.phone', 'profile.address', 'profile.city', 'profile.country'];

export const userIncludeConfig : Partial<Record<keyof Prisma.UserInclude, Prisma.UserInclude[keyof Prisma.UserInclude]>> ={
    profile: true,
}