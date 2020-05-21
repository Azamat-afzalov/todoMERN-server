const Todo = require('../models/Todo');
module.exports = {
    getTodos: async() => {
        console.log("GET TODOS");
        try {
            const todos = await Todo.find();
            if(!todos){
                const error = new Error('Cannot find todos');
                error.code = 404;
                return error
            }
            return { todos : todos.map(todo => ({
                        ...todo._doc,
                        updatedAt : todo.updatedAt.toISOString(),
                        createdAt : todo.createdAt.toISOString(),
                        _id : todo._id
                }))
            };
        } catch (error) {
            console.log(error);
            throw error;
        }

    },
    getTodo : async({id} , req) => {
        try {
            const todo = await Todo.findById(id);
            if(!todo){
                const error = new Error('Todo not found');
                error.code = 404;
                return error;
            }
            return {
                ...todo._doc,
                updatedAt : todo.updatedAt.toISOString(),
                createdAt : todo.createdAt.toISOString(),
                _id : todo._id.toString()
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    createTodo : async(args ,req) => {
        console.log('CREATE_TODO' , args.input.title);
        const todo = new Todo({
            title : args.input.title,
            isCompleted : false
        });
        try {
            const createdTodo = await todo.save();
            return {
                todo : {
                    ...createdTodo._doc ,
                    updatedAt : createdTodo.updatedAt.toISOString(),
                    createdAt : createdTodo.createdAt.toISOString(),
                    _id : createdTodo._id.toString()
                },
                success : true
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    toggleComplete : async(args , req) => {
        try {
            const todo = await Todo.findById(args.id);
            if(!todo) {
                return {
                    success : false,
                    message : 'can not find todo'
                }
            }
            todo.isCompleted = !todo.isCompleted;
            await todo.save();
            return {
                success : true,
                message : 'updated successfully',
                _id : todo._id.toString()
            }
        } catch (error) {
            console.log(error);
            return {
                success : false,
                message : 'updating todo failed'
            }
        }
    },
    deleteTodo : async(args , req) => {
        try {
            const todo = await Todo.findById(args.id);
            if(!todo){
                const error = new Error('Todo not found to delete');
                error.code = 404;
                return error;
            }
            await todo.deleteOne({_id : args.id});
            return {
                success : true,
                _id : args.id
            }
        } catch (error) {
            console.log(error);
            throw error;
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