import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import {WelcomePage} from './pages/WelcomePage';
import {ListPage} from './pages/ListPage';
import {TimelinePage} from './pages/TimelinePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
