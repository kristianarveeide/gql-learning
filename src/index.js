const {ApolloServer, gql} = require('apollo-server');

const typeDefs = gql`
    type Query{
        hello: String!
    }

    type User{
        id: ID!
        username: String!
    }

    type Error {
        field: String,
        message: String
    }

    type RegisterResponse {
        user: User,
        errors: [Error!]!
    }

    input UserInfo {
        username: String!, 
        age: Int
    }

    type Mutation {
        register(user: UserInfo!): RegisterResponse!,
        login(user: UserInfo!): Boolean!,
    }
`;

const resolvers = {
    Query: {
        hello: (parents, args, context, info) => 'hello world'
    },
    Mutation: {
        login: () => true,
        register: () => ({
            user: {
                id: 1,
                username: 'user1'
            },
            errors: [{
                field: 'username',
                message: 'Username is required'
            }]
        })
    }
}

const server = new ApolloServer({ typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(url);
})
