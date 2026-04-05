import { Prisma, Role, User, UserStatus } from "../../../generated/prisma/client.js";
import { IQueryParams } from "../../interfaces/query.interface.js";
import { prisma } from "../../lib/prisma.js";
import { QueryBuilder } from "../../utils/queryBuilder.js";
import { userFilterableFields, userIncludeConfig, userSearchableFields } from "./user.constant.js";

const getAll = async (query : IQueryParams) => {
  const queryBuilder = new QueryBuilder<User, Prisma.UserWhereInput, Prisma.UserInclude>(
        prisma.user,
        query,
        {
            searchableFields: userSearchableFields,
            filterableFields: userFilterableFields,
        }
    )

  const result = await queryBuilder
        .search()
        .filter()
        .where({
            isDeleted: false,
        })
        .include({
            profile: true,
        })
        .dynamicInclude(userIncludeConfig)
        .paginate()
        .sort()
        .execute();

  return result;
};

const getById = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
        profile: true,
    }
  });
  return result;
};




const deleteById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {

    await tx.profile.update({
      where: { userId: id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return await tx.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
      include: {
        profile: true,
      }
    });
  });
  return result;
};

//changeUserStatus
const changeUserStatus = async (id: string, status: UserStatus) => {
  await prisma.user.update({
    where: { id },
    data: {
      status,
    },
    include: {
      profile: true,
    }
  });
  return {'message': 'User status updated successfully'};
}

//changeUserRole
const changeUserRole = async (id: string, role: Role) => {
  await prisma.user.update({
    where: { id },
    data: {
      role,
    },
    include: {
      profile: true,
    }
  });
  return {'message': 'User role updated successfully'};
}

export const UserService = {
  getAll,
  getById,
  deleteById,
  changeUserStatus,
  changeUserRole,
};
