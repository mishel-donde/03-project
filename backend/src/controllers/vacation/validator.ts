import Joi from "joi";

export const vacationValidator = Joi.object({
  destination: Joi.string().min(3).max(50).required(),
  vacationDescription: Joi.string().min(10).max(255).required(),
  startingDate: Joi.date().required(),
  endingDate: Joi.date().required(),
  price: Joi.number().required(),
});

export const vacationIdValidator = Joi.object({
  vacationId: Joi.string().uuid().required(),
});

export const newVacationFilesValidator = Joi.object({
  postImage: Joi.object({
    mimetype: Joi.string().valid("image/png", "image/jpg", "image/jpeg"),
  })
    .unknown(true)
    .optional(),
});
