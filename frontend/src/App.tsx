import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Additional routes will be added as we develop more pages */}
          {/* <Route path="/status/:jobId" element={<StatusPage />} /> */}
          {/* <Route path="/result/:jobId" element={<ResultPage />} /> */}
        </Routes>
      </Router>
    </AppContainer>
  )
}

// Styled components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f9f9fc;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export default App
