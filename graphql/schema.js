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
        todos : [Todo!]
    }
    input todoInput {
        title : String!
    }
    type RootQuery {
        getTodos : Todos
        getTodo(id:ID!):Todo!
    }
    type RootMutation {
        createTodo(input : todoInput):Todo!
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