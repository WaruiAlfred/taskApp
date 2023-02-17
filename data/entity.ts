import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("todos")
export class TodoModel {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  isCompleted: boolean;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ nullable: true })
  locationName: string;

  @Column({ nullable: true })
  locationCountry: string;
}
