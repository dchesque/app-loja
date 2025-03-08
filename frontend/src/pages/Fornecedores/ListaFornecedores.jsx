import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Card, 
  Input, 
  Select, 
  Pagination, 
  Space, 
  Tag, 
  Modal, 
  message, 
  Tooltip,
  Row,
  Col,
  Form
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  SearchOutlined, 
  ReloadOutlined 
} from '@ant-design/icons';
import fornecedorService from '../../services/fornecedorService';
import authService from '../../services/authService';

const { Option } = Select;
const { confirm } = Modal;

const ListaFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchForm] = Form.useForm();
  const [filtros, setFiltros] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    codigo: '',
    cidade: '',
    uf: '',
    categoria: '',
    status: ''
  });
  const [canEdit, setCanEdit] = useState(false);

  const estadosBrasileiros = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  useEffect(() => {
    // Verificar se o usuário tem permissão para editar fornecedores
    const userRole = authService.getUserRole();
    setCanEdit(userRole === 'ADMIN' || userRole === 'MASTER_ADMIN');
    
    loadFornecedores();
  }, [pagination.current, pagination.pageSize, filtros]);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      
      // Preparar parâmetros para a requisição
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filtros
      };
      
      // Remover parâmetros vazios
      Object.keys(params).forEach(key => 
        params[key] === '' && delete params[key]
      );

      const response = await fornecedorService.getFornecedores(params);
      
      if (response.success) {
        setFornecedores(response.data);
        setTotal(response.count);
        setPagination({
          ...pagination,
          total: response.count
        });
      }
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      message.error('Não foi possível carregar os fornecedores.');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination
    });
  };

  const handleSearch = (values) => {
    // Atualizar filtros e resetar paginação
    setFiltros({
      razao_social: values.razao_social || '',
      nome_fantasia: values.nome_fantasia || '',
      cnpj: values.cnpj || '',
      codigo: values.codigo || '',
      cidade: values.cidade || '',
      uf: values.uf || '',
      categoria: values.categoria || '',
      status: values.status || ''
    });
    
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const resetFilters = () => {
    searchForm.resetFields();
    setFiltros({
      razao_social: '',
      nome_fantasia: '',
      cnpj: '',
      codigo: '',
      cidade: '',
      uf: '',
      categoria: '',
      status: ''
    });
    
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Tem certeza que deseja excluir este fornecedor?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      async onOk() {
        try {
          const response = await fornecedorService.deleteFornecedor(id);
          if (response.success) {
            message.success('Fornecedor excluído com sucesso!');
            loadFornecedores();
          }
        } catch (error) {
          console.error('Erro ao excluir fornecedor:', error);
          message.error('Não foi possível excluir o fornecedor.');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      key: 'codigo',
      width: 100,
      sorter: (a, b) => a.codigo.localeCompare(b.codigo)
    },
    {
      title: 'Razão Social',
      dataIndex: 'razao_social',
      key: 'razao_social',
      sorter: (a, b) => a.razao_social.localeCompare(b.razao_social)
    },
    {
      title: 'Nome Fantasia',
      dataIndex: 'nome_fantasia',
      key: 'nome_fantasia',
      sorter: (a, b) => a.nome_fantasia.localeCompare(b.nome_fantasia)
    },
    {
      title: 'CNPJ',
      dataIndex: 'cnpj',
      key: 'cnpj',
      width: 180
    },
    {
      title: 'Cidade/UF',
      key: 'cidade_uf',
      render: (_, record) => (
        <span>
          {record.cidade ? record.cidade : '-'}
          {record.cidade && record.uf ? '/' : ''}
          {record.uf ? record.uf : ''}
        </span>
      )
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ativo' ? 'green' : 'red'}>
          {status === 'ativo' ? 'Ativo' : 'Inativo'}
        </Tag>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Link to={`/fornecedores/editar/${record.id}`}>
              <Button 
                type="primary" 
                icon={<EditOutlined />} 
                size="small"
                disabled={!canEdit}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Excluir">
            <Button 
              type="danger" 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleDelete(record.id)}
              disabled={!canEdit}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="fornecedores-list-container">
      <Card title="Fornecedores" extra={
        canEdit && (
          <Link to="/fornecedores/novo">
            <Button type="primary" icon={<PlusOutlined />}>
              Novo Fornecedor
            </Button>
          </Link>
        )
      }>
        {/* Filtros de pesquisa */}
        <Card className="filter-card" style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="vertical"
            onFinish={handleSearch}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="razao_social" label="Razão Social">
                  <Input placeholder="Buscar por razão social" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="nome_fantasia" label="Nome Fantasia">
                  <Input placeholder="Buscar por nome fantasia" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="cnpj" label="CNPJ">
                  <Input placeholder="Buscar por CNPJ" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="codigo" label="Código">
                  <Input placeholder="Buscar por código" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="cidade" label="Cidade">
                  <Input placeholder="Buscar por cidade" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="uf" label="UF">
                  <Select 
                    placeholder="Selecione o estado"
                    allowClear
                  >
                    {estadosBrasileiros.map(estado => (
                      <Option key={estado.value} value={estado.value}>
                        {estado.label} ({estado.value})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="categoria" label="Categoria">
                  <Input placeholder="Buscar por categoria" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="status" label="Status">
                  <Select 
                    placeholder="Selecione o status"
                    allowClear
                  >
                    <Option value="ativo">Ativo</Option>
                    <Option value="inativo">Inativo</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={resetFilters} icon={<ReloadOutlined />}>
                    Limpar
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SearchOutlined />}
                  >
                    Buscar
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Card>

        <Table
          columns={columns}
          dataSource={fornecedores}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            showSizeChanger: true,
            showTotal: (total) => `Total de ${total} fornecedores`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default ListaFornecedores;