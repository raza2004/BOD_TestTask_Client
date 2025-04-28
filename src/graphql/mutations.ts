import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation Signup($email: String!, $password: String!) {
    signup(email: $email, password: $password) {
      access_token
    }
  }
`;

export const SIGN_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

// GraphQL queries and mutations
export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      _id
      title
      description
      completed
    }
  }
`;

export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String) {
    createTodo(createTodoInput: { title: $title, description: $description }) {
      _id
      title
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
      _id
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      _id
    }
  }
`;
