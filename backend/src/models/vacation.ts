import {
  AllowNull,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./user";
import Follow from "./follow";

@Table({
  underscored: true,
})
export default class Vacation extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  vacationId: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  destination: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  vacationDescription: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  startingDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endingDate: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  price: number;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  imageUrl: string;

  @BelongsToMany(() => User, () => Follow, "vacationId", "userId")
  followers: User[];
}
