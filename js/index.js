const BOOKS_URL = "http://localhost:3000/books/"
const USERS_URL = "http://localhost:3000/users/"
const USERID = 1;
document.addEventListener("DOMContentLoaded", function() 
{
  fetchBooks();
});
const fetchBooks = () =>
{
  fetch(BOOKS_URL)
  .then(r => r.json())
  .then(renderBooks);
}
const renderBooks = (books) =>
{
  const ul = document.getElementById('list');
  ul.innerHTML = "";
  books.forEach(book => renderBook(book,ul));
}
const renderBook = (book,ul) =>
{
  const li = document.createElement("li");
  li.innerText = book.title;
  ul.append(li);
  li.addEventListener("click",e => showBook(book));
}
const showBook = (book) =>
{
  const div = document.getElementById("show-panel");
  div.innerHTML =
  `<img src=${book.img_url} alt=${book.title}>
   <h2>${book.title}</h2>
   <h3>${book.subtitle}</h3>
   <h3>${book.author}</h3>
   <p>${book.description}</p>`

  const ul = document.createElement("ul");
  book.users.forEach(user =>
  {
    const li = document.createElement("li");
    li.innerText = user.username;
    ul.append(li);
  });

  div.append(ul);
  const button = document.createElement("button");
  //console.log(book.users.find(user => {}))
  if(book.users.find(usr => {return usr.id === USERID}))
    button.innerText = "Undo Like";
  else
    button.innerText = "Like";
  div.append(button);

  button.addEventListener("click",e => likeBook(book));
  
}


const likeBook = (book) =>
{   
  fetchUsersThenPatch(book,USERID);   
}
const fetchUsersThenPatch = (book,id) =>
{
  fetch(USERS_URL+id)
  .then(r => r.json())
  .then(user => patchBook(book,user));
}
const patchBook = (book,user) =>
{
  
  const users = toggleUser(book,user);
  console.log(users);
  const configObject =
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(users)
  };
  fetch(BOOKS_URL + book.id,configObject)
  .then(r => r.json())
  .then(book => showBook(book));
}

const toggleUser = (book,user) =>
{
  if (!book.users.find(usr => {return usr.id === USERID}))
    return ({users: [user,...book.users]});
  else
    return {users: book.users.filter(usr => {return usr.id != USERID})};  
}