<!-- <script context="module" lang="ts">
    import { GraphQLClient, gql } from 'graphql-request';
    import { goto } from '$app/navigation';  // Yönlendirme için modül ekleniyor
    
    // GraphQL Client
    const client = new GraphQLClient('http://localhost:8081/v1/graphql', {
      headers: {
        'x-hasura-admin-secret': 'myadminsecretkey',
      },
    });
  
    // Login query
    const loginQuery = gql`
      query Login($email: String!) {
        people(where: { people_email: { _eq: $email } }) {
          people_id
          people_nickname
          peoples_password
        }
      }
    `;
  
    let email = '';
    let password = '';
    let nickname = '';
    let message = '';
  
    // Login function
    async function login() {
      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }
  
      try {
        const variables = { email };
        const data = await client.request(loginQuery, variables);
  
        console.log('Login response:', data); // Konsola yanıtı yazdır
  
        if (data && data.people.length > 0) {
          const user = data.people[0];
  
          // Şifre karşılaştırması
          if (password === user.peoples_password) {
            alert(`Welcome back, ${user.people_nickname}!`);
  
            // Giriş başarılı, kullanıcıyı storyboard sayfasına yönlendir
            goto('/storyboards');  // Burada storyboards sayfasına yönlendirme yapılıyor
          } else {
            alert('Incorrect password. Please try again.');
          }
        } else {
          alert('User not found. Please register.');
        }
      } catch (error) {
        console.error('Error logging in:', error); // Hata varsa konsola yazdır
        alert(`Error logging in: ${error.message}`);
      }
    }
  
    // Register function
    async function register() {
      if (!email || !nickname || !password) {
        alert('Please enter all the fields');
        return;
      }
  
      const registerMutation = gql`
        mutation Register($email: String!, $nickname: String!, $password: String!) {
          insert_people_one(
            object: { people_email: $email, people_nickname: $nickname, peoples_password: $password }
          ) {
            people_id
            people_nickname
          }
        }
      `;
  
      try {
        const variables = { email, nickname, password };
        const data = await client.request(registerMutation, variables);
        console.log('Register response:', data); // Konsola yanıtı yazdır
  
        if (data && data.insert_people_one) {
          alert(`Registration successful! Welcome, ${data.insert_people_one.people_nickname}!`);
  
          // Başarıyla kayıt olduktan sonra storyboard sayfasına yönlendir
          goto('/storyboards/');
        } else {
          alert('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error registering:', error); // Hata varsa konsola yazdır
        alert(`Error registering: ${error.message}`);
      }
    }
  </script>

  <h1>Login or Register</h1>
  
  <div>
    <label>Email:</label>
    <input type="email" bind:value={email} placeholder="Enter your email" />
  
    <label>Password:</label>
    <input type="password" bind:value={password} placeholder="Enter your password" />
  
    <label>Nickname (for register):</label>
    <input type="text" bind:value={nickname} placeholder="Enter your nickname" />
  
    <button on:click={login}>Login</button>
    <button on:click={register}>Register</button>
  </div>
  
  <p>{message}</p> -->
  <script context="module" lang="ts">
    import { client } from '$lib/graphql-client';
    import { gql } from 'graphql-request';
    import { userStore } from '$lib/userStore'; // Kullanıcı bilgisini store'a kaydetmek için
    import { goto } from '$app/navigation';  // Yönlendirme için modül ekleniyor
  
    // Login query
    const loginQuery = gql`
      query Login($email: String!) {
        people(where: { people_email: { _eq: $email } }) {
          people_id
          people_nickname
          people_password
        }
      }
    `;
  
    // Register mutation
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
  
    let email = '';
    let password = '';
    let nickname = '';
    let message = '';
  
    // Login function
    async function login() {
      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }
  
      try {
        const variables = { email };
        const data = await client.request(loginQuery, variables);
  
        console.log('Login response:', data); // Konsola yanıtı yazdır
  
        if (data && data.people.length > 0) {
          const user = data.people[0];
  
          // Şifre karşılaştırması
          if (password === user.people_password) {
            alert(`Welcome back, ${user.people_nickname}!`);
  
            // Kullanıcı bilgilerini store'a kaydediyoruz
            userStore.set({
              people_id: user.people_id,
              people_nickname: user.people_nickname,
              people_email: email,
            });
  
            // Giriş başarılı, kullanıcıyı storyboard sayfasına yönlendir
            goto('/storyboards');
          } else {
            alert('Incorrect password. Please try again.');
          }
        } else {
          alert('User not found. Please register.');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert(`Error logging in: ${error.message}`);
      }
    }
  
    // Register function
    async function register() {
      if (!email || !nickname || !password) {
        alert('Please enter all the fields');
        return;
      }
  
      try {
        const variables = { email, nickname, password };
        const data = await client.request(registerMutation, variables);
        console.log('Register response:', data);
  
        if (data && data.insert_people_one) {
          alert(`Registration successful! Welcome, ${data.insert_people_one.people_nickname}!`);
  
          // Kullanıcı bilgilerini store'a kaydediyoruz
          userStore.set({
            people_id: data.insert_people_one.people_id,
            people_nickname: data.insert_people_one.people_nickname,
            people_email: email,
          });
  
          // Başarıyla kayıt olduktan sonra storyboard sayfasına yönlendir
          goto('/storyboards');
        } else {
          alert('Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error registering:', error);
        alert(`Error registering: ${error.message}`);
      }
    }
  </script>
  
  <!-- HTML -->
  <h1>Login or Register</h1>
  
  <div>
    <label>Email:</label>
    <input type="email" bind:value={email} placeholder="Enter your email" />
  
    <label>Password:</label>
    <input type="password" bind:value={password} placeholder="Enter your password" />
  
    <label>Nickname (for register):</label>
    <input type="text" bind:value={nickname} placeholder="Enter your nickname" />
  
    <button on:click={login}>Login</button>
    <button on:click={register}>Register</button>
  </div>
  
  <p>{message}</p>
  
  