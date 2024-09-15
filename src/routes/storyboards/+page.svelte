<script lang="ts">
  import { userStore } from '$lib/userStore';
  import { client } from '$lib/graphql-client';
  import { gql } from 'graphql-request';
  import { onMount } from 'svelte';
  import Modal from '$lib/components/modal.svelte';

  let people_id: string | null = null;
  let storyboards = [];
  let file: File | null = null;
  let comments = {};
  let commentTexts = {};
  let title = '';
  let text = '';
  let fileUrl: string | null = null;
  
  let isAddModalOpen = false;
  let isEditModalOpen = false;
  let isViewModalOpen = false;
  let fullText = ''; 


  let isEditCommentModalOpen = false;
  let editCommentText = '';
  let editCommentId = '';
  let editStoryboardId = '';


  let editTitle = '';
  let editText = '';
  let storyboardId: string | null = null;

  userStore.subscribe((user) => {
    people_id = user.people_id;
  });
  async function uploadFile() {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

 
      try {
        const response = await fetch('/uploads', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('File upload failed');
        }

        const result = await response.json();
        fileUrl = result.fileUrl; 
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  
  const ADD_STORYBOARD = gql`
    mutation AddStoryboard($title: String!, $text: String!, $people_id: uuid!, $media_url: String) {
      insert_storyboard_one(object: { storyboard_title: $title, storyboard_text: $text, people_id: $people_id, storyboard_media_url: $media_url }) {
        storyboard_id
        storyboard_title
        storyboard_text
        people_id
        storyboard_created_date_time
        storyboard_media_url
        people {     
          people_nickname
        }
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
    mutation UpdateStoryboard($storyboard_id: uuid!, $title: String!, $text: String!) {
      update_storyboard_by_pk(
        pk_columns: { storyboard_id: $storyboard_id }
        _set: { storyboard_title: $title, storyboard_text: $text }
      ) {
        storyboard_id
        storyboard_title
        storyboard_text
                 people {     
      people_nickname
     
    }   
        
      }
    }
  `;

  const ADD_COMMENT = gql`
    mutation AddComment($text: String!, $storyboard_id: uuid!, $people_id: uuid!) {
      insert_comment_one(object: { comment_text: $text, storyboard_id: $storyboard_id, people_id: $people_id }) {
        comment_id
        comment_text
        people_id
        storyboard_id
        comment_created_date_time
        people {     
      people_nickname
     
    }   
      }
    }
  `;

  const DELETE_COMMENT = gql`
    mutation DeleteComment($comment_id: uuid!) {
      delete_comment_by_pk(comment_id: $comment_id) {
        comment_id
      }
    }
  `;

  const UPDATE_COMMENT = gql`
    mutation UpdateComment($comment_id: uuid!, $text: String!) {
      update_comment_by_pk(pk_columns: { comment_id: $comment_id }, _set: { comment_text: $text }) {
        comment_id
        comment_text
        comment_created_date_time
        people_id
        people {     
      people_nickname
     
    }   
      }
    }
  `;

  const GET_COMMENTS = gql`
    query GetComments($storyboard_id: uuid!) {
      comment(where: { storyboard_id: { _eq: $storyboard_id } }) {
        comment_id
        comment_text
        people_id
         people {     
      people_nickname
     
    }       comment_created_date_time
      }
    }
  `;

  const GET_STORYBOARDS = gql`
    query {
      storyboard {
        storyboard_id
        storyboard_title
        storyboard_text
        people_id
         people {     
      people_nickname
        }  
       storyboard_created_date_time
        storyboard_media_url
      }
    }
  `;

  async function loadStoryboards() {
    try {
      const response = await client.request(GET_STORYBOARDS);
      storyboards = response.storyboard;
      for (let sb of storyboards) {
        await loadComments(sb.storyboard_id);
      }
    } catch (error) {
      console.error('Error loading storyboards:', error);
    }
  }
  onMount(() => {
    loadStoryboards();
  });
  async function loadComments(storyboard_id: string) {
    try {
      const response = await client.request(GET_COMMENTS, { storyboard_id });
      comments[storyboard_id] = response.comment;
    } catch (error) {
      console.error(`Error loading comments for storyboard ${storyboard_id}:`, error);
    }
  }

  async function addComment(storyboard_id: string) {
    if (!people_id) {
      alert('User ID not found. Please make sure you are logged in.');
      return;
    }

    const commentText = commentTexts[storyboard_id] || ''; 

    if (!commentText) {
      alert('Please enter a comment.');
      return;
    }

    try {
      const variables = { text: commentText, storyboard_id, people_id };
      const response = await client.request(ADD_COMMENT, variables);
      comments[storyboard_id] = [...(comments[storyboard_id] || []), response.insert_comment_one];
      commentTexts[storyboard_id] = ''; 
    } catch (error) {
      console.error('Error adding comment:', error);
      alert(`Error adding comment: ${error.message}`);
    }
  }

  async function deleteComment(comment_id: string, storyboard_id: string) {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await client.request(DELETE_COMMENT, { comment_id });
        comments[storyboard_id] = comments[storyboard_id].filter(c => c.comment_id !== comment_id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert(`Error deleting comment: ${error.message}`);
      }
    }
  }

  async function updateComment() {
    if (!editCommentText || !editCommentId) return;

    try {
      const variables = { comment_id: editCommentId, text: editCommentText };
      const response = await client.request(UPDATE_COMMENT, variables);
      const updatedComment = response.update_comment_by_pk;

      for (const [storyboardId, commentList] of Object.entries(comments)) {
        const commentIndex = commentList.findIndex(c => c.comment_id === editCommentId);
        if (commentIndex !== -1) {
          comments[storyboardId][commentIndex] = updatedComment;
          break;
        }
      }

      closeEditCommentModal();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert(`Error updating comment: ${error.message}`);
    }
  }


  function openAddModal() {
    isAddModalOpen = true;
  }

  function closeAddModal() {
    isAddModalOpen = false;
  }

  function openEditModal(storyboard) {
    storyboardId = storyboard.storyboard_id;
    editTitle = storyboard.storyboard_title;
    editText = storyboard.storyboard_text;
    isEditModalOpen = true;
  }

  function closeEditModal() {
    isEditModalOpen = false;
  }

  function openViewModal(storyboard) {
    fullText = storyboard.storyboard_text;
    isViewModalOpen = true;
  }

  function closeViewModal() {
    isViewModalOpen = false;
  }

  function openEditCommentModal(comment) {
    editCommentText = comment.comment_text;
    editCommentId = comment.comment_id;
    editStoryboardId = comment.storyboard_id;
    isEditCommentModalOpen = true;
  }

  function closeEditCommentModal() {
    isEditCommentModalOpen = false;
  }

  async function addStoryboard() {
    if (!title || !text) {
      alert('Please fill in all fields');
      return;
    }

    if (!people_id) {
      alert('User ID not found. Please make sure you are logged in.');
      return;
    }

    let media_url = null;
    if (file) {
      await uploadFile();
      media_url = fileUrl; 
    }

    try {
      const variables = { title, text, people_id, media_url };
      const response = await client.request(ADD_STORYBOARD, variables);
      storyboards.push(response.insert_storyboard_one);
      await loadStoryboards();
      title = '';
      text = '';
      file = null;
      fileUrl = null;  
      closeAddModal();
    } catch (error) {
      console.error('Error adding storyboard:', error);
      alert(`Error adding storyboard: ${error.message}`);
    }
  }

  async function updateStoryboard() {
    if (!editTitle || !editText || !storyboardId) return;

    try {
      const variables = { storyboard_id: storyboardId, title: editTitle, text: editText };
      const response = await client.request(UPDATE_STORYBOARD, variables);
      const index = storyboards.findIndex(sb => sb.storyboard_id === storyboardId);
      if (index !== -1) {
        storyboards[index].storyboard_title = editTitle;
        storyboards[index].storyboard_text = editText;
      }
      closeEditModal();
    } catch (error) {
      console.error('Error updating storyboard:', error);
      alert(`Error updating storyboard: ${error.message}`);
    }
  }

  async function deleteStoryboard(storyboard_id: string) {
    if (confirm('Are you sure you want to delete this storyboard?')) {
      try {
        await client.request(DELETE_STORYBOARD, { storyboard_id });
        storyboards = storyboards.filter(sb => sb.storyboard_id !== storyboard_id);
      } catch (error) {
        console.error('Error deleting storyboard:', error);
        alert(`Error deleting storyboard: ${error.message}`);
      }
    }
  }

  onMount(() => {
    loadStoryboards();
  });
</script>


<Modal title="Add a New Storyboard" isOpen={isAddModalOpen} closeModal={closeAddModal}>
  <div class="flex flex-col space-y-4">
    <input class="border p-2 rounded-lg" type="text" bind:value={title} placeholder="Enter storyboard title" />
    <textarea class="border p-2 rounded-lg" bind:value={text} placeholder="Enter storyboard text"></textarea>
    <input class="border p-2 rounded-lg" type="file" on:change={(e) => { file = e.target.files[0]; }} />
    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg" on:click={addStoryboard}>Add Storyboard</button>
  </div>
</Modal>
<Modal title="Edit Storyboard" isOpen={isEditModalOpen} closeModal={closeEditModal}>
  <div class="flex flex-col space-y-4">
    <input class="border p-2 rounded-lg" type="text" bind:value={editTitle} placeholder="Edit storyboard title" />
    <textarea class="border p-2 rounded-lg" bind:value={editText} placeholder="Edit storyboard text"></textarea>
    <button class="bg-green-500 text-white px-4 py-2 rounded-lg" on:click={updateStoryboard}>Update Storyboard</button>
  </div>
</Modal>


<Modal title="View Full Storyboard" isOpen={isViewModalOpen} closeModal={closeViewModal}>
  <div class="flex flex-col space-y-4">
 
    <p class="whitespace-pre-wrap break-words">{fullText}</p>
    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg" on:click={closeViewModal}>Close</button>
  </div>
</Modal>


<Modal title="Edit Comment" isOpen={isEditCommentModalOpen} closeModal={closeEditCommentModal}>
  <div class="flex flex-col space-y-4">
    <textarea class="border p-2 rounded-lg" bind:value={editCommentText} placeholder="Edit comment text"></textarea>
    <button class="bg-green-500 text-white px-4 py-2 rounded-lg" on:click={updateComment}>Update Comment</button>
  </div>
</Modal>


<div class="flex flex-col items-center">
  <h1 class="text-3xl font-bold mb-4">Storyboards</h1>

  <button class="bg-blue-500 text-white px-4 py-2 rounded-lg" on:click={openAddModal}>Add New Storyboard</button>
  <div class="grid grid-cols-3 gap-6 mt-8">
    {#if storyboards.length > 0}
      {#each storyboards as storyboard}
        <div class="bg-white shadow-lg rounded-lg p-6">
         
          {#if storyboard.storyboard_media_url}
            {#if storyboard.storyboard_media_url.includes('image')}
              <img src={storyboard.storyboard_media_url} alt="Uploaded media" class="w-full h-auto mb-4" />
            {:else if storyboard.storyboard_media_url.includes('.docx') || storyboard.storyboard_media_url.includes('.xlsx')}
              <a href={storyboard.storyboard_media_url} class="text-blue-500 underline">Download Document</a>
            {:else}
              <p class="text-gray-600">File uploaded: {storyboard.storyboard_media_url}</p>
            {/if}
          {/if}
  
          <h3 class="text-xl font-bold">{storyboard.storyboard_title}</h3>
  
          <p class="text-gray-600 whitespace-pre-wrap break-words">
            {#if storyboard.storyboard_text.length > 100}
              {storyboard.storyboard_text.slice(0, 100)}...
              <button class="text-blue-500" on:click={() => openViewModal(storyboard)}>Read More</button>
            {:else}
              {storyboard.storyboard_text}
            {/if}
          </p>
  
          <p class="text-sm text-gray-400">
            <strong>Created at:</strong> {new Date(storyboard.storyboard_created_date_time).toLocaleString()}
          </p>
          <p class="text-sm text-gray-400">
            <strong>People ID:</strong> {storyboard.people.people_nickname}
          </p>
  
          {#if storyboard.people_id === people_id}
            <div class="flex justify-end space-x-2 mt-4">
              <button class="bg-yellow-500 text-white px-3 py-1 rounded-lg" on:click={() => openEditModal(storyboard)}>Edit</button>
              <button class="bg-red-500 text-white px-3 py-1 rounded-lg" on:click={() => deleteStoryboard(storyboard.storyboard_id)}>Delete</button>
            </div>
          {/if}
  
     
          <div class="mt-4">
            <input class="border p-2 rounded-lg w-full mb-2" type="text" placeholder="Add a comment..." bind:value={commentTexts[storyboard.storyboard_id]} />
            <button class="bg-green-500 text-white px-3 py-1 rounded-lg" on:click={() => addComment(storyboard.storyboard_id)}>Add Comment</button>
            <h4 class="mt-4 font-semibold">Comments</h4>
            {#if comments[storyboard.storyboard_id]}
              <ul class="mt-2 space-y-2">
                {#each comments[storyboard.storyboard_id] as comment}
                  <li class="bg-gray-100 p-2 rounded-lg">
                    <p class="whitespace-pre-wrap break-words">{comment.comment_text}</p>
                    <p class="text-xs text-gray-400">Comment by: {comment.people.people_nickname}</p>
                    <p class="text-xs text-gray-400">Posted at: {new Date(comment.comment_created_date_time).toLocaleString()}</p>
                    {#if comment.people_id === people_id}
                      <div class="flex justify-end space-x-2 mt-2">
                        <button class="bg-yellow-500 text-white px-2 py-1 rounded-lg" on:click={() => openEditCommentModal(comment)}>Edit</button>
                        <button class="bg-red-500 text-white px-2 py-1 rounded-lg" on:click={() => deleteComment(comment.comment_id, storyboard.storyboard_id)}>Delete</button>
                      </div>
                    {/if}
                  </li>
                {/each}
              </ul>
            {:else}
              <p class="text-sm text-gray-500">No comments available.</p>
            {/if}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</div>