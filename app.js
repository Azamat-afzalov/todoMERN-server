const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');


const app = express();
app.use(express.json());
// console.log(graphqlSchema , graphqlResolvers);
app.use(cors());
app.use('/graphql' , graphqlHTTP({
    schema: graphqlSchema,
    rootValue : graphqlResolvers,
    graphiql: true
}));

mongoose.connect(`${process.env.MONGO_URI}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen( process.env.PORT || 5000 , () => { console.log('connected')})
    })
    .catch(err => console.log(err));
