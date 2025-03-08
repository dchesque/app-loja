import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Card, Row, Col, Button, Spinner, Alert,
  ListGroup, Badge, Tab, Tabs 
} from 'react-bootstrap';
import { FaEdit, FaArrowLeft, FaPhone, FaEnvelope, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { getFornecedorById } from '../../services/fornecedorService';

const VisualizarFornecedor = () => {
  const { id } = useParams();
  const [fornecedor, setFornecedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchFornecedor();
  }, [id]);
  
  const fetchFornecedor = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFornecedorById(id);
      
      if (response.success && response.data) {
        setFornecedor(response.data);
      } else {
        setError('Não foi possível carregar os dados do fornecedor.');
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
      setError('Erro ao carregar dados do fornecedor. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Formatar CNPJ para exibição
  const formatCnpj = (cnpj) => {
    if (!cnpj) return '';
    
    // Remove caracteres não numéricos
    const numericCnpj = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos
    if (numericCnpj.length !== 14) return cnpj;
    
    // Formata como XX.XXX.XXX/XXXX-XX
    return `${numericCnpj.substring(0, 2)}.${numericCnpj.substring(2, 5)}.${numericCnpj.substring(5, 8)}/${numericCnpj.substring(8, 12)}-${numericCnpj.substring(12)}`;
  };
  
  // Formatar data para exibição
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error || !fornecedor) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'Fornecedor não encontrado.'}
        </Alert>
        <Link to="/fornecedores" className="btn btn-primary">
          <FaArrowLeft /> Voltar para lista
        </Link>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Detalhes do Fornecedor</h5>
          <Link to={`/fornecedores/editar/${id}`} className="btn btn-light btn-sm">
            <FaEdit /> Editar
          </Link>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-4">
            <Col md={12}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-1">{fornecedor.razao_social}</h3>
                  <p className="text-muted mb-0">
                    {fornecedor.nome_fantasia}
                    {fornecedor.nome_fantasia !== fornecedor.razao_social && 
                      ` (${fornecedor.razao_social})`}
                  </p>
                </div>
                <Badge bg={fornecedor.status === 'ativo' ? 'success' : 'danger'} className="fs-6">
                  {fornecedor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <hr />
            </Col>
          </Row>
          
          <Tabs defaultActiveKey="info-gerais" className="mb-4">
            <Tab eventKey="info-gerais" title="Informações Gerais">
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Código:</span>
                      <span>{fornecedor.codigo}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">CNPJ:</span>
                      <span>{formatCnpj(fornecedor.cnpj)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Inscrição Estadual:</span>
                      <span>{fornecedor.inscricao_estadual || 'Não informada'}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Categoria:</span>
                      <span>{fornecedor.categoria || 'Não informada'}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaPhone className="me-2 text-primary" />
                        <span className="fw-bold me-2">Telefone:</span>
                        <span>{fornecedor.telefone || 'Não informado'}</span>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="me-2 text-primary" />
                        <span className="fw-bold me-2">Email:</span>
                        {fornecedor.email ? (
                          <a href={`mailto:${fornecedor.email}`}>{fornecedor.email}</a>
                        ) : (
                          <span>Não informado</span>
                        )}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaGlobe className="me-2 text-primary" />
                        <span className="fw-bold me-2">Website:</span>
                        {fornecedor.website ? (
                          <a href={fornecedor.website} target="_blank" rel="noopener noreferrer">
                            {fornecedor.website}
                          </a>
                        ) : (
                          <span>Não informado</span>
                        )}
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <span className="fw-bold me-2">Contato:</span>
                        <span>{fornecedor.contato || 'Não informado'}</span>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="endereco" title="Endereço">
              <Row>
                <Col md={12}>
                  <Card className="border-0">
                    <Card.Body>
                      {fornecedor.endereco ? (
                        <div>
                          <div className="d-flex align-items-center mb-3">
                            <FaMapMarkerAlt className="me-2 text-danger" size={24} />
                            <h5 className="mb-0">Endereço Completo</h5>
                          </div>
                          
                          <Row className="mb-3">
                            <Col md={12}>
                              <p className="mb-1">
                                {fornecedor.endereco}, {fornecedor.numero}
                                {fornecedor.complemento && ` - ${fornecedor.complemento}`}
                              </p>
                              <p className="mb-1">
                                {fornecedor.bairro && `${fornecedor.bairro}, `}
                                {fornecedor.cidade && `${fornecedor.cidade}`}
                                {fornecedor.uf && ` - ${fornecedor.uf}`}
                              </p>
                              <p>{fornecedor.cep && `CEP: ${fornecedor.cep}`}</p>
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <Alert variant="info">
                          Nenhum endereço cadastrado para este fornecedor.
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            
            <Tab eventKey="outras-info" title="Observações e Histórico">
              <Row>
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Observações</h6>
                    </Card.Header>
                    <Card.Body>
                      {fornecedor.observacoes ? (
                        <p>{fornecedor.observacoes}</p>
                      ) : (
                        <p className="text-muted">Nenhuma observação registrada.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="h-100">
                    <Card.Header className="bg-light">
                      <h6 className="mb-0">Histórico de Registro</h6>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span className="fw-bold">Data de Cadastro:</span>
                          <span>{formatDate(fornecedor.created_at)}</span>
                        </ListGroup.Item>
                        
                        {fornecedor.updated_at && (
                          <ListGroup.Item className="d-flex justify-content-between">
                            <span className="fw-bold">Última Atualização:</span>
                            <span>{formatDate(fornecedor.updated_at)}</span>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
          
          <hr />
          
          <div className="mt-3">
            <Link to="/fornecedores" className="btn btn-primary">
              <FaArrowLeft /> Voltar para lista
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VisualizarFornecedor;