// Libraries
import { BrowserRouter, Routes, Route} from 'react-router-dom'

// Pages
import Start from './pages/Start/Start.jsx';
import Upload from './pages/Upload/Upload.jsx';
import Video from './pages/Video/Video.jsx';
import Reformat from './pages/Reformat/Reformat.jsx';
import Request from './pages/Request/Request.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Start />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/videos" element={<Video />} />
          <Route path="/reformat" element={<Reformat />} />
          <Route path="/request" element={<Request/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
