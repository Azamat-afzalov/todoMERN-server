const Todo = require('../models/Todo');
module.exports = {
    getTodos: async () => {
        console.log("GET TODOS");
        const todos = await Todo.find();
        return { todos : todos.map(todo => ({
                    ...todo._doc,
                    updatedAt : todo.updatedAt.toISOString(),
                    createdAt : todo.createdAt.toISOString(),
                    _id : todo._id
            }))
        };
    },
    getTodo : async({id} , req) => {
        const todo = await Todo.findById(id);
        return {
                ...todo._doc,
                updatedAt : todo.updatedAt.toISOString(),
                createdAt : todo.createdAt.toISOString(),
                _id : todo._id.toString()
            };
    },
    createTodo : async(args ,req) => {
        console.log('CREATE_TODO' , args.input.title);
        const todo = new Todo({
            title : args.input.title,
            isCompleted : false
        });
        const createdTodo = await todo.save();
        return { ...createdTodo._doc ,
            updatedAt : createdTodo.updatedAt.toISOString(),
            createdAt : createdTodo.createdAt.toISOString(),
            _id : createdTodo._id.toString()
        }
    }
}

// ! GET ALL TODOS
// {
//     getTodos {
//         todos{
//         _id
//         title
//     }
//     }
// }

// !GET ONE TODO
// {
//     getTodo(id:"5ec526401b28c33304a1518f"){
//       _id title isCompleted
//     }
//   }

// !createTodo
// mutation {
//     createTodo(input: {title: "second todo"}) {
//       _id
//       title
//       isCompleted
//       createdAt
//       updatedAt
//     }
//   }