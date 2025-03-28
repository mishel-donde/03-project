import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/app-error";
import Follow from "../../models/follow";

export async function followVacation(
  req: Request<{ vacationId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;

    const newFollowVacation = await Follow.create({
      userId: userId,
      vacationId: req.params.vacationId,
    });

    res.json(newFollowVacation);
  } catch (e) {
    if (e.message === "Validation error")
      return next(
        new AppError(StatusCodes.CONFLICT, `You already follow this Vacation.`)
      );
    next(e);
  }
}

export async function unfollowVacation(
  req: Request<{ vacationId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId;
    const isUnfollowed = await Follow.destroy({
      where: {
        userId: userId,
        vacationId: req.params.vacationId,
      },
    });
    if (!isUnfollowed)
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          "tried to delete Unexisting Vacation"
        )
      );
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
}
