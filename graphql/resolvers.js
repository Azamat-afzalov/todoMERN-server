const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Todo = require("../models/Todo");
const User = require("../models/User");
require("dotenv").config();
module.exports = {
    getTodos: async (args, req) => {
        try {
            // const todos = await Todo.find({creator : req.userId}).sort({ createdAt: -1 });
            if(!req.userId){
                const error = new Error("Not Authenticated");
                error.code = 401;
                throw error;
            }
            const user = await User.findOne({_id : req.userId},'').populate({
                path : "todos",
                model : "Todo",
                options : {
                    sort : 'todos.createdAt'
                }
            })
            const sorted = user.todos.sort((a, b) => {
                if(a.createdAt > b.createdAt){
                    return -1;
                }else if(a.createdAt < b.createdAt){
                    return 1;
                }else{
                    return 0;
            }
            });
            if (!sorted) {
                const error = new Error("Can not find todos");
                error.code = 404;
                throw error;
            }
        return {
            todos: sorted.map((todo) => ({
            ...todo._doc,
            updatedAt: todo.updatedAt.toISOString(),
            createdAt: todo.createdAt.toISOString(),
            _id: todo._id,
            })),
        };
        } catch (error) {
            return error;
        }
    },
    getTodo: async ({ id }, req) => {
        try {
        const todo = await Todo.findById(id);
        if (!todo) {
            const error = new Error("Todo not found");
            error.code = 404;
            throw error;
        }
        return {
            ...todo._doc,
            updatedAt: todo.updatedAt.toISOString(),
            createdAt: todo.createdAt.toISOString(),
            _id: todo._id.toString(),
        };
        } catch (error) {
        return error;
        }
    },
    createTodo: async (args, req) => {
        console.log('Create TODO' , req.userId);
        if (!args.input.title) {
            const error = new Error("Title must be provided");
            error.code = 404;
            throw error;
        }
        const user = await User.findById(req.userId);
        const todo = new Todo({
            title: args.input.title,
            isCompleted: false,
            creator : req.userId
        });
        try {
            const createdTodo = await todo.save();
            user.todos.push(createdTodo);
            await user.save()
        return {
            todo: {
                ...createdTodo._doc,
                updatedAt: createdTodo.updatedAt.toISOString(),
                createdAt: createdTodo.createdAt.toISOString(),
                _id: createdTodo._id.toString()
            },
        };
        } catch (error) {
            return error;
        }
    },
    toggleComplete: async (args, req) => {
        try {
        console.log(args.id);
        const todo = await Todo.findById(args.id);
        if (!todo) {
            const error = new Error("Can not find todo");
            error.code = 404;
            throw error;
        }
        todo.isCompleted = !todo.isCompleted;
        await todo.save();
        return {
            _id: todo._id.toString(),
        };
        } catch (error) {
        return error;
        }
    },
    deleteTodo: async (args, req) => {
        try {
            const todo = await Todo.findById(args.id);
            if (!todo) {
                const error = new Error("Todo not found to delete");
                error.code = 404;
                throw error;
            }
            await todo.remove();
            const user = await User.findById(req.userId);
            user.todos.pull(args.id);
            await user.save();
            return {
                _id: args.id.toString()
            };
        } catch (error) {
            return error;
        }
    },
    createUser: async ({ input }, req) => {
        const { username, password, email } = input;
        const errors = [];
        if (!validator.isLength(username, { min: 2 })) {
        errors.push({
            field: "username",
            message: "username must be at least 2 characters",
        });
        }
        if (!validator.isEmail(email)) {
        errors.push({ field: "email", message: "email is invalid" });
        }
        if (!validator.isLength(password, { min: 6 })) {
        errors.push({
            field: "password",
            message: "password must contain at least 6 characters",
        });
        }
        if (errors.length > 0) {
        const error = new Error("Invalid input values");
        error.data = errors;
        error.code = 422;
        throw error;
        }
        const isExistingUser = await User.findOne({ email: email });

        if (isExistingUser) {
            const error = new Error("User with this email already exists");
            error.code = 422;
            throw error;
        }
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (error) {
            console.log("failed to hash password");
        }
        let createdUser;
        try {
        const user = new User({
            email: email,
            password: hashedPassword,
            username: username,
        });
        createdUser = await user.save();
        } catch (error) {
        console.log("failed to save user");
        console.log(error);
        }
        const token = jwt.sign(
        {
            userId: createdUser._id.toString()
        },
        process.env.JWT_SIGN,
        {
            expiresIn: "2h",
        }
        );
        return {
        _id: createdUser._id.toString(),
        token: token,
        };
    },
    loginUser: async ({ input }, req) => {
        const { email, password } = input;
        const user = await User.findOne({ email: email });
        const error = new Error("Incorrect email or password");
        error.code = 401;

        if (!user) {
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw error;
        }
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SIGN,
            {
                expiresIn: "2h",
            }
        );
        return {
            token: token,
            _id: user._id.toString(),
        };
    },
};

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

// !createUser
// mutation {
//     createUser( input : {
//         username : "azamat3",
//         email :"test1@test.com",
//         password :"1234"
//     }) {
//         _id
//         token
//     }
// }
