import { useState, useRef } from 'react';
import {
  Box, Button, Input, Heading, Field, Textarea, Text, SimpleGrid
} from '@chakra-ui/react';
import { VStack } from '@chakra-ui/layout';
import { addVectorDoc, searchVector } from '../lib/api';
import { withAuth } from '../components/withAuth';

/**
 * Vector search and add page.
 */
function VectorPage() {
  // Add document state
  const [addId, setAddId] = useState('');
  const [addText, setAddText] = useState('');
  const [addMetadata, setAddMetadata] = useState('');
  const [addProvider, setAddProvider] = useState<'gemini' | 'openai'>('gemini');
  const [addMsg, setAddMsg] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Search state
  const [searchText, setSearchText] = useState('');
  const [searchProvider, setSearchProvider] = useState<'gemini' | 'openai'>('gemini');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMsg, setSearchMsg] = useState('');

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analyzeModel, setAnalyzeModel] = useState<'gemini' | 'openai'>('gemini');
  const [analyzeResult, setAnalyzeResult] = useState<any>(null);
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Handle add document
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg('');
    setAddLoading(true);
    try {
      const metadata = addMetadata ? JSON.parse(addMetadata) : {};
      await addVectorDoc(token || '', addId, addText, metadata, addProvider);
      setAddMsg('Document added!');
    } catch (err: any) {
      setAddMsg(err.response?.data?.message || 'Failed to add document');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchMsg('');
    setSearchLoading(true);
    try {
      const res = await searchVector(token || '', searchText, 5, searchProvider);
      setSearchResults(res.results || []);
      setSearchMsg(res.results?.length ? '' : 'No results found');
    } catch (err: any) {
      setSearchMsg(err.response?.data?.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handler for analyze submit
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !jobDesc) return;
    const formData = new FormData();
    formData.append('file', cvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('model', analyzeModel);
    // Call backend endpoint
    const res = await fetch(API_BASE+'/vector/analyze', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    const data = await res.json();
    setAnalyzeResult(data);
    setShowAnalyzeModal(true);
  };

  return (
    <Box maxW="3xl" mx="auto" mt={8} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
      <Heading size="md" mb={4}>Analyze CV for Job</Heading>
      <form onSubmit={handleAnalyze}>
        <VStack spacing={4} align="stretch">
          <Field.Root>
            <Field.Label>Upload CV (PDF, DOCX)</Field.Label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={e => setCvFile(e.target.files?.[0] || null)}
              ref={fileInputRef}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Job Description</Field.Label>
            <Textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste job description here..." rows={5} />
          </Field.Root>
          <Field.Root>
            <Field.Label>AI Model</Field.Label>
            <select value={analyzeModel} onChange={e => setAnalyzeModel(e.target.value as 'gemini' | 'openai')} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="gemini">Gemini (Google GenAI)</option>
              <option value="openai">OpenAI</option>
            </select>
          </Field.Root>
          <Button colorScheme="blue" type="submit" disabled={!cvFile || !jobDesc}>Analyze</Button>
        </VStack>
      </form>

      <Box as="hr" my={8} />

      

      {/* Results */}
      {searchResults.length > 0 && (
        <Box mt={8}>
          <Heading size="md" mb={4}>Results</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }}>
            {searchResults.map((res, idx) => (
              <Box key={idx} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
                <Text fontWeight="bold">ID: {res.id}</Text>
                <Text>Score: {res.score?.toFixed(4) ?? 'N/A'}</Text>
                <Text whiteSpace="pre-wrap">Text: {res.metadata?.text || ''}</Text>
                <Text fontSize="sm" color="gray.600">Metadata: {JSON.stringify(res.metadata)}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Analyze Result Modal */}
      {showAnalyzeModal && (
        <Box position="fixed" top={0} left={0} w="100vw" h="100vh" bg="blackAlpha.600" zIndex={1000} display="flex" alignItems="center" justifyContent="center">
          <Box bg="white" p={8} borderRadius="lg" boxShadow="2xl" maxW="lg" w="full">
            <Heading size="md" mb={4}>AI Analysis Result</Heading>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f7fafc', padding: 16, borderRadius: 8 }}>{JSON.stringify(analyzeResult.analysis.summary, null, 2)}</pre>
            <Button mt={4} colorScheme="blue" onClick={() => setShowAnalyzeModal(false)}>Close</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default withAuth(VectorPage); 