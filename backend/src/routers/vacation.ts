import { Router } from "express";
import {
  createNewVacation,
  getAllVacation,
  removeVacation,
  updateVacation,
} from "../controllers/vacation/controller";
import {
  newVacationFilesValidator,
  vacationIdValidator,
  vacationValidator,
} from "../controllers/vacation/validator";
import enforceAuth from "../middlewares/enforce-auth";
import fileUploader from "../middlewares/file-uploader";
import filesValidation from "../middlewares/files-validation";
import paramsValidation from "../middlewares/params-validation";
import validation from "../middlewares/validation";

const vacationRouter = Router();

vacationRouter.use(enforceAuth);
vacationRouter.get("/", getAllVacation);
vacationRouter.post(
  "/",
  validation(vacationValidator),
  filesValidation(newVacationFilesValidator),
  fileUploader,
  createNewVacation
);
vacationRouter.delete(
  "/:vacationId",
  paramsValidation(vacationIdValidator),
  removeVacation
);
vacationRouter.patch(
  "/:vacationId",
  paramsValidation(vacationIdValidator),
  validation(vacationValidator),
  updateVacation
);
export default vacationRouter;
