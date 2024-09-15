import { client } from "./graphql-client";
import { gql } from "graphql-request";

const ADD_STORYBOARD = gql`
  mutation AddStoryboard($title: String!, $text: String!, $people_id: uuid!) {
    insert_storyboard_one(
      object: {
        storyboard_title: $title
        storyboard_text: $text
        people_id: $people_id
      }
    ) {
      storyboard_id
      storyboard_title
      storyboard_text
      people_id
      storyboard_created_date_time
    }
  }
`;

const DELETE_STORYBOARD = gql`
  mutation DeleteStoryboard($storyboard_id: uuid!) {
    delete_storyboard_by_pk(storyboard_id: $storyboard_id) {
      storyboard_id
    }
  }
`;

const UPDATE_STORYBOARD = gql`
  mutation UpdateStoryboard(
    $storyboard_id: uuid!
    $title: String!
    $description: String!
  ) {
    update_storyboard_by_pk(
      pk_columns: { storyboard_id: $storyboard_id }
      _set: { storyboard_title: $title, storyboard_text: $description }
    ) {
      storyboard_id
      storyboard_title
      storyboard_text
    }
  }
`;

export async function addStoryboard(
  title: string,
  text: string,
  people_id: string
) {
  try {
    const variables = { title, text, people_id };
    const response = await client.request(ADD_STORYBOARD, variables);
    return response;
  } catch (error) {
    console.error("Error adding storyboard:", error);
    throw error;
  }
}

export async function deleteStoryboard(storyboard_id: string) {
  if (confirm("Are you sure you want to delete this storyboard?")) {
    try {
      await client.request(DELETE_STORYBOARD, { storyboard_id });
      alert("Storyboard deleted successfully.");
      location.reload();
    } catch (error) {
      console.error("Error deleting storyboard:", error);
      alert(`Error deleting storyboard: ${error.message}`);
    }
  }
}

export async function updateStoryboard(
  storyboard_id: string,
  title: string,
  description: string
) {
  const newTitle = prompt("Enter new title:", title);
  const newDescription = prompt("Enter new description:", description);

  if (newTitle && newDescription) {
    try {
      await client.request(UPDATE_STORYBOARD, {
        storyboard_id,
        title: newTitle,
        description: newDescription,
      });
      alert("Storyboard updated successfully.");
      location.reload();
    } catch (error) {
      console.error("Error updating storyboard:", error);
      alert(`Error updating storyboard: ${error.message}`);
    }
  }
}
