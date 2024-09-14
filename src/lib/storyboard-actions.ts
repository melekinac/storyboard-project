// import { client } from "./graphql-client";
// import { gql } from "graphql-request";
// import { userStore } from "$lib/userStore"; // Silme Mutasyonu
// const DELETE_STORYBOARD = gql`
//   mutation DeleteStoryboard($storyboard_id: uuid!) {
//     delete_storyboard_by_pk(storyboard_id: $storyboard_id) {
//       storyboard_id
//     }
//   }
// `;

// // Güncelleme Mutasyonu
// const UPDATE_STORYBOARD = gql`
//   mutation UpdateStoryboard(
//     $storyboard_id: uuid!
//     $title: String!
//     $description: String!
//   ) {
//     update_storyboard_by_pk(
//       pk_columns: { storyboard_id: $storyboard_id }
//       _set: { storyboard_title: $title, storyboard_text: $description }
//     ) {
//       storyboard_id
//       storyboard_title
//       storyboard_text
//     }
//   }
// `;

// // Ekleme Mutasyonu
// const ADD_STORYBOARD = gql`
//   mutation AddStoryboard($title: String!, $text: String!, $people_id: uuid!) {
//     insert_storyboard_one(
//       object: {
//         storyboard_title: $title
//         storyboard_text: $text
//         people_id: $people_id
//       }
//     ) {
//       storyboard_id
//       storyboard_title
//       storyboard_text
//       people_id
//       storyboard_created_date_time
//     }
//   }
// `;

// // Silme işlemi
// export async function deleteStoryboard(storyboard_id: string) {
//   if (confirm("Are you sure you want to delete this storyboard?")) {
//     try {
//       await client.request(DELETE_STORYBOARD, { storyboard_id });
//       alert("Storyboard deleted successfully.");
//       location.reload(); // Sayfayı yenile
//     } catch (error) {
//       console.error("Error deleting storyboard:", error);
//       alert(`Error deleting storyboard: ${error.message}`);
//     }
//   }
// }

// // Düzenleme işlemi
// export async function updateStoryboard(
//   storyboard_id: string,
//   title: string,
//   description: string
// ) {
//   const newTitle = prompt("Enter new title:", title);
//   const newDescription = prompt("Enter new description:", description);

//   if (newTitle && newDescription) {
//     try {
//       await client.request(UPDATE_STORYBOARD, {
//         storyboard_id,
//         title: newTitle,
//         description: newDescription,
//       });
//       alert("Storyboard updated successfully.");
//       location.reload(); // Sayfayı yenile
//     } catch (error) {
//       console.error("Error updating storyboard:", error);
//       alert(`Error updating storyboard: ${error.message}`);
//     }
//   }
// }

// // Ekleme işlemi
// export async function addStoryboard(title: string, text: string) {
//   try {
//     let people_id;
//     userStore.subscribe((user) => {
//       people_id = user.people_id; // userStore'dan people_id'yi al
//     });

//     if (!people_id || !title || !text) {
//       alert("Eksik alanları doldurun!");
//       return;
//     }

//     const variables = { title, text, people_id };
//     const response = await client.request(ADD_STORYBOARD, variables);
//     console.log("Ekleme işlemi başarılı:", response);
//     return response;
//   } catch (error) {
//     console.error("Storyboard eklenirken hata oluştu:", error);
//     throw error;
//   }
// }
// src/lib/storyboard-actions.ts
import { client } from "./graphql-client";
import { gql } from "graphql-request";

// Storyboard ekleme mutasyonu
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

// Silme Mutasyonu
const DELETE_STORYBOARD = gql`
  mutation DeleteStoryboard($storyboard_id: uuid!) {
    delete_storyboard_by_pk(storyboard_id: $storyboard_id) {
      storyboard_id
    }
  }
`;

// Güncelleme Mutasyonu
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

// Storyboard ekleme işlemi
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

// Silme işlemi
export async function deleteStoryboard(storyboard_id: string) {
  if (confirm("Are you sure you want to delete this storyboard?")) {
    try {
      await client.request(DELETE_STORYBOARD, { storyboard_id });
      alert("Storyboard deleted successfully.");
      location.reload(); // Sayfayı yenile
    } catch (error) {
      console.error("Error deleting storyboard:", error);
      alert(`Error deleting storyboard: ${error.message}`);
    }
  }
}

// Düzenleme işlemi
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
      location.reload(); // Sayfayı yenile
    } catch (error) {
      console.error("Error updating storyboard:", error);
      alert(`Error updating storyboard: ${error.message}`);
    }
  }
}
