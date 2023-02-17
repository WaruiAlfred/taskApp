import { useEffect, useState } from "react";
import { useDatabaseConnection } from "../../contexts/database";
import { ITodoModel } from "../../types";

const useTaskListContext = () => {
  const [tasksFetched, setTasksFetched] = useState(false);
  const [tasks, setTasks] = useState<ITodoModel[]>([]);
  const [filterValue, setFilterValue] = useState<boolean | null>(null);

  const { todosRepository } = useDatabaseConnection();

  useEffect(() => {
    fetchTasks();
  }, [filterValue]);

  const fetchTasks = () => {
    todosRepository.getAll().then((tasksData) => {
      const tasks = tasksData.filter((task) => {
        if (filterValue === null) {
          return true;
        }
        return task.isCompleted === filterValue;
      });
      setTasks(tasks as any);
      setTasksFetched(true);
    });
  };

  return {
    tasksFetched,
    tasks,
    fetchTasks,
    filterValue,
    setFilterValue,
  };
};

export default useTaskListContext;
