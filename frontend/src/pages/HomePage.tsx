import { useState } from 'react';
import styled from 'styled-components';
import apiService from '../services/api.service';
import { GenerateRequestDto, GenerationJobDto } from '../types/api';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GenerateRequestDto>({
    topic: '',
    gradeLevel: 'high-school',
    additionalInstructions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.startGeneration(formData);
      setJobId(response.jobId);
    } catch (err) {
      setError('Failed to start generation process. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>📚 BookAgent</h1>
        <p>AI-Powered Collaborative Textbook Authoring</p>
      </Header>

      <FormSection>
        <h2>Create New Textbook Content</h2>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {!jobId ? (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <label htmlFor="topic">Topic/Subject Matter *</label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., Quantum Mechanics, Ancient Roman History"
                required
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="gradeLevel">Target Grade Level *</label>
              <select
                id="gradeLevel"
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                required
              >
                <option value="elementary">Elementary School</option>
                <option value="middle-school">Middle School</option>
                <option value="high-school">High School</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="graduate">Graduate</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label htmlFor="additionalInstructions">Additional Instructions (Optional)</label>
              <textarea
                id="additionalInstructions"
                name="additionalInstructions"
                value={formData.additionalInstructions}
                onChange={handleChange}
                placeholder="Any specific requirements, focus areas, or preferences"
                rows={4}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Generate Content'}
            </SubmitButton>
          </Form>
        ) : (
          <RedirectSection>
            <h3>Content Generation Started!</h3>
            <p>Your job ID is: <strong>{jobId}</strong></p>
            <p>You will be redirected to the status page shortly...</p>
            {/* In a real implementation, we would use React Router to navigate programmatically */}
          </RedirectSection>
        )}
      </FormSection>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    color: #8954BF;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 600;
    margin-bottom: 8px;
    color: #444;
  }
  
  input, select, textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #8954BF;
      box-shadow: 0 0 0 2px rgba(137, 84, 191, 0.2);
    }
  }
`;

const SubmitButton = styled.button`
  background-color: #8954BF;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #7145a3;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RedirectSection = styled.div`
  text-align: center;
  
  h3 {
    color: #8954BF;
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  background-color: #ffebee;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-weight: 500;
`;

export default HomePage;
