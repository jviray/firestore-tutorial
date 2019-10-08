const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

// Create element with data inside and render cafe
function renderCafe(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let neighborhood = document.createElement('span');
  let remove = document.createElement('div');

  li.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  neighborhood.textContent = doc.data().neighborhood;
  remove.textContent = 'x';

  li.appendChild(name);
  li.appendChild(neighborhood);
  li.appendChild(remove);

  cafeList.appendChild(li);

  // Deleting data from Firestore
  remove.addEventListener('click', evt => {
    let id = doc.id;
    db.collection('cafes')
      .doc(id)
      .delete();
  });
}

// Fetching data from Firestore
db.collection('cafes')
  .get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      renderCafe(doc);
    });
  });

// Saving data to Firestore
form.addEventListener('submit', evt => {
  // Don't do the default refresh of the page on submit
  evt.preventDefault();

  db.collection('cafes').add({
    name: form.name.value,
    neighborhood: form.neighborhood.value
  });

  form.reset();
});
