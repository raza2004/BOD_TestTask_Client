"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TODOS,
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
} from "@/graphql/mutations";
import toast, { Toaster } from "react-hot-toast";
import { ApolloError } from "@apollo/client";

// Define Todo type
type Todo = {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Check token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (!storedToken) {
      router.push("/signin");
    }
  }, [router]);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // GraphQL operations
  const { loading, error, data } = useQuery(GET_TODOS, {
    errorPolicy: "all",
    skip: !token, // Skip query if no token
  });
  const [createTodo] = useMutation(CREATE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  // Update todos list when data changes
  useEffect(() => {
    if (data?.getTodos) setTodos(data.getTodos);
  }, [data]);

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      await createTodo({
        variables: { title: newTodo },
        refetchQueries: [{ query: GET_TODOS }],
      });
      setNewTodo("");
    } catch (err) {
      console.error("Error creating todo:", err);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const result = await updateTodo({
        variables: {
          id: id,
          completed: !completed,
        },
        refetchQueries: [{ query: GET_TODOS }],
      });
    
    } catch (err: unknown) {
      const error = err as ApolloError;
      console.error("Update failed:", {
        error,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      });
    }
  };
  
  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo({
        variables: { id },
        refetchQueries: [{ query: GET_TODOS }],
      });
  
    } catch (err: unknown) {
      const error = err as ApolloError;
      console.error("Delete failed:", {
        error,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError,
      });
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
    toast.success("Logout successful!");
    router.refresh();
  };

  if (!token) {
    return <p className="p-8">Loading...</p>;
  }
  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#006994]">Your Todo List</h1>
        <button
          onClick={handleLogout}
          className="bg-[#006994] text-white px-4 py-2 rounded hover:bg-[#00A3D9] transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Add Todo Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
          className="flex-1 p-2 border rounded"
          onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
        />
        <button
          onClick={handleAddTodo}
          className="bg-[#006994] text-white px-4 py-2 rounded hover:bg-[#00A3D9] transition-colors"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`p-3 border rounded flex justify-between items-center ${
              todo.completed ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo._id, todo.completed)}
                className="h-5 w-5"
              />
              <span
                className={`break-words w-[30vw] ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.title}
              </span>
            </div>

            <button
              onClick={() => handleDeleteTodo(todo._id)}
              className="text-[#006994] hover:text-[#00A3D9] transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No todos yet. Add one above!
        </p>
      )}
    </div>
  );
}
