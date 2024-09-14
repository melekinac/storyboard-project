import { GraphQLClient, gql } from "graphql-request";

export const client = new GraphQLClient("http://localhost:8081/v1/graphql", {
  headers: {
    "x-hasura-admin-secret": "myadminsecretkey",
  },
});
