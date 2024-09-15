import { client } from "$lib/graphql-client";
import { gql } from "graphql-request";

const GET_STORYBOARDS = gql`
  query {
    storyboard {
      people_id
      storyboard_created_date_time
      storyboard_id
      storyboard_title
      storyboard_text
    }
  }
`;

export async function load() {
  try {
    console.log("Veriler yükleniyor...");
    const data = await client.request(GET_STORYBOARDS);

    console.log("GraphQL yanıtı:", data);

    return {
      props: {
        storyboards: data.storyboard || [],
      },
    };
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return {
      props: {
        storyboards: [],
      },
    };
  }
}
