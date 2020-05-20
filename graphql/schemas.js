const graphql = require('graphql');
const Todo = require('../models/Todo');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQlBoolean,
    GraphQLNonNull
} = graphql;

const TodoType = new GraphQLObjectType({
    name : 'Todo',
    fields : () => ({
        id: {type: GraphQLID},
        title : {type : GraphQLString},
        isCompleted : {type : GraphQlBoolean}
    })
})

module.exports = new GraphQLSchema({

})