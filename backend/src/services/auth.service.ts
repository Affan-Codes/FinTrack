import mongoose from "mongoose";
import { User } from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";
import type {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";
import {
  ReportFrequencyEnum,
  ReportSetting,
} from "../models/reportSetting.model";
import { calculateNextReportDate } from "../utils/helper";
import { signJwtToken } from "../utils/jwt";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;

  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const existingUser = await User.findOne({ email }).session(session);

      if (existingUser) throw new UnauthorizedException("User already exists");

      const newUser = new User({ ...body });
      await newUser.save({ session });

      const reportSetting = new ReportSetting({
        userId: newUser._id,
        frequency: ReportFrequencyEnum.MONTHLY,
        isEnabled: true,
        nextReportDate: calculateNextReportDate(),
        lastSentDate: null,
      });
      await reportSetting.save({ session });

      return { user: newUser.omitPassword() };
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) throw new NotFoundException("Email/Password not found");

  const isPasswordvalid = await user.comparePassword(password);
  if (!isPasswordvalid)
    throw new UnauthorizedException("Invalid email/password");

  const { token, expiresAt } = signJwtToken({ userId: user.id });

  const reportSetting = await ReportSetting.findOne(
    { userId: user.id },
    { _id: 1, frequency: 1, isEnabled: 1 }
  ).lean();

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
    reportSetting,
  };
};
