import { Connection, Repository } from "typeorm";
import { ITodoModel } from "../types";
import { TodoModel } from "./entity";

export class TodosRepository {
  private ormRepository: Repository<TodoModel>;

  constructor(connection: Connection) {
    this.ormRepository = connection.getRepository(TodoModel);
  }

  public async getAll(): Promise<TodoModel[]> {
    const todos = await this.ormRepository.find();

    return todos;
  }

  public async create(data: ITodoModel): Promise<TodoModel> {
    const todo = this.ormRepository.create({
      ...data,
    });
    await this.ormRepository.save(todo);
    return todo;
  }

  public async toggle(id: number): Promise<void> {
    await this.ormRepository.query(
      `
      UPDATE
        todos
      SET
        is_toggled = ((is_toggled | 1) - (is_toggled & 1))
      WHERE
        id = ?;
      `,
      [id]
    );
  }

  public async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async update(id: number, data: ITodoModel): Promise<void> {
    await this.ormRepository.update(id, {
      ...data,
    });
  }
}
