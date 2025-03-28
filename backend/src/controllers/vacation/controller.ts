import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import Vacation from "../../models/vacation";
import AppError from "../../errors/app-error";
import { StatusCodes } from "http-status-codes";

export async function getAllVacation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allVacation = await Vacation.findAll({
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(allVacation);
  } catch (e) {
    next(e);
  }
}

export async function createNewVacation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let createParams = { ...req.body };

  if (req.imageUrl) {
    const { imageUrl } = req;
    createParams = { ...createParams, imageUrl };
  }

  try {
    const newVacation = await Vacation.create(createParams);

    res.json(newVacation);
  } catch (e) {
    next(e);
  }
}

export async function removeVacation(
  req: Request<{ vacationId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { vacationId } = req.params;

    const deletedRows = await Vacation.destroy({
      where: { vacationId },
    });

    if (deletedRows === 0)
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          "the vacation you were trying to delete does not exist"
        )
      );

    res.json({
      success: true,
    });
  } catch (e) {
    next(e);
  }
}

export async function updateVacation(
  req: Request<
    { vacationId: string },
    {},
    {
      destination: string;
      vacationDescription: string;
      startingDate: Date;
      endingDate: Date;
      price: number;
    }
  >,
  res: Response,
  next: NextFunction
) {
  try {
    const { vacationId } = req.params;
    const {
      destination,
      vacationDescription,
      startingDate,
      endingDate,
      price,
    } = req.body;

    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation)
      return next(
        new AppError(
          StatusCodes.NOT_FOUND,
          "the vacation you were trying to update does not exist"
        )
      );

    vacation.destination = destination;
    vacation.vacationDescription = vacationDescription;
    vacation.startingDate = startingDate;
    vacation.endingDate = endingDate;
    vacation.price = price;

    await vacation.save();
    res.json({ vacation });
  } catch (e) {
    next(e);
  }
}
