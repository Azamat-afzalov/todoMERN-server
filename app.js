const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const cors = require('cors');
require('dotenv').config()

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');


const app = express();
app.use(express.json());
app.use(cors());
app.use('/graphql' , graphqlHTTP({
    schema: graphqlSchema,
    rootValue : graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err) {
        console.log(err)
        if(!err.originalError) {
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occured';
        const code = err.originalError.code || 500;
        return {message : message , status : code , data : data }
    }
}));

mongoose.connect(`${process.env.MONGO_URI}`,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen( process.env.PORT || 5000 , () => { console.log('connected')})
    })
    .catch(err => console.log(err));
