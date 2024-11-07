import { data } from 'jquery';
import Router from 'router_js';

var router = new Router();

async function gql(query, variables = {}) {
    const data = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': '032b81d9-8aff-4e25-b5dd-3fb4b43d0c31'
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
                    content{
                    markdown
                    }
                }
            }
            totalDocuments
        }
    
  
  }
}`;


const showPost = `
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
                    url
                    content{
                    markdown
                    }
                }
            }
        }
  }
}`;

gql(GET_USER_ARTICLES, { page: 0 })
    .then(result => {
        const article = result.data.publication.posts.edges[0].node
        const title = result.data.publication.posts.edges[0].node.title
        const url = result.data.publication.posts.edges[0].node.url
        const slug = result.data.publication.posts.edges[0].node.slug
        const md = result.data.publication.posts.edges[0].node.content.markdown




        //console.log(article)
        console.log(slug)

        const pElement = document.querySelector("article p"); // Selects the <p> inside <article>
        const emElement = document.querySelector("article em"); // Selects the <p> inside <article>

        pElement.textContent = article.brief; // 
        emElement.textContent = title; // 
        const linkElement = document.createElement("a");
        linkElement.href = url;
        linkElement.textContent = title;
        linkElement.target = "_blank"; // Opens the link in a new tab

        // Clear the em element and append the new link
        emElement.innerHTML = '';
        emElement.appendChild(linkElement);
        //linkElement.addEventListener("click", (event) => route(event, url, title, slug, md));

    });


    const route = (event, title, slug, md) => {
        
        // Update the URL without reloading
        console.log(slug);

        
        // Log the title (for debugging or other purposes)
        //console.log(title);
        
        // Fetch post data and update the page content
        gql(showPost)
            .then(postData => {
                history.pushState({}, slug, `blog/${slug}`);

                // Render HTML in a specific container, e.g., #content
                console.log(postData.data.publication.posts.edges[0].node.content);
                const text=postData.data.publication.posts.edges[0].node.content

                const contentContainer = document.getElementById('content');
                contentContainer.innerHTML = `
                    <h1>${title}</h1>
                    <p>${ JSON.stringify(text)}</p>
                `;
            })
            .catch(error => console.error("Error fetching post data:"));
    };
    