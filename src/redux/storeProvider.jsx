// "use client"
// import { Provider } from 'react-redux';
// // import store from './store';
// import { PersistGate } from 'redux-persist/integration/react';
// import store, { persistor } from './store';  // import your store and persistor
// function StoreProvider({ children }) {
//     return (
//       <Provider store={store}>
//          <PersistGate loading={null} persistor={persistor}>
//               {children}
//           </PersistGate>
//         {/* <Component {...pageProps} /> */}
//       </Provider>
//     );
//   }
  
//   export default StoreProvider;


// storeProvider.jsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';

export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}