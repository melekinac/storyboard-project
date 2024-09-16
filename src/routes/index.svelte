<script context="module" lang="ts">
    import { GraphQLClient, gql } from 'graphql-request';
     
  
    const client = new GraphQLClient('http://localhost:8081/v1/graphql', {
      headers: {
        'x-hasura-admin-secret': 'myadminsecretkey',
      },
    });
  

    const loginQuery = gql`
      query Login($email: String!) {
        storyboarddb_peoples(where: { peoles_email: { _eq: $email } }) {
          peoples_id
          peoples_nickname
          peoples_password
        }
      }
    `;
  
    let email = '';
    let password = '';
    let message = '';
  
    async function login() {
      if (!email || !password) {
        message = 'Please enter both email and password';
        return;
      }
  
      try {
        const variables = { email };
        const data = await client.request(loginQuery, variables);
  console.log(data +"aaaaa")
       
      } catch (error) {
        console.error('Error logging in:', error);
        message = `Error logging in: ${error}`;
      }
    }
  </script>
  
  <h1>Login</h1>
  
  <p>{message}</p>
  
  <div>
    <label>Email:</label>
    <input type="email" bind:value={email} placeholder="Enter your email" />
  
    <label>Password:</label>
    <input type="password" bind:value={password} placeholder="Enter your password" />
  
    <button on:click={login}>Login</button>
  </div>
  