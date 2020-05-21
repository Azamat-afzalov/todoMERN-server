const Todo = require('../models/Todo');
module.exports = {
    getTodos: async() => {
        try {
            const todos = await Todo.find().sort({createdAt : -1});
            if(!todos){
                const error = new Error('Cannot find todos');
                error.code = 404;
                throw error;
            }
            return {
                todos : todos.map(todo => ({
                    ...todo._doc,
                    updatedAt : todo.updatedAt.toISOString(),
                    createdAt : todo.createdAt.toISOString(),
                    _id : todo._id
                }))
            };
        } catch (error) {
            return error;
        }

    },
    getTodo : async({id} , req) => {
        try {
            const todo = await Todo.findById(id);
            if(!todo){
                const error = new Error('Todo not found');
                error.code = 404;
                throw error;
            }
            return {
                ...todo._doc,
                updatedAt : todo.updatedAt.toISOString(),
                createdAt : todo.createdAt.toISOString(),
                _id : todo._id.toString()
            };
        } catch (error) {
            return error;
        }
    },
    createTodo : async(args ,req) => {

        if(!args.input.title){
            const error = new Error('Title must be provided')
            error.code = 404;
            throw error;
        }
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
                }
            }
        } catch (error) {
            return error;
        }
    },
    toggleComplete : async(args , req) => {
        try {
            const todo = await Todo.findById(args.id);
            if(!todo) {
                const error = new Error('Can not find todo');
                error.code = 404;
                throw error;
            }
            todo.isCompleted = !todo.isCompleted;
            await todo.save();
            return {
                success : true,
                message : 'updated successfully',
                _id : todo._id.toString()
            }
        } catch (error) {
            return error;
        }
    },
    deleteTodo : async(args , req) => {
        try {
            const todo = await Todo.findById(args.id);
            if(!todo){
                const error = new Error('Todo not found to delete');
                error.code = 404;
                throw error;
            }
            await todo.deleteOne({_id : args.id});
            return {
                success : true,
                _id : args.id
            }
        } catch (error) {
            return error;
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