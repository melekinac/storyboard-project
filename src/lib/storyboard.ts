import { client } from "./graphql";

export interface Storyboard {
  id: number;
  title: string;
  description?: string;
  created_at: string;
}

export const addStoryboard = async (
  title: string,
  description?: string
): Promise<Storyboard> => {
  const mutation = `
    mutation($title: String!, $description: String) {
      insert_storyboards_one(object: { title: $title, description: $description }) {
        id
        title
        description
        created_at
      }
    }
  `;

  const variables = { title, description };
  const data = await client.request(mutation, variables);
  return data.insert_storyboards_one;
};
