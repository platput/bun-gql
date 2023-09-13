import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// Types
import { typeDefs } from "./schema";
// db
import _db from "./_db";

const resolvers = {
    Query: {
        games() {
            return _db.games
        },
        reviews() {
            return _db.reviews
        },
        authors() {
            return _db.authors
        },
        review(_: any, args: any) {
            return _db.reviews.find((review) => review.id === args.id)
        },
        game(_: any, args: any) {
            return _db.games.find((game) => game.id === args.id)
        },
        author(_: any, args: any) {
            return _db.authors.find((author) => author.id === args.id)
        },
    },
    Mutation: {
        addGame(_: any, args: any) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }
            _db.games.push(game)
            return game
        },
        updateGame(_: any, args: any) {
            _db.games = _db.games.map((g) => {
                if (g.id === args.id) {
                    return {...g, ...args.edits}
                }
                return g
            })
            return _db.games.find((game) => game.id === args.id)
        },
        deleteGame(_: any, args: any) {
            return _db.games.filter((game) => game.id != args.id)
        }
    },
    Game: {
        reviews(parent: any) {
            return _db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent: any) {
            return _db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review: {
        author(parent: any) {
            return _db.authors.find((author) => author.id === parent.author_id)
        },
        game(parent: any) {
            return _db.games.find((game) => game.id === parent.game_id)
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log("server started on port: ", 4000)