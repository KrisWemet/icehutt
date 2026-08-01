/* Firebase connection details for the flavour stock board.
   These values are meant to be public — Firebase web config is not a secret.
   What actually protects the data is the Firestore security rules: anyone may
   read the board, only a signed-in staff account may change it.
   See ADMIN-SETUP.md for where to copy these from. */
window.ICEHUT_FIREBASE = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME'
};
