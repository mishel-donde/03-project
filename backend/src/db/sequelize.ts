import config from "config";
import { Sequelize } from "sequelize-typescript";
import Follow from "../models/follow";
import User from "../models/user";
import Vacation from "../models/vacation";

const logging = config.get<boolean>("sequelize.logging") ? console.log : false;

const sequelize = new Sequelize({
  models: [Follow, User, Vacation],
  dialect: "mysql",
  ...config.get("db"),
  logging,
});

export default sequelize;
