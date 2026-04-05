var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";

// src/app/routes/index.ts
import { Router as Router3 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/modules/auth/auth.service.ts
import status3 from "http-status";

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/config/env.ts
import dotenv from "dotenv";
import status from "http-status";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_EMAIL",
    "ADMIN_PASSWORD"
  ];
  requiredEnvVars.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError_default(status.INTERNAL_SERVER_ERROR, `Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    PORT: process.env.PORT || "8001",
    NODE_ENV: process.env.NODE_ENV || "production",
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    EMAIL_SENDER: {
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      API_KEY: process.env.CLOUDINARY_API_KEY,
      API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/app/utils/email.ts
import ejs from "ejs";
import status2 from "http-status";
import nodemailer from "nodemailer";
import path from "path";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", error.message);
    throw new AppError_default(status2.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id                 String     @id\n  name               String\n  email              String\n  emailVerified      Boolean    @default(false)\n  role               Role       @default(USER)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  fcmToken           String?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  profile            profile[]\n\n  @@unique([email])\n  @@unique([name])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nmodel profile {\n  id        String    @id\n  firstName String    @default("")\n  lastName  String    @default("")\n  phone     String?\n  image     String?\n  bio       String?\n  address   String    @default("")\n  city      String    @default("")\n  country   String    @default("")\n  userId    String    @unique\n  user      User      @relation(fields: [userId], references: [id])\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("profile")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"fcmToken","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"profile","kind":"object","type":"profile","relationName":"UserToprofile"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"firstName","kind":"scalar","type":"String"},{"name":"lastName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToprofile"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"profile"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","profile","_count","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","profile.findUnique","profile.findUniqueOrThrow","profile.findFirst","profile.findFirstOrThrow","profile.findMany","profile.createOne","profile.createMany","profile.createManyAndReturn","profile.updateOne","profile.updateMany","profile.updateManyAndReturn","profile.upsertOne","profile.deleteOne","profile.deleteMany","profile.groupBy","profile.aggregate","AND","OR","NOT","id","firstName","lastName","phone","image","bio","address","city","country","userId","isDeleted","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","Role","role","UserStatus","status","needPasswordChange","fcmToken","every","some","none","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany"]'),
  graph: "jAIqUBIEAACpAQAgBQAAqgEAIAYAAKsBACBeAACjAQAwXwAAEwAQYAAAowEAMGEBAAAAAWsgAKQBACFsQACnAQAhbUAAmQEAIW5AAJkBACGJAQEAAAABigEBAAAAAYsBIACkAQAhjQEAAKUBjQEijwEAAKYBjwEikAEgAKQBACGRAQEAqAEAIQEAAAABACAMAwAArQEAIF4AAK8BADBfAAADABBgAACvAQAwYQEAmAEAIWoBAJgBACFtQACZAQAhbkAAmQEAIXxAAJkBACGGAQEAmAEAIYcBAQCoAQAhiAEBAKgBACEDAwAA-gEAIIcBAACwAQAgiAEAALABACAMAwAArQEAIF4AAK8BADBfAAADABBgAACvAQAwYQEAAAABagEAmAEAIW1AAJkBACFuQACZAQAhfEAAmQEAIYYBAQAAAAGHAQEAqAEAIYgBAQCoAQAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACtAQAgXgAArgEAMF8AAAcAEGAAAK4BADBhAQCYAQAhagEAmAEAIW1AAJkBACFuQACZAQAhfQEAmAEAIX4BAJgBACF_AQCoAQAhgAEBAKgBACGBAQEAqAEAIYIBQACnAQAhgwFAAKcBACGEAQEAqAEAIYUBAQCoAQAhCAMAAPoBACB_AACwAQAggAEAALABACCBAQAAsAEAIIIBAACwAQAggwEAALABACCEAQAAsAEAIIUBAACwAQAgEQMAAK0BACBeAACuAQAwXwAABwAQYAAArgEAMGEBAAAAAWoBAJgBACFtQACZAQAhbkAAmQEAIX0BAJgBACF-AQCYAQAhfwEAqAEAIYABAQCoAQAhgQEBAKgBACGCAUAApwEAIYMBQACnAQAhhAEBAKgBACGFAQEAqAEAIQMAAAAHACABAAAIADACAAAJACASAwAArQEAIF4AAKwBADBfAAALABBgAACsAQAwYQEAmAEAIWIBAJgBACFjAQCYAQAhZAEAqAEAIWUBAKgBACFmAQCoAQAhZwEAmAEAIWgBAJgBACFpAQCYAQAhagEAmAEAIWsgAKQBACFsQACnAQAhbUAAmQEAIW5AAJkBACEFAwAA-gEAIGQAALABACBlAACwAQAgZgAAsAEAIGwAALABACASAwAArQEAIF4AAKwBADBfAAALABBgAACsAQAwYQEAAAABYgEAmAEAIWMBAJgBACFkAQCoAQAhZQEAqAEAIWYBAKgBACFnAQCYAQAhaAEAmAEAIWkBAJgBACFqAQAAAAFrIACkAQAhbEAApwEAIW1AAJkBACFuQACZAQAhAwAAAAsAIAEAAAwAMAIAAA0AIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAABACASBAAAqQEAIAUAAKoBACAGAACrAQAgXgAAowEAMF8AABMAEGAAAKMBADBhAQCYAQAhayAApAEAIWxAAKcBACFtQACZAQAhbkAAmQEAIYkBAQCYAQAhigEBAJgBACGLASAApAEAIY0BAAClAY0BIo8BAACmAY8BIpABIACkAQAhkQEBAKgBACEFBAAA9wEAIAUAAPgBACAGAAD5AQAgbAAAsAEAIJEBAACwAQAgAwAAABMAIAEAABQAMAIAAAEAIAMAAAATACABAAAUADACAAABACADAAAAEwAgAQAAFAAwAgAAAQAgDwQAAPQBACAFAAD1AQAgBgAA9gEAIGEBAAAAAWsgAAAAAWxAAAAAAW1AAAAAAW5AAAAAAYkBAQAAAAGKAQEAAAABiwEgAAAAAY0BAAAAjQECjwEAAACPAQKQASAAAAABkQEBAAAAAQENAAAYACAMYQEAAAABayAAAAABbEAAAAABbUAAAAABbkAAAAABiQEBAAAAAYoBAQAAAAGLASAAAAABjQEAAACNAQKPAQAAAI8BApABIAAAAAGRAQEAAAABAQ0AABoAMAENAAAaADAPBAAAzQEAIAUAAM4BACAGAADPAQAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhAgAAAAEAIA0AAB0AIAxhAQC0AQAhayAAtgEAIWxAALcBACFtQAC4AQAhbkAAuAEAIYkBAQC0AQAhigEBALQBACGLASAAtgEAIY0BAADLAY0BIo8BAADMAY8BIpABIAC2AQAhkQEBALUBACECAAAAEwAgDQAAHwAgAgAAABMAIA0AAB8AIAMAAAABACAUAAAYACAVAAAdACABAAAAAQAgAQAAABMAIAUHAADIAQAgGgAAygEAIBsAAMkBACBsAACwAQAgkQEAALABACAPXgAAnAEAMF8AACYAEGAAAJwBADBhAQCFAQAhayAAhwEAIWxAAIgBACFtQACJAQAhbkAAiQEAIYkBAQCFAQAhigEBAIUBACGLASAAhwEAIY0BAACdAY0BIo8BAACeAY8BIpABIACHAQAhkQEBAIYBACEDAAAAEwAgAQAAJQAwGQAAJgAgAwAAABMAIAEAABQAMAIAAAEAIAEAAAAFACABAAAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgCQMAAMcBACBhAQAAAAFqAQAAAAFtQAAAAAFuQAAAAAF8QAAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAEBDQAALgAgCGEBAAAAAWoBAAAAAW1AAAAAAW5AAAAAAXxAAAAAAYYBAQAAAAGHAQEAAAABiAEBAAAAAQENAAAwADABDQAAMAAwCQMAAMYBACBhAQC0AQAhagEAtAEAIW1AALgBACFuQAC4AQAhfEAAuAEAIYYBAQC0AQAhhwEBALUBACGIAQEAtQEAIQIAAAAFACANAAAzACAIYQEAtAEAIWoBALQBACFtQAC4AQAhbkAAuAEAIXxAALgBACGGAQEAtAEAIYcBAQC1AQAhiAEBALUBACECAAAAAwAgDQAANQAgAgAAAAMAIA0AADUAIAMAAAAFACAUAAAuACAVAAAzACABAAAABQAgAQAAAAMAIAUHAADDAQAgGgAAxQEAIBsAAMQBACCHAQAAsAEAIIgBAACwAQAgC14AAJsBADBfAAA8ABBgAACbAQAwYQEAhQEAIWoBAIUBACFtQACJAQAhbkAAiQEAIXxAAIkBACGGAQEAhQEAIYcBAQCGAQAhiAEBAIYBACEDAAAAAwAgAQAAOwAwGQAAPAAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAMIBACBhAQAAAAFqAQAAAAFtQAAAAAFuQAAAAAF9AQAAAAF-AQAAAAF_AQAAAAGAAQEAAAABgQEBAAAAAYIBQAAAAAGDAUAAAAABhAEBAAAAAYUBAQAAAAEBDQAARAAgDWEBAAAAAWoBAAAAAW1AAAAAAW5AAAAAAX0BAAAAAX4BAAAAAX8BAAAAAYABAQAAAAGBAQEAAAABggFAAAAAAYMBQAAAAAGEAQEAAAABhQEBAAAAAQENAABGADABDQAARgAwDgMAAMEBACBhAQC0AQAhagEAtAEAIW1AALgBACFuQAC4AQAhfQEAtAEAIX4BALQBACF_AQC1AQAhgAEBALUBACGBAQEAtQEAIYIBQAC3AQAhgwFAALcBACGEAQEAtQEAIYUBAQC1AQAhAgAAAAkAIA0AAEkAIA1hAQC0AQAhagEAtAEAIW1AALgBACFuQAC4AQAhfQEAtAEAIX4BALQBACF_AQC1AQAhgAEBALUBACGBAQEAtQEAIYIBQAC3AQAhgwFAALcBACGEAQEAtQEAIYUBAQC1AQAhAgAAAAcAIA0AAEsAIAIAAAAHACANAABLACADAAAACQAgFAAARAAgFQAASQAgAQAAAAkAIAEAAAAHACAKBwAAvgEAIBoAAMABACAbAAC_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_gEAIBUAAIECACCXAQAA_wEAIJgBAACAAgAgnQEAAAEAIAMUAAD-AQAglwEAAP8BACCdAQAAAQAgAAAAAZoBAAAAjQECAZoBAAAAjwECCxQAAOgBADAVAADtAQAwlwEAAOkBADCYAQAA6gEAMJkBAADrAQAgmgEAAOwBADCbAQAA7AEAMJwBAADsAQAwnQEAAOwBADCeAQAA7gEAMJ8BAADvAQAwCxQAANwBADAVAADhAQAwlwEAAN0BADCYAQAA3gEAMJkBAADfAQAgmgEAAOABADCbAQAA4AEAMJwBAADgAQAwnQEAAOABADCeAQAA4gEAMJ8BAADjAQAwCxQAANABADAVAADVAQAwlwEAANEBADCYAQAA0gEAMJkBAADTAQAgmgEAANQBADCbAQAA1AEAMJwBAADUAQAwnQEAANQBADCeAQAA1gEAMJ8BAADXAQAwDWEBAAAAAWIBAAAAAWMBAAAAAWQBAAAAAWUBAAAAAWYBAAAAAWcBAAAAAWgBAAAAAWkBAAAAAWsgAAAAAWxAAAAAAW1AAAAAAW5AAAAAAQIAAAANACAUAADbAQAgAwAAAA0AIBQAANsBACAVAADaAQAgAQ0AAP0BADASAwAArQEAIF4AAKwBADBfAAALABBgAACsAQAwYQEAAAABYgEAmAEAIWMBAJgBACFkAQCoAQAhZQEAqAEAIWYBAKgBACFnAQCYAQAhaAEAmAEAIWkBAJgBACFqAQAAAAFrIACkAQAhbEAApwEAIW1AAJkBACFuQACZAQAhAgAAAA0AIA0AANoBACACAAAA2AEAIA0AANkBACARXgAA1wEAMF8AANgBABBgAADXAQAwYQEAmAEAIWIBAJgBACFjAQCYAQAhZAEAqAEAIWUBAKgBACFmAQCoAQAhZwEAmAEAIWgBAJgBACFpAQCYAQAhagEAmAEAIWsgAKQBACFsQACnAQAhbUAAmQEAIW5AAJkBACERXgAA1wEAMF8AANgBABBgAADXAQAwYQEAmAEAIWIBAJgBACFjAQCYAQAhZAEAqAEAIWUBAKgBACFmAQCoAQAhZwEAmAEAIWgBAJgBACFpAQCYAQAhagEAmAEAIWsgAKQBACFsQACnAQAhbUAAmQEAIW5AAJkBACENYQEAtAEAIWIBALQBACFjAQC0AQAhZAEAtQEAIWUBALUBACFmAQC1AQAhZwEAtAEAIWgBALQBACFpAQC0AQAhayAAtgEAIWxAALcBACFtQAC4AQAhbkAAuAEAIQ1hAQC0AQAhYgEAtAEAIWMBALQBACFkAQC1AQAhZQEAtQEAIWYBALUBACFnAQC0AQAhaAEAtAEAIWkBALQBACFrIAC2AQAhbEAAtwEAIW1AALgBACFuQAC4AQAhDWEBAAAAAWIBAAAAAWMBAAAAAWQBAAAAAWUBAAAAAWYBAAAAAWcBAAAAAWgBAAAAAWkBAAAAAWsgAAAAAWxAAAAAAW1AAAAAAW5AAAAAAQxhAQAAAAFtQAAAAAFuQAAAAAF9AQAAAAF-AQAAAAF_AQAAAAGAAQEAAAABgQEBAAAAAYIBQAAAAAGDAUAAAAABhAEBAAAAAYUBAQAAAAECAAAACQAgFAAA5wEAIAMAAAAJACAUAADnAQAgFQAA5gEAIAENAAD8AQAwEQMAAK0BACBeAACuAQAwXwAABwAQYAAArgEAMGEBAAAAAWoBAJgBACFtQACZAQAhbkAAmQEAIX0BAJgBACF-AQCYAQAhfwEAqAEAIYABAQCoAQAhgQEBAKgBACGCAUAApwEAIYMBQACnAQAhhAEBAKgBACGFAQEAqAEAIQIAAAAJACANAADmAQAgAgAAAOQBACANAADlAQAgEF4AAOMBADBfAADkAQAQYAAA4wEAMGEBAJgBACFqAQCYAQAhbUAAmQEAIW5AAJkBACF9AQCYAQAhfgEAmAEAIX8BAKgBACGAAQEAqAEAIYEBAQCoAQAhggFAAKcBACGDAUAApwEAIYQBAQCoAQAhhQEBAKgBACEQXgAA4wEAMF8AAOQBABBgAADjAQAwYQEAmAEAIWoBAJgBACFtQACZAQAhbkAAmQEAIX0BAJgBACF-AQCYAQAhfwEAqAEAIYABAQCoAQAhgQEBAKgBACGCAUAApwEAIYMBQACnAQAhhAEBAKgBACGFAQEAqAEAIQxhAQC0AQAhbUAAuAEAIW5AALgBACF9AQC0AQAhfgEAtAEAIX8BALUBACGAAQEAtQEAIYEBAQC1AQAhggFAALcBACGDAUAAtwEAIYQBAQC1AQAhhQEBALUBACEMYQEAtAEAIW1AALgBACFuQAC4AQAhfQEAtAEAIX4BALQBACF_AQC1AQAhgAEBALUBACGBAQEAtQEAIYIBQAC3AQAhgwFAALcBACGEAQEAtQEAIYUBAQC1AQAhDGEBAAAAAW1AAAAAAW5AAAAAAX0BAAAAAX4BAAAAAX8BAAAAAYABAQAAAAGBAQEAAAABggFAAAAAAYMBQAAAAAGEAQEAAAABhQEBAAAAAQdhAQAAAAFtQAAAAAFuQAAAAAF8QAAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAECAAAABQAgFAAA8wEAIAMAAAAFACAUAADzAQAgFQAA8gEAIAENAAD7AQAwDAMAAK0BACBeAACvAQAwXwAAAwAQYAAArwEAMGEBAAAAAWoBAJgBACFtQACZAQAhbkAAmQEAIXxAAJkBACGGAQEAAAABhwEBAKgBACGIAQEAqAEAIQIAAAAFACANAADyAQAgAgAAAPABACANAADxAQAgC14AAO8BADBfAADwAQAQYAAA7wEAMGEBAJgBACFqAQCYAQAhbUAAmQEAIW5AAJkBACF8QACZAQAhhgEBAJgBACGHAQEAqAEAIYgBAQCoAQAhC14AAO8BADBfAADwAQAQYAAA7wEAMGEBAJgBACFqAQCYAQAhbUAAmQEAIW5AAJkBACF8QACZAQAhhgEBAJgBACGHAQEAqAEAIYgBAQCoAQAhB2EBALQBACFtQAC4AQAhbkAAuAEAIXxAALgBACGGAQEAtAEAIYcBAQC1AQAhiAEBALUBACEHYQEAtAEAIW1AALgBACFuQAC4AQAhfEAAuAEAIYYBAQC0AQAhhwEBALUBACGIAQEAtQEAIQdhAQAAAAFtQAAAAAFuQAAAAAF8QAAAAAGGAQEAAAABhwEBAAAAAYgBAQAAAAEEFAAA6AEAMJcBAADpAQAwmQEAAOsBACCdAQAA7AEAMAQUAADcAQAwlwEAAN0BADCZAQAA3wEAIJ0BAADgAQAwBBQAANABADCXAQAA0QEAMJkBAADTAQAgnQEAANQBADAAAAAFBAAA9wEAIAUAAPgBACAGAAD5AQAgbAAAsAEAIJEBAACwAQAgB2EBAAAAAW1AAAAAAW5AAAAAAXxAAAAAAYYBAQAAAAGHAQEAAAABiAEBAAAAAQxhAQAAAAFtQAAAAAFuQAAAAAF9AQAAAAF-AQAAAAF_AQAAAAGAAQEAAAABgQEBAAAAAYIBQAAAAAGDAUAAAAABhAEBAAAAAYUBAQAAAAENYQEAAAABYgEAAAABYwEAAAABZAEAAAABZQEAAAABZgEAAAABZwEAAAABaAEAAAABaQEAAAABayAAAAABbEAAAAABbUAAAAABbkAAAAABDgUAAPUBACAGAAD2AQAgYQEAAAABayAAAAABbEAAAAABbUAAAAABbkAAAAABiQEBAAAAAYoBAQAAAAGLASAAAAABjQEAAACNAQKPAQAAAI8BApABIAAAAAGRAQEAAAABAgAAAAEAIBQAAP4BACADAAAAEwAgFAAA_gEAIBUAAIICACAQAAAAEwAgBQAAzgEAIAYAAM8BACANAACCAgAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhDgUAAM4BACAGAADPAQAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhDgQAAPQBACAGAAD2AQAgYQEAAAABayAAAAABbEAAAAABbUAAAAABbkAAAAABiQEBAAAAAYoBAQAAAAGLASAAAAABjQEAAACNAQKPAQAAAI8BApABIAAAAAGRAQEAAAABAgAAAAEAIBQAAIMCACADAAAAEwAgFAAAgwIAIBUAAIcCACAQAAAAEwAgBAAAzQEAIAYAAM8BACANAACHAgAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhDgQAAM0BACAGAADPAQAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhDgQAAPQBACAFAAD1AQAgYQEAAAABayAAAAABbEAAAAABbUAAAAABbkAAAAABiQEBAAAAAYoBAQAAAAGLASAAAAABjQEAAACNAQKPAQAAAI8BApABIAAAAAGRAQEAAAABAgAAAAEAIBQAAIgCACADAAAAEwAgFAAAiAIAIBUAAIwCACAQAAAAEwAgBAAAzQEAIAUAAM4BACANAACMAgAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhDgQAAM0BACAFAADOAQAgYQEAtAEAIWsgALYBACFsQAC3AQAhbUAAuAEAIW5AALgBACGJAQEAtAEAIYoBAQC0AQAhiwEgALYBACGNAQAAywGNASKPAQAAzAGPASKQASAAtgEAIZEBAQC1AQAhBAQGAgUKAwYOBAcABQEDAAEBAwABAQMAAQMEDwAFEAAGEQAAAAADBwAKGgALGwAMAAAAAwcAChoACxsADAEDAAEBAwABAwcAERoAEhsAEwAAAAMHABEaABIbABMBAwABAQMAAQMHABgaABkbABoAAAADBwAYGgAZGwAaAAAAAwcAIBoAIRsAIgAAAAMHACAaACEbACIBAwABAQMAAQMHACcaACgbACkAAAADBwAnGgAoGwApCAIBCRIBChUBCxYBDBcBDhkBDxsGEBwHER4BEiAGEyEIFiIBFyMBGCQGHCcJHSgNHikCHyoCICsCISwCIi0CIy8CJDEGJTIOJjQCJzYGKDcPKTgCKjkCKzoGLD0QLT4ULj8DL0ADMEEDMUIDMkMDM0UDNEcGNUgVNkoDN0wGOE0WOU4DOk8DO1AGPFMXPVQbPlYcP1ccQFocQVscQlwcQ14cRGAGRWEdRmMcR2UGSGYeSWccSmgcS2kGTGwfTW0jTm4ET28EUHAEUXEEUnIEU3QEVHYGVXckVnkEV3sGWHwlWX0EWn4EW38GXIIBJl2DASo"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  profile: "profile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  fcmToken: "fcmToken",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  firstName: "firstName",
  lastName: "lastName",
  phone: "phone",
  image: "image",
  bio: "bio",
  address: "address",
  city: "city",
  country: "country",
  userId: "userId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      // callbackUrl: envVars.GOOGLE_CALLBACK_URL,
      mapProfileToUser: () => {
        return {
          role: Role.USER,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          isDeleted: false,
          deletedAt: null
        };
      }
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (!user) {
            console.error(`User with email ${email} not found. Cannot send verification OTP.`);
            return;
          }
          if (user && user.role === Role.SUPER_ADMIN) {
            console.log(`User with email ${email} is a super admin. Skipping sending verification OTP.`);
            return;
          }
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify your email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password Reset OTP",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 minutes in seconds
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24,
    // 1 day in seconds
    updateAge: 60 * 60 * 60 * 24,
    // 1 day in seconds
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24
      // 1 day in seconds
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:8000", envVars.FRONTEND_URL],
  advanced: {
    // disableCSRFCheck: true,
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const data = jwt.verify(token, secret);
    return {
      success: true,
      data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
var register = async (payload) => {
  const { name, email, password } = payload;
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  if (existingUser) {
    throw new AppError_default(status3.CONFLICT, "Email already registered");
  }
  try {
    const authResponse = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      }
    });
    if (!authResponse || !authResponse.user) {
      console.error("Better Auth signup failed:", authResponse);
      throw new AppError_default(status3.BAD_REQUEST, "Failed to register user with auth provider");
    }
    const user = await prisma.$transaction(async (tx) => {
      const existingDbUser = await tx.user.findUnique({
        where: { id: authResponse.user.id }
      });
      if (existingDbUser) {
        return existingDbUser;
      }
      return await tx.user.create({
        data: {
          id: authResponse.user.id,
          name: authResponse.user.name,
          email: authResponse.user.email,
          role: authResponse.user.role,
          status: authResponse.user.status,
          emailVerified: authResponse.user.emailVerified || false,
          isDeleted: authResponse.user.isDeleted || false
        }
      });
    });
    await prisma.profile.create({
      data: {
        id: user.id,
        userId: user.id
      }
    });
    return {
      user
    };
  } catch (error) {
    if (error instanceof AppError_default) {
      throw error;
    }
    try {
      const createdUser = await prisma.user.findUnique({
        where: { email }
      });
      if (createdUser) {
        await prisma.user.delete({
          where: { id: createdUser.id }
        });
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }
    console.error("Error during registration:", error);
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    throw new AppError_default(status3.INTERNAL_SERVER_ERROR, errorMessage);
  }
};
var login = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data.user) {
    throw new AppError_default(status3.BAD_REQUEST, "Invalid email or password");
  }
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status3.FORBIDDEN, "Your account has been blocked. Please contact support.");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "Your account has been deleted. Please contact support.");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: data.user.role,
    name: data.user.name,
    email: data.user.email,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return {
    accessToken,
    refreshToken,
    ...data
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      profile: true
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status3.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status3.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status3.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: isUserExist.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var googleLoginSuccess = async (session) => {
  const isExists = await prisma.user.findUnique({
    where: {
      id: session.user.id
    }
  });
  if (!isExists) {
    await prisma.user.create({
      data: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name
  });
  return {
    accessToken,
    refreshToken
  };
};
var updateProfile = async (user, payload) => {
  const { name, image, firstName, lastName, phone, bio, address, city, country } = payload;
  if (name) {
    await prisma.user.update({
      where: {
        id: user.userId
      },
      data: {
        name
      }
    });
  }
  const result = await prisma.profile.upsert({
    where: {
      userId: user.userId
    },
    update: {
      firstName: firstName ?? void 0,
      lastName: lastName ?? void 0,
      phone: phone ?? void 0,
      bio: bio ?? void 0,
      address: address ?? void 0,
      city: city ?? void 0,
      country: country ?? void 0,
      image: image ? image : void 0
      // Only update image if it's provided
    },
    create: {
      id: user.userId,
      userId: user.userId,
      firstName: firstName ?? void 0,
      lastName: lastName ?? void 0,
      phone: phone ?? void 0,
      bio: bio ?? void 0,
      address: address ?? void 0,
      city: city ?? void 0,
      country: country ?? void 0,
      image: image ? image : void 0
      // Only set image if it's provided
    }
  });
  return result;
};
var AuthService = {
  register,
  login,
  getMe,
  getNewToken,
  changePassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess,
  updateProfile
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/app/modules/auth/auth.controller.ts
import status4 from "http-status";
var register2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.register(payload);
  sendResponse(res, {
    httpStatusCode: status4.CREATED,
    success: true,
    message: "User registered successfully",
    data: result
  });
});
var login2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.login(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest
    }
  });
});
var getMe2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await AuthService.getMe(user);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "User profile fetched successfully",
      data: result
    });
  }
);
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError_default(status4.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);
var changePassword2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.changePassword(payload, betterAuthSessionToken);
    const { accessToken, refreshToken, token } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "Password changed successfully",
      data: result
    });
  }
);
var logoutUser2 = catchAsync(
  async (req, res) => {
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    const result = await AuthService.logoutUser(betterAuthSessionToken);
    CookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    CookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    CookieUtils.clearCookie(res, "better-auth.session_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "User logged out successfully",
      data: result
    });
  }
);
var verifyEmail2 = catchAsync(
  async (req, res) => {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "Email verified successfully"
    });
  }
);
var forgetPassword2 = catchAsync(
  async (req, res) => {
    const { email } = req.body;
    await AuthService.forgetPassword(email);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "Password reset OTP sent to email successfully"
    });
  }
);
var resetPassword2 = catchAsync(
  async (req, res) => {
    const { email, otp, newPassword } = req.body;
    await AuthService.resetPassword(email, otp, newPassword);
    sendResponse(res, {
      httpStatusCode: status4.OK,
      success: true,
      message: "Password reset successfully"
    });
  }
);
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      "Cookie": `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var updateProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const result = await AuthService.updateProfile(user, payload);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var AuthController = {
  register: register2,
  login: login2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError,
  updateProfile: updateProfile2
};

// src/app/middleware/checkAuth.ts
import status5 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
    if (!sessionToken) {
      throw new Error("Unauthorized access! No session token provided.");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring Soon!!");
        }
        if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
          throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! User is not active.");
        }
        if (user.isDeleted) {
          throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! User is deleted.");
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new AppError_default(status5.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
        }
        req.user = {
          userId: user.id,
          role: user.role,
          email: user.email
        };
      }
      const accessToken2 = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken2) {
        throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! No access token provided.");
      }
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status5.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(status5.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/auth/auth.validation.ts
import z from "zod";
var registerZodSchema = z.object({
  name: z.string("Name must be a string").min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.email("Email is required and must be a valid email address"),
  password: z.string("Password must be a string").min(6, "Password must be at least 6 characters").max(128, "Password must be less than 128 characters")
});
var loginZodSchema = z.object({
  email: z.email("Email is required and must be a valid email address"),
  password: z.string("Password must be a string").min(1, "Password is required")
});
var changePasswordZodSchema = z.object({
  currentPassword: z.string("Current password must be a string").min(1, "Current password is required"),
  newPassword: z.string("New password must be a string").min(6, "New password must be at least 6 characters").max(128, "Password must be less than 128 characters")
});
var verifyEmailZodSchema = z.object({
  email: z.email("Email is required and must be a valid email address"),
  otp: z.string("OTP must be a string").min(1, "OTP is required")
});
var forgetPasswordZodSchema = z.object({
  email: z.email("Email is required and must be a valid email address")
});
var resetPasswordZodSchema = z.object({
  email: z.email("Email is required and must be a valid email address"),
  otp: z.string("OTP must be a string").min(1, "OTP is required"),
  newPassword: z.string("New password must be a string").min(6, "New password must be at least 6 characters").max(128, "Password must be less than 128 characters")
});
var AuthValidation = {
  registerZodSchema,
  loginZodSchema,
  changePasswordZodSchema,
  verifyEmailZodSchema,
  forgetPasswordZodSchema,
  resetPasswordZodSchema
};

// src/app/config/multer.config.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status6 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUD_NAME,
  api_key: envVars.CLOUDINARY.API_KEY,
  api_secret: envVars.CLOUDINARY.API_SECRET
});
var cloudinaryDelete = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      console.log(`file ${publicId} deleted successfully from Cloudinary.`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status6.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/app/config/multer.config.ts
import multer from "multer";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `Movies/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/app/modules/auth/auth.middleware.ts
var updateProfileMiddleware = (req, res, next) => {
  if (req.body.data) {
    try {
      req.body = JSON.parse(req.body.data);
    } catch (e) {
      console.error("Error parsing body.data:", e);
    }
  }
  const files = req.files;
  if (files?.image?.[0]) {
    req.body.image = files.image[0].path;
  }
  next();
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(AuthValidation.registerZodSchema), AuthController.register);
router.post("/login", validateRequest(AuthValidation.loginZodSchema), AuthController.login);
router.get("/me", checkAuth(Role.ADMIN, Role.USER), AuthController.getMe);
router.post("/refresh-token", AuthController.getNewToken);
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.USER),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);
router.post(
  "/logout",
  checkAuth(Role.ADMIN, Role.USER),
  AuthController.logoutUser
);
router.post("/verify-email", validateRequest(AuthValidation.verifyEmailZodSchema), AuthController.verifyEmail);
router.post("/forget-password", validateRequest(AuthValidation.forgetPasswordZodSchema), AuthController.forgetPassword);
router.post("/reset-password", validateRequest(AuthValidation.resetPasswordZodSchema), AuthController.resetPassword);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
router.patch(
  "/updateProfile",
  checkAuth(Role.ADMIN, Role.USER),
  multerUpload.fields([{ name: "image", maxCount: 1 }]),
  updateProfileMiddleware,
  AuthController.updateProfile
);
var AuthRoutes = router;

// src/app/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/app/modules/user/user.controller.ts
import status7 from "http-status";

// src/app/utils/queryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = {
      where: {},
      include: {},
      orderBy: {},
      skip: 0,
      take: 10
    };
    this.countQuery = {
      where: {}
    };
  }
  model;
  queryParams;
  config;
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map(
        (field) => {
          if (field.includes(".")) {
            const parts = field.split(".");
            if (parts.length === 2) {
              const [relation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  [nestedField]: stringFilter2
                }
              };
            } else if (parts.length === 3) {
              const [relation, nestedRelation, nestedField] = parts;
              const stringFilter2 = {
                contains: searchTerm,
                mode: "insensitive"
              };
              return {
                [relation]: {
                  some: {
                    [nestedRelation]: {
                      [nestedField]: stringFilter2
                    }
                  }
                }
              };
            }
          }
          const isArrayField = ["cast", "genres", "platform"].includes(field);
          if (isArrayField) {
            return {
              [field]: {
                hasSome: [searchTerm]
              }
            };
          }
          const stringFilter = {
            contains: searchTerm,
            mode: "insensitive"
          };
          return {
            [field]: stringFilter
          };
        }
      );
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  // /doctors?searchTerm=john&page=1&sortBy=name&specialty=cardiology&appointmentFee[lt]=100 => {}
  // { specialty: 'cardiology', appointmentFee: { lt: '100' } }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") {
        return;
      }
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) {
          return;
        }
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {
              some: {}
            };
            countQueryWhere[relation] = {
              some: {}
            };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) {
        return;
      }
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(value);
        countQueryWhere[key] = this.parseRangeFilter(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedField]: sortOrder
          }
        };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = {
          [relation]: {
            [nestedRelation]: {
              [nestedField]: sortOrder
            }
          }
        };
      } else {
        this.query.orderBy = {
          [sortBy]: sortOrder
        };
      }
    } else {
      this.query.orderBy = {
        [sortBy]: sortOrder
      };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam?.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray?.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = { ...this.query.include, ...relation };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = { ...this.query.include, ...result };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(this.query.where, condition);
    this.countQuery.where = this.deepMerge(this.countQuery.where, condition);
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages
      }
    };
  }
  async count() {
    return await this.model.count(this.countQuery);
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    if (typeof value === "string" && !isNaN(Number(value)) && value != "") {
      return Number(value);
    }
    if (Array.isArray(value)) {
      return { in: value.map((item) => this.parseFilterValue(item)) };
    }
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          if (Array.isArray(operatorValue)) {
            rangeQuery[operator] = operatorValue;
          } else {
            rangeQuery[operator] = [parsedValue];
          }
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/modules/user/user.constant.ts
var userSearchableFields = ["name", "email", "profile.firstName", "profile.lastName", "profile.phone", "profile.address", "profile.city", "profile.country"];
var userFilterableFields = ["name", "email", "role", "status", "createdAt", "updatedAt", "profile.firstName", "profile.lastName", "profile.phone", "profile.address", "profile.city", "profile.country"];
var userIncludeConfig = {
  profile: true
};

// src/app/modules/user/user.service.ts
var getAll = async (query) => {
  const queryBuilder = new QueryBuilder(
    prisma.user,
    query,
    {
      searchableFields: userSearchableFields,
      filterableFields: userFilterableFields
    }
  );
  const result = await queryBuilder.search().filter().where({
    isDeleted: false
  }).include({
    profile: true
  }).dynamicInclude(userIncludeConfig).paginate().sort().execute();
  return result;
};
var getById = async (id) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: { id },
    include: {
      profile: true
    }
  });
  return result;
};
var deleteById = async (id) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.profile.update({
      where: { userId: id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    return await tx.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      },
      include: {
        profile: true
      }
    });
  });
  return result;
};
var changeUserStatus = async (id, status12) => {
  await prisma.user.update({
    where: { id },
    data: {
      status: status12
    },
    include: {
      profile: true
    }
  });
  return { "message": "User status updated successfully" };
};
var changeUserRole = async (id, role) => {
  await prisma.user.update({
    where: { id },
    data: {
      role
    },
    include: {
      profile: true
    }
  });
  return { "message": "User role updated successfully" };
};
var UserService = {
  getAll,
  getById,
  deleteById,
  changeUserStatus,
  changeUserRole
};

// src/app/modules/user/user.controller.ts
var getAll2 = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAll(query);
  sendResponse(res, {
    success: true,
    httpStatusCode: status7.OK,
    message: "User list retrieved successfully",
    data: result,
    meta: result.meta
  });
});
var getById2 = catchAsync(async (req, res) => {
  const result = await UserService.getById(req.params.id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status7.OK,
    message: "User retrieved successfully",
    data: result
  });
});
var deleteById2 = catchAsync(async (req, res) => {
  const result = await UserService.deleteById(req.params.id);
  sendResponse(res, {
    success: true,
    httpStatusCode: status7.OK,
    message: "User deleted successfully",
    data: result
  });
});
var changeUserStatus2 = catchAsync(async (req, res) => {
  const { id, status: status12 } = req.body;
  const result = await UserService.changeUserStatus(id, status12);
  sendResponse(res, {
    success: true,
    httpStatusCode: status12.OK,
    message: "User status updated successfully",
    data: result
  });
});
var changeUserRole2 = catchAsync(async (req, res) => {
  const { id, role } = req.body;
  const result = await UserService.changeUserRole(id, role);
  sendResponse(res, {
    success: true,
    httpStatusCode: status7.OK,
    message: "User role updated successfully",
    data: result
  });
});
var UserController = {
  getAll: getAll2,
  getById: getById2,
  deleteById: deleteById2,
  changeUserStatus: changeUserStatus2,
  changeUserRole: changeUserRole2
};

// src/app/modules/user/user.route.ts
var router2 = Router2();
router2.get("/", checkAuth(Role.ADMIN), UserController.getAll);
router2.get("/:id", checkAuth(Role.ADMIN), UserController.getById);
router2.patch(
  "/change-user-status",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.changeUserStatus
);
router2.patch(
  "/change-user-role",
  checkAuth(Role.SUPER_ADMIN),
  UserController.changeUserRole
);
router2.delete("/:id", checkAuth(Role.ADMIN), UserController.deleteById);
var UserRoutes = router2;

// src/app/routes/index.ts
var router3 = Router3();
router3.use("/auth", AuthRoutes);
router3.use("/users", UserRoutes);
var IndexRoute = router3;

// src/app/middleware/globalErrorHandler.ts
import status10 from "http-status";
import z2 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status8 from "http-status";
var handleZodError = (err) => {
  const statusCode = status8.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join("=>"),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/utils/deleteUploadedFilesFromGlobalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((url) => cloudinaryDelete(url))
      );
      console.log(`
Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to an error during request processing.
`);
    }
  } catch (error) {
    console.error("Error deleting uploaded files:", error);
  }
};

// src/app/errorHelpers/handlePrismaErrors.ts
import status9 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status9.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status9.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status9.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status9.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status9.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status9.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status9.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status9.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status9.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status9.INTERNAL_SERVER_ERROR;
  }
  return status9.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var PrismaClientKnownRequestError3 = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownRequestError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status9.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status9.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status9.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status9.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, _next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from globalErrorHandler:", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let statusCode = status10.INTERNAL_SERVER_ERROR;
  let message;
  let errorSources;
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplified = PrismaClientKnownRequestError3(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplified = handlePrismaClientUnknownRequestError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplified = handlePrismaClientValidationError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplified = handlerPrismaClientRustPanicError();
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplified = handlerPrismaClientInitializationError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;
  } else if (err instanceof z2.ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = [...simplified.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = status10.BAD_REQUEST;
    message = "Malformed JSON in request body.";
    stack = err.stack;
    errorSources = [{ path: "body", message }];
  } else if (err instanceof Error) {
    statusCode = status10.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  } else {
    message = "An unexpected error occurred.";
    errorSources = [{ path: "", message: String(err) }];
  }
  const isDev = envVars.NODE_ENV === "development";
  const errorResponse = {
    success: false,
    message,
    errorSources,
    stack: isDev ? stack : void 0,
    error: isDev ? err : void 0
    // ✅ raw error only in dev
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status11 from "http-status";
var notFound = (req, res) => {
  res.status(status11.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// src/app.ts
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import path3 from "path";
import cors from "cors";
import qs from "qs";
var app = express();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), `src/app/templates`));
app.use(cors({
  origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:8000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/api/auth", toNodeHandler(auth));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoute);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/app/utils/seed.ts
var seedAdmin = async () => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: envVars.ADMIN_EMAIL
      }
    });
    if (existingAdmin) {
      console.log("\u2705 Admin already exists. Skipping seeding.");
      return;
    }
    const admin = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Admin",
        role: Role.ADMIN,
        needPasswordChange: false,
        rememberMe: false
      }
    });
    await prisma.user.update({
      where: {
        id: admin.user.id
      },
      data: {
        emailVerified: true
      }
    });
    console.log("\u{1F680} Admin seeded successfully:", admin.user.email);
  } catch (error) {
    console.error("\u274C Error seeding admin:", error);
    try {
      await prisma.user.delete({
        where: {
          email: envVars.ADMIN_EMAIL
        }
      });
    } catch {
      console.log("Cleanup skipped");
    }
  }
};

// src/server.ts
var server;
var bootstrap = async () => {
  try {
    await seedAdmin();
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootstrap();
