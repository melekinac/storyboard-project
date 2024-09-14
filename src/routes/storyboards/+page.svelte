<!-- <!-- <script lang="ts">
  import { page } from '$app/stores';
  import { client } from '$lib/graphql-client';
  import { gql } from 'graphql-request';

  // Delete Mutation
  const DELETE_STORYBOARD = gql`
    mutation DeleteStoryboard($storyboard_id: uuid!) {
      delete_storyboard_by_pk(id: $storyboard_id) {
        storyboard_id
      }
    }
  `;

  // Update Mutation
  const UPDATE_STORYBOARD = gql`
    mutation UpdateStoryboard($storyboard_id: uuid!, $title: String!, $description: String!) {
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

  // Silme işlemi
  async function deleteStoryboard(storyboard_id) {
    if (confirm('Are you sure you want to delete this storyboard?')) {
      try {
        await client.request(DELETE_STORYBOARD, { storyboard_id });
        alert('Storyboard deleted successfully.');
        // Sayfayı yenile
        location.reload();
      } catch (error) {
        console.error('Error deleting storyboard:', error);
        alert(`Error deleting storyboard: ${error.message}`);
      }
    }
  }

  // Düzenleme işlemi
  async function updateStoryboard(storyboard_id, title, description) {
    const newTitle = prompt('Enter new title:', title);
    const newDescription = prompt('Enter new description:', description);

    if (newTitle && newDescription) {
      try {
        await client.request(UPDATE_STORYBOARD, { storyboard_id, title: newTitle, description: newDescription });
        alert('Storyboard updated successfully.');
        // Sayfayı yenile
        location.reload();
      } catch (error) {
        console.error('Error updating storyboard:', error);
        alert(`Error updating storyboard: ${error.message}`);
      }
    }
  }
</script>



<div class="storyboard-container">
    {#if $page.data.props.storyboards}
      {#each $page.data.props.storyboards as { storyboard_title, storyboard_text, storyboard_created_date_time, peoples_id }}
        <div class="storyboard-card">
          <h2>{storyboard_title}</h2>
          <p>{storyboard_text}</p> 
          <p><strong>Created at:</strong> {new Date(storyboard_created_date_time).toLocaleString()}</p>
          <p><strong>People ID:</strong> {peoples_id}</p>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      {/each}
    {:else}
      <p>No storyboards available.</p>
    {/if}
</div>
 -->
 <script lang="ts">
    import { userStore } from '$lib/userStore';
    import { client } from '$lib/graphql-client';
    import { gql } from 'graphql-request';
    import { onMount } from 'svelte'; // Store'dan veriyi almak için kullanılır
    
    // Store'dan people_id almak
    let people_id: string | null = null;
    let storyboards = []; // Storyboard'ları tutmak için dizi
  
    userStore.subscribe((user) => {
      people_id = user.people_id;
      console.log('User ID:', people_id); // people_id'nin dolu olup olmadığını kontrol edin
    });
  
    // Add storyboard mutation
    const ADD_STORYBOARD = gql`
      mutation AddStoryboard($title: String!, $text: String!, $people_id: uuid!) {
        insert_storyboard_one(object: { storyboard_title: $title, storyboard_text: $text, people_id: $people_id }) {
          storyboard_id
          storyboard_title
          storyboard_text
          people_id
          storyboard_created_date_time
        }
      }
    `;
  
    // Delete Mutation
    const DELETE_STORYBOARD = gql`
      mutation DeleteStoryboard($storyboard_id: uuid!) {
        delete_storyboard_by_pk(storyboard_id: $storyboard_id) {
          storyboard_id
        }
      }
    `;
  
    // Update Mutation
    const UPDATE_STORYBOARD = gql`
      mutation UpdateStoryboard($storyboard_id: uuid!, $title: String!, $text: String!) {
        update_storyboard_by_pk(
          pk_columns: { storyboard_id: $storyboard_id }
          _set: { storyboard_title: $title, storyboard_text: $text }
        ) {
          storyboard_id
          storyboard_title
          storyboard_text
        }
      }
    `;
  
    // Storyboard listeleme query'si
    const GET_STORYBOARDS = gql`
      query {
        storyboard {
          storyboard_id
          storyboard_title
          storyboard_text
          people_id
          storyboard_created_date_time
        }
      }
    `;
  
    // Storyboardları yükleme fonksiyonu
    async function loadStoryboards() {
      try {
        const response = await client.request(GET_STORYBOARDS);
        storyboards = response.storyboard;
        console.log('Storyboards:', storyboards);
      } catch (error) {
        console.error('Error loading storyboards:', error);
      }
    }
  
    // Sayfa yüklendiğinde storyboards verilerini çek
    onMount(() => {
      loadStoryboards();
    });
  
    let title = '';
    let text = '';
  
    // Storyboard ekleme fonksiyonu
    async function addStoryboard() {
      if (!title || !text) {
        alert('Please fill in all fields');
        return;
      }
  
      if (!people_id) {
        alert('User ID not found. Please make sure you are logged in.');
        return;
      }
  
      try {
        const variables = { title, text, people_id };
        const response = await client.request(ADD_STORYBOARD, variables);
        console.log('Storyboard added successfully:', response);
        // Yeni eklenen storyboard'u mevcut listeye ekle
        storyboards.push(response.insert_storyboard_one);
        // Input alanlarını temizle
        title = '';
        text = '';
      } catch (error) {
        console.error('Error adding storyboard:', error);
        alert(`Error adding storyboard: ${error.message}`);
      }
    }
  
    // Storyboard silme fonksiyonu
    async function deleteStoryboard(storyboard_id: string) {
      if (confirm('Are you sure you want to delete this storyboard?')) {
        try {
          await client.request(DELETE_STORYBOARD, { storyboard_id });
          alert('Storyboard deleted successfully.');
          // Listeden sil
          storyboards = storyboards.filter(sb => sb.storyboard_id !== storyboard_id);
        } catch (error) {
          console.error('Error deleting storyboard:', error);
          alert(`Error deleting storyboard: ${error.message}`);
        }
      }
    }
  
    // Storyboard düzenleme fonksiyonu
    async function updateStoryboard(storyboard_id: string, title: string, text: string) {
      const newTitle = prompt('Enter new title:', title);
      const newText = prompt('Enter new text:', text);
  
      if (newTitle && newText) {
        try {
          const variables = { storyboard_id, title: newTitle, text: newText };
          const response = await client.request(UPDATE_STORYBOARD, variables);
          alert('Storyboard updated successfully.');
          // Listede güncelle
          const index = storyboards.findIndex(sb => sb.storyboard_id === storyboard_id);
          if (index !== -1) {
            storyboards[index].storyboard_title = newTitle;
            storyboards[index].storyboard_text = newText;
          }
        } catch (error) {
          console.error('Error updating storyboard:', error);
          alert(`Error updating storyboard: ${error.message}`);
        }
      }
    }
  </script>
  
  <!-- HTML kısmı -->
  <div>
    <h1>Add a New Storyboard</h1>
    <input type="text" bind:value={title} placeholder="Enter storyboard title" />
    <textarea bind:value={text} placeholder="Enter storyboard text"></textarea>
    <button on:click={addStoryboard}>Add Storyboard</button>
  </div>
  
  <h2>Storyboards</h2>
  {#if storyboards.length > 0}
    <ul>
      {#each storyboards as storyboard}
        <li>
          <h3>{storyboard.storyboard_title}</h3>
          <p>{storyboard.storyboard_text}</p>
          <p><strong>Created at:</strong> {new Date(storyboard.storyboard_created_date_time).toLocaleString()}</p>
          <p><strong>People ID:</strong> {storyboard.people_id}</p>
          <!-- Düzenleme ve Silme butonları -->
          <button on:click={() => updateStoryboard(storyboard.storyboard_id, storyboard.storyboard_title, storyboard.storyboard_text)}>Edit</button>
          <button on:click={() => deleteStoryboard(storyboard.storyboard_id)}>Delete</button>
        </li>
      {/each}
    </ul>
  {:else}
    <p>No storyboards available.</p>
  {/if}
  