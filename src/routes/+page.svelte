<script lang="ts">
  import { client } from '$lib/graphql-client';
  import { gql } from 'graphql-request';
  import { userStore } from '$lib/userStore';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let nickname = '';
  let isLoginFormVisible = true;

  const loginQuery = gql`
    query Login($email: String!) {
      people(where: { people_email: { _eq: $email } }) {
        people_id
        people_nickname
        people_password
      }
    }
  `;

  const registerMutation = gql`
    mutation Register($email: String!, $nickname: String!, $password: String!) {
      insert_people_one(
        object: { people_email: $email, people_nickname: $nickname, people_password: $password }
      ) {
        people_id
        people_nickname
      }
    }
  `;

  async function login() {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    try {
      const variables = { email };
      const data = await client.request(loginQuery, variables);
      if (data && data.people.length > 0) {
        const user = data.people[0];
        if (password === user.people_password) {
          alert(`Welcome back, ${user.people_nickname}!`);
          userStore.set({
            people_id: user.people_id,
            people_nickname: user.people_nickname,
            people_email: email,
          });
          goto('/storyboards');
        } else {
          alert('Incorrect password.');
        }
      } else {
        alert('User not found. Please register.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert(`Error logging in: ${error.message}`);
    }
  }

  async function register() {
    if (!email || !nickname || !password) {
      alert('Please enter all fields');
      return;
    }

    try {
      const variables = { email, nickname, password };
      const data = await client.request(registerMutation, variables);
      if (data && data.insert_people_one) {
        alert(`Registration successful! Welcome, ${data.insert_people_one.people_nickname}!`);
        userStore.set({
          people_id: data.insert_people_one.people_id,
          people_nickname: data.insert_people_one.people_nickname,
          people_email: email,
        });
        goto('/storyboards');
      } else {
        alert('Registration failed.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert(`Error registering: ${error.message}`);
    }
  }

  function toggleMode() {
    isLoginFormVisible = !isLoginFormVisible;
  }
</script>

<div class="max-w-md mx-auto mt-8">
  <h1 class="text-3xl font-bold text-center">{isLoginFormVisible ? 'Login' : 'Register'}</h1>

  <div class="mt-6 space-y-4">
      <label class="block text-sm font-medium text-gray-700">Email:</label>
    <input type="email" bind:value={email} class="w-full p-2 border rounded" placeholder="Enter your email" />

  
    <label class="block text-sm font-medium text-gray-700">Password:</label>
    <input type="password" bind:value={password} class="w-full p-2 border rounded" placeholder="Enter your password" />

  
    {#if !isLoginFormVisible}
      <label class="block text-sm font-medium text-gray-700">Nickname:</label>
      <input type="text" bind:value={nickname} class="w-full p-2 border rounded" placeholder="Enter your nickname" />
    {/if}


    <div class="mt-4">
      {#if isLoginFormVisible}
        <button class="w-full bg-blue-500 text-white p-2 rounded" on:click={login}>Login</button>
      {:else}
        <button class="w-full bg-green-500 text-white p-2 rounded" on:click={register}>Register</button>
      {/if}
    </div>


    <p class="text-center text-sm text-gray-600">
      {#if isLoginFormVisible}
        Don't have an account? 
        <span 
          class="text-indigo-600 cursor-pointer hover:underline" 
          on:click={toggleMode}>Register here</span>
      {:else}
        Already have an account? 
        <span 
          class="text-indigo-600 cursor-pointer hover:underline" 
          on:click={toggleMode}>Login here</span>
      {/if}
    </p>
  </div>
</div>
