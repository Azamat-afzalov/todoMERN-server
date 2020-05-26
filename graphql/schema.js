const {buildSchema} = require('graphql');


module.exports = buildSchema(`
    type Todo {
        _id : ID!
        title : String!
        isCompleted : Boolean!
        createdAt : String!
        updatedAt : String!
    }
    type Todos {
        success : Boolean!
        todos : [Todo]
        error : String
    }
    type CreatedTodo {
        todo : Todo!
    }
    type toggleTodo {
        _id :ID!
        success : Boolean!
        message : String
    }
    type deleteTodo{
        _id: ID!
    }
    type authData{
        _id : ID!
        token : String!
    }
    input todoInput {
        title : String!
    }
    input signupInput {
        username : String!
        email : String!
        password : String!
    }

    input loginInput {
        email : String!
        password : String!
    }

    type RootQuery {
        getTodos : Todos
        getTodo(id:ID!):Todo!
    }

    type RootMutation {
        createTodo(input : todoInput!):CreatedTodo!
        toggleComplete(id:ID!):toggleTodo!
        deleteTodo(id:ID!):deleteTodo!
        createUser(input : signupInput!):authData!
        loginUser(input : loginInput!):authData!
    }
    schema {
        mutation : RootMutation
        query: RootQuery
    }
`);

// ! GET TODOS
// type RootQuery {
    //     getTodo: (id : ID!):Todo!
    //     getTodos:Todos
    // }
    // query: RootQuery

//! create TODO
// mutation{
//     createTodo(input :{title :"first todo"}){
//       _id
//       title
//       isCompleted
//     }
//   }

// ! Toggle Complete
// mutation {
//     toggleComplete(id:"5ec526401b28c33304a1518f") {
//         _id
//         success
//         message
//     }
// }
