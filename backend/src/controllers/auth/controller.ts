import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import { createHmac } from "crypto";
import config from "config";
import { sign } from "jsonwebtoken";
import AppError from "../../errors/app-error";
import { StatusCodes } from "http-status-codes";

function hashPassword(password: string): string {
  return createHmac("sha256", config.get<string>("app.secret"))
    .update(password)
    .digest("hex");
}

export async function login(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
        password: hashPassword(password),
      },
    });

    if (!user)
      return next(new AppError(StatusCodes.UNAUTHORIZED, "wrong credentials"));

    const jwt = sign(
      user.get({ plain: true }),
      config.get<string>("app.jwtSecret")
    );
    res.json({ jwt });
  } catch (e) {
    next(e);
  }
}

export async function signup(
  req: Request<
    {},
    {},
    { firstName: string; password: string; lastName: string; email: string }
  >,
  res: Response,
  next: NextFunction
) {
  const { firstName, password, lastName, email } = req.body;
  try {
    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashPassword(password),
    });

    const jwt = sign(
      user.get({ plain: true }),
      config.get<string>("app.jwtSecret")
    );
    res.json({ jwt });
  } catch (e) {
    if (e.email === "SequelizeUniqueConstraintError")
      return next(
        new AppError(
          StatusCodes.CONFLICT,
          `email ${email} already exists. Please choose another email.`
        )
      );
    next(e);
  }
}
