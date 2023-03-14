const postsContainerEl = document.getElementById("posts-container");
const loaderEl = document.getElementById("loader");
const filterEl = document.getElementById("filter");

let limit = 10;
let page = 1;
let loaderIndicate = false;

let dataFromBack = [];

const renderItem = (post) => {
  const { id, title, body } = post;
  return `
    <div class = "post">
        <div class = "number">${id}</div>
        <div class = "post-info">
            <h2>${title}</h2>
            <p class = "post_body">${body}</p>

        </div>
    </div>
    `;
};

const getData = async () => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
    );
    if (!response.ok) {
      throw new Error("Oops sorry, try again later");
    }
    page += 1;
    const data = await response.json();
    dataFromBack = [...dataFromBack, ...data];
    return data;
    // postsContainerEl.innerHTML += data.reduce(
    //     (accum, element) => (accum += renderItem(element)),
    //     ""
    // )
    // console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const renderPosts = async () => {
  loaderEl.classList.add("show");
  loaderIndicate = true;

  const data = await getData();
  postsContainerEl.innerHTML += data.reduce(
    (accum, el) => (accum += renderItem(el)),
    ""
  );
  loaderEl.classList.remove("show");
  loaderIndicate = false;
};

const setScrollCheck = () => {
  if (loaderIndicate) {
    return;
  }
  const { scrollHeight, clientHeight, scrollTop } = document.documentElement;

  if (scrollTop + clientHeight + 1 >= scrollHeight) {
    renderPosts();
    console.log("end");
  }
};

const searchPosts = (event) => {
  const term = event.target.value.toLowerCase();
  const filteredPosts = dataFromBack.filter(
    (el) => el.title.toLowerCase().indexOf(term) >= 0 ||
    el.id.toString().indexOf(term) >= 0 ||
    el.body.toLowerCase().indexOf(term) >= 0
  );
  postsContainerEl.innerHTML = filteredPosts.reduce(
    (accum, el) => (accum += renderItem(el)),
    ""
  );
};

renderPosts();

window.addEventListener("scroll", setScrollCheck);
filterEl.addEventListener("input", searchPosts);
