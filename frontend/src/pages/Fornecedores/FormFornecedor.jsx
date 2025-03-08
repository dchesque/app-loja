import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, Form, Button, Card, Row, Col, Alert, Spinner, 
  InputGroup, Tab, Tabs
} from 'react-bootstrap';
import { FaSave, FaArrowLeft, FaTimes, FaCheck } from 'react-icons/fa';
import { createFornecedor, getFornecedorById, updateFornecedor } from '../../services/fornecedorService';
import InputMask from 'react-input-mask';

const FormFornecedor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Estado inicial do formulário
  const initialFormState = {
    codigo: '',
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    telefone: '',
    email: '',
    contato: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    website: '',
    categoria: '',
    observacoes: '',
    status: 'ativo'
  };
  
  // Estados
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('dados-gerais');
  
  // Buscar dados do fornecedor ao carregar em modo de edição
  useEffect(() => {
    if (isEditMode) {
      fetchFornecedor();
    }
  }, [id]);
  
  // Função para buscar dados do fornecedor
  const fetchFornecedor = async () => {
    try {
      setLoading(true);
      const response = await getFornecedorById(id);
      
      if (response.success && response.data) {
        setFormData(response.data);
      } else {
        setApiError('Não foi possível carregar os dados do fornecedor.');
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      setApiError('Erro ao carregar dados do fornecedor. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handler para mudança nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    
    // Limpar erro específico quando o campo é alterado
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Função para validar o formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validações obrigatórias
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }
    
    if (!formData.razao_social.trim()) {
      newErrors.razao_social = 'Razão Social é obrigatória';
    }
    
    if (!formData.nome_fantasia.trim()) {
      newErrors.nome_fantasia = 'Nome Fantasia é obrigatório';
    }
    
    // Validar CNPJ (simplificado)
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else {
      const cnpjNumbers = formData.cnpj.replace(/\D/g, '');
      if (cnpjNumbers.length !== 14) {
        newErrors.cnpj = 'CNPJ inválido';
      }
    }
    
    // Validar email se fornecido
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar CEP se fornecido
    if (formData.cep) {
      const cepNumbers = formData.cep.replace(/\D/g, '');
      if (cepNumbers && cepNumbers.length !== 8) {
        newErrors.cep = 'CEP inválido';
      }
    }
    
    // Validar UF se fornecido
    if (formData.uf && formData.uf.length !== 2) {
      newErrors.uf = 'UF deve ter 2 caracteres';
    }
    
    // Validar website se fornecido
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website deve começar com http:// ou https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Função para buscar dados do CEP via API externa
  const handleCepBlur = async (e) => {
    const cep = e.target.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
      return;
    }
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData((prevData) => ({
          ...prevData,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };
  
  // Função para submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
      // Determinar qual tab contém erro para focar nela
      if (errors.codigo || errors.razao_social || errors.nome_fantasia || errors.cnpj || 
          errors.inscricao_estadual || errors.telefone || errors.email || errors.contato) {
        setActiveTab('dados-gerais');
      } else if (errors.cep || errors.endereco || errors.numero || errors.bairro || 
                errors.cidade || errors.uf) {
        setActiveTab('endereco');
      } else {
        setActiveTab('outras-info');
      }
      return;
    }
    
    try {
      setSubmitting(true);
      setApiError(null);
      
      let response;
      if (isEditMode) {
        response = await updateFornecedor(id, formData);
      } else {
        response = await createFornecedor(formData);
      }
      
      if (response.success) {
        setSuccess(`Fornecedor ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/fornecedores');
        }, 2000);
      } else {
        setApiError('Ocorreu um erro. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      
      // Tratamento de mensagens de erro específicas da API
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError(`Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} fornecedor. Por favor, tente novamente.`);
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  // Função para formatar CNPJ
  const formatCnpj = (value) => {
    if (!value) return '';
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Carregando dados do fornecedor...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">{isEditMode ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h5>
        </Card.Header>
        
        <Card.Body>
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {/* Aba de Dados Gerais */}
              <Tab eventKey="dados-gerais" title="Dados Gerais">
                <Row className="mb-3">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Código*</Form.Label>
                      <Form.Control
                        type="text"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        isInvalid={!!errors.codigo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.codigo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Razão Social*</Form.Label>
                      <Form.Control
                        type="text"
                        name="razao_social"
                        value={formData.razao_social}
                        onChange={handleChange}
                        isInvalid={!!errors.razao_social}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.razao_social}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={5}>
                    <Form.Group>
                      <Form.Label>Nome Fantasia*</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome_fantasia"
                        value={formData.nome_fantasia}
                        onChange={handleChange}
                        isInvalid={!!errors.nome_fantasia}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nome_fantasia}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>CNPJ*</Form.Label>
                      <InputGroup>
                        <InputMask
                          mask="99.999.999/9999-99"
                          value={formData.cnpj}
                          onChange={handleChange}
                        >
                          {(inputProps) => (
                            <Form.Control
                              {...inputProps}
                              type="text"
                              name="cnpj"
                              isInvalid={!!errors.cnpj}
                            />
                          )}
                        </InputMask>
                        <Form.Control.Feedback type="invalid">
                          {errors.cnpj}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Inscrição Estadual</Form.Label>
                      <Form.Control
                        type="text"
                        name="inscricao_estadual"
                        value={formData.inscricao_estadual}
                        onChange={handleChange}
                        isInvalid={!!errors.inscricao_estadual}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.inscricao_estadual}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Telefone</Form.Label>
                      <InputGroup>
                        <InputMask
                          mask="(99) 9999-9999"
                          value={formData.telefone}
                          onChange={handleChange}
                        >
                          {(inputProps) => (
                            <Form.Control
                              {...inputProps}
                              type="text"
                              name="telefone"
                              isInvalid={!!errors.telefone}
                            />
                          )}
                        </InputMask>
                        <Form.Control.Feedback type="invalid">
                          {errors.telefone}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Contato</Form.Label>
                      <Form.Control
                        type="text"
                        name="contato"
                        value={formData.contato}
                        onChange={handleChange}
                        isInvalid={!!errors.contato}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contato}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              
              {/* Aba de Endereço */}
              <Tab eventKey="endereco" title="Endereço">
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>CEP</Form.Label>
                      <InputGroup>
                        <InputMask
                          mask="99999-999"
                          value={formData.cep}
                          onChange={handleChange}
                          onBlur={handleCepBlur}
                        >
                          {(inputProps) => (
                            <Form.Control
                              {...inputProps}
                              type="text"
                              name="cep"
                              isInvalid={!!errors.cep}
                            />
                          )}
                        </InputMask>
                        <Form.Control.Feedback type="invalid">
                          {errors.cep}
                        </Form.Control.Feedback>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Digite o CEP para autocompletar o endereço
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={7}>
                    <Form.Group>
                      <Form.Label>Endereço</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        isInvalid={!!errors.endereco}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.endereco}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        isInvalid={!!errors.numero}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.numero}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Complemento</Form.Label>
                      <Form.Control
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        isInvalid={!!errors.complemento}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.complemento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Bairro</Form.Label>
                      <Form.Control
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        isInvalid={!!errors.bairro}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.bairro}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Cidade</Form.Label>
                      <Form.Control
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        isInvalid={!!errors.cidade}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cidade}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>UF</Form.Label>
                      <Form.Control
                        type="text"
                        name="uf"
                        value={formData.uf}
                        onChange={handleChange}
                        isInvalid={!!errors.uf}
                        maxLength={2}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.uf}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
              
              {/* Aba de Outras Informações */}
              <Tab eventKey="outras-info" title="Outras Informações">
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Website</Form.Label>
                      <Form.Control
                        type="text"
                        name="website"
                        placeholder="https://exemplo.com"
                        value={formData.website}
                        onChange={handleChange}
                        isInvalid={!!errors.website}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.website}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Categoria</Form.Label>
                      <Form.Control
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        isInvalid={!!errors.categoria}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.categoria}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Observações</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleChange}
                        isInvalid={!!errors.observacoes}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.observacoes}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab>
            </Tabs>
            
            <hr />
            
            <div className="d-flex justify-content-between">
              <Link to="/fornecedores" className="btn btn-secondary">
                <FaArrowLeft /> Voltar
              </Link>
              <div>
                <Button 
                  variant="success" 
                  type="submit" 
                  className="ms-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FormFornecedor;