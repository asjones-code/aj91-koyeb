async function gql(query, variables = {}) {
    const data = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : '032b81d9-8aff-4e25-b5dd-3fb4b43d0c31'
        },
        body: JSON.stringify({
            query
        })
    });

    return data.json();
}



const GET_USER_ARTICLES = `
query Publication{
  publication(host: "aj91.hashnode.dev"){
    isTeam
    title
      posts(first: 10) {
            edges {
                node {
                  id
                  	slug
                    title
                    brief
                    url
                }
            }
            totalDocuments
        }
    
  
  }
}`;

gql(GET_USER_ARTICLES, { page: 0 })
    .then(result => {
        const article = result.data.publication.posts.edges[0].node
        const title = result.data.publication.posts.edges[0].node.title

        console.log(article)
        const pElement = document.querySelector("article p"); // Selects the <p> inside <article>
        const emElement = document.querySelector("article em"); // Selects the <p> inside <article>

        pElement.textContent = article.brief; // 
        emElement.textContent = title; // 

        
    });