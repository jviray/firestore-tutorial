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

/********************************************************************
//  Fetching data from Firestore with .get()
//   - Specific queries: .where('neighborhood', '==', 'Nolita').get()
//   - Ordering: .orderBy()
//   - *** May be required to set an index in Firestore

db.collection('cafes')
  .orderBy('name')
  .get()
  .then(snapshot => {
    snapshot.docs.forEach(doc => {
      renderCafe(doc);
    });
  });

********************************************************************/

// Real-time databse listener
db.collection('cafes')
  .orderBy('neighborhood')
  .onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
      if (change.type == 'added') {
        renderCafe(change.doc);
      } else if (change.type == 'removed') {
        let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
        cafeList.removeChild(li);
      }
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

/********************************************************************
// Updating Data
//   - .update()
//   - .set() will override all document fields

db.collection('cafes').doc('...').update({
  name: 'Blue Bottle Cafe'
});

********************************************************************/
