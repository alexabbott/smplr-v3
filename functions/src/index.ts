import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp();

const database = admin.firestore();

exports.kitsFavoriteCount = functions.firestore
  .document('kits-favorite-user/{kitId}/favorites/{userId}')
  .onWrite((change, context) => {
    console.log('change', change);
    const kitRef = database.collection('kits').doc(context.params.kitId);
    const likesRef = database.collection('kits-favorite-user').doc(context.params.kitId).collection('favorites');

    return database.runTransaction(transaction => {
      return transaction.get(likesRef).then(likesQuery => {
        const favoritesCount = likesQuery.size;
        return transaction.update(kitRef, {
          favoritesCount
        });
      });
    });
  });

exports.samplesFavoriteCount = functions.firestore
  .document('samples-favorite-user/{sampleId}/favorites/{userId}')
  .onWrite((change, context) => {
    console.log('change', change);
    const sampleRef = database.collection('samples').doc(context.params.sampleId);
    const likesRef = database.collection('samples-favorite-user').doc(context.params.sampleId).collection('favorites');

    return database.runTransaction(transaction => {
      return transaction.get(likesRef).then(likesQuery => {
        const favoritesCount = likesQuery.size;
        return transaction.update(sampleRef, {
          favoritesCount
        });
      });
    });
  });