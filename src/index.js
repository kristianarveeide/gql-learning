const { ApolloServer, gql, PubSub } = require("apollo-server");

const typeDefs = gql`
	type Query {
		hello: String!
		user: User!
	}

	type User {
		id: ID!
		username: String!
		isAdmin: Boolean
	}

	type Error {
		field: String
		message: String
	}

	type RegisterResponse {
		user: User
		errors: [Error!]!
	}

	input UserInfo {
		username: String!
		password: String!
		age: Int
	}

	type Mutation {
		register(user: UserInfo!): RegisterResponse!
		login(user: UserInfo!): String!
	}

	type Subscription {
		newUser: User!
	}
`;

const NEW_USER = "NEW_USER";

const resolvers = {
	Subscription: {
		newUser: {
			subscribe: (_, __, { pubsub }) => {
				console.log(pubsub);
				return pubsub.asyncIterator([NEW_USER]);
			},
		},
	},
	User: {
		username: (parent) => {
			console.log(parent);
			return parent.username;
		},
		isAdmin: () => {
			return false;
		},
		/* id: () => {
      return "test";
    }, */
	},
	Query: {
		hello: (parent, args, context, info) => "hello world",
		user: () => ({
			id: 1,
			username: "tom",
		}),
	},
	Mutation: {
		login: async (parent, { user: { username } }, context, info) => {
			console.log(context);
			return username;
		},
		register: (parent, { user: { username } }, { pubsub }) => {
			const user = {
				id: 1,
				username: username,
			};

			pubsub.publish(NEW_USER, { newUser: user });

			console.log(pubsub, NEW_USER);

			return {
				user: user,

				errors: [
					{
						field: "username",
						message: "Username is required",
					},
				],
			};
		},
	},
};

const pubsub = new PubSub();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, res }) => ({ req, res, pubsub }),
});

server.listen().then(({ url }) => {
	console.log(url);
});
