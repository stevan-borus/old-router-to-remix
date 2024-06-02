import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Root from './routes/Root';
import Note from './routes/Note';
import NewNote from './routes/NewNote';
import Auth from './routes/Auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Root />
            </ProtectedRoute>
          }
        >
          <Route path='/note/:noteId' element={<Note />} />
          <Route path='/new-note' element={<NewNote />} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
