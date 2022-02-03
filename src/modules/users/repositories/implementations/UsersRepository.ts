import { createQueryBuilder, getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const usersWithGames = createQueryBuilder("users", "u").innerJoinAndSelect(
      "u.games",
      "g"
    );
    const result: any = await usersWithGames.getMany();
    const user = result.find((user: User) => user.id === user_id);
    if (!user) throw new Error("Usuario não encontrado");

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM Users ORDER BY first_name ASC");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    console.log(first_name.toLowerCase());

    return this.repository.query(
      `SELECT * FROM "users" 
      WHERE (LOWER(first_name) = '${first_name.toLowerCase()}') 
      AND (LOWER(last_name) = '${last_name.toLowerCase()}')`
    );
  }
}
