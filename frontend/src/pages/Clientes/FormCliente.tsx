import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import clienteService, { Cliente } from '../../services/clienteService';

const FormCliente: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Cliente>({
    codigo: '',
    loja: '',
    nome: '',
    cpf: '',
    nome_cliente: '',
    classificacao1: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    tipo_res: '',
    telefone: '',
    celular: '',
    observacoes: ''
  });

  const isEditMode = !!id;

  // Esquema de validação
  const validationSchema = Yup.object({
    codigo: Yup.string().required('Código é obrigatório'),
    loja: Yup.string().required('Loja é obrigatória'),
    nome: Yup.string().required('Nome é obrigatório'),
    cpf: Yup.string()
      .required('CPF é obrigatório')
      .matches(
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        'CPF deve estar no formato 000.000.000-00'
      ),
    nome_cliente: Yup.string().required('Nome do cliente é obrigatório'),
    cep: Yup.string().matches(
      /^(\d{5}-\d{3})?$/,
      'CEP deve estar no formato 00000-000'
    ),
    uf: Yup.string().max(2, 'UF deve ter no máximo 2 caracteres')
  });

  // Carregar dados do cliente para edição
  useEffect(() => {
    const fetchCliente = async () => {
      if (isEditMode) {
        try {
          setIsLoading(true);
          const cliente = await clienteService.obterClientePorId(parseInt(id));
          setInitialValues(cliente);
          formik.setValues(cliente);
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
          toast.error('Não foi possível carregar os dados do cliente.');
          navigate('/clientes');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCliente();
  }, [id]);

  // Configuração do formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        if (isEditMode) {
          await clienteService.atualizarCliente(parseInt(id), values);
          toast.success('Cliente atualizado com sucesso!');
        } else {
          await clienteService.criarCliente(values);
          toast.success('Cliente criado com sucesso!');
        }
        navigate('/clientes');
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
        toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} cliente.`);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Formatar CPF enquanto o usuário digita
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove todos os não-dígitos
    if (value.length <= 11) {
      // Formata como CPF: 000.000.000-00
      value = value
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    formik.setFieldValue('cpf', value);
  };

  // Formatar CEP enquanto o usuário digita
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove todos os não-dígitos
    if (value.length <= 8) {
      // Formata como CEP: 00000-000
      value = value.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    }
    formik.setFieldValue('cep', value);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
        </div>

        {isLoading && !formik.values.id ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow p-6">
            {/* Primeira linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="codigo" className="form-label">
                  Código <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  id="codigo"
                  name="codigo"
                  className={`form-input ${
                    formik.touched.codigo && formik.errors.codigo ? 'border-red-300' : ''
                  }`}
                  value={formik.values.codigo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.codigo && formik.errors.codigo && (
                  <div className="form-error">{formik.errors.codigo}</div>
                )}
              </div>

              <div>
                <label htmlFor="loja" className="form-label">
                  Loja <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  id="loja"
                  name="loja"
                  className={`form-input ${
                    formik.touched.loja && formik.errors.loja ? 'border-red-300' : ''
                  }`}
                  value={formik.values.loja}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.loja && formik.errors.loja && (
                  <div className="form-error">{formik.errors.loja}</div>
                )}
              </div>

              <div>
                <label htmlFor="cpf" className="form-label">
                  CPF <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  className={`form-input ${
                    formik.touched.cpf && formik.errors.cpf ? 'border-red-300' : ''
                  }`}
                  value={formik.values.cpf}
                  onChange={handleCpfChange}
                  onBlur={formik.handleBlur}
                  maxLength={14}
                />
                {formik.touched.cpf && formik.errors.cpf && (
                  <div className="form-error">{formik.errors.cpf}</div>
                )}
              </div>
            </div>

            {/* Segunda linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nome" className="form-label">
                  Nome <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  className={`form-input ${
                    formik.touched.nome && formik.errors.nome ? 'border-red-300' : ''
                  }`}
                  value={formik.values.nome}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nome && formik.errors.nome && (
                  <div className="form-error">{formik.errors.nome}</div>
                )}
              </div>

              <div>
                <label htmlFor="nome_cliente" className="form-label">
                  Nome do Cliente <span className="text-danger-600">*</span>
                </label>
                <input
                  type="text"
                  id="nome_cliente"
                  name="nome_cliente"
                  className={`form-input ${
                    formik.touched.nome_cliente && formik.errors.nome_cliente ? 'border-red-300' : ''
                  }`}
                  value={formik.values.nome_cliente}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nome_cliente && formik.errors.nome_cliente && (
                  <div className="form-error">{formik.errors.nome_cliente}</div>
                )}
              </div>
            </div>

            {/* Terceira linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label htmlFor="classificacao1" className="form-label">
                  Classificação
                </label>
                <input
                  type="text"
                  id="classificacao1"
                  name="classificacao1"
                  className="form-input"
                  value={formik.values.classificacao1 || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <label htmlFor="cep" className="form-label">
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  name="cep"
                  className={`form-input ${
                    formik.touched.cep && formik.errors.cep ? 'border-red-300' : ''
                  }`}
                  value={formik.values.cep || ''}
                  onChange={handleCepChange}
                  onBlur={formik.handleBlur}
                  maxLength={9}
                />
                {formik.touched.cep && formik.errors.cep && (
                  <div className="form-error">{formik.errors.cep}</div>
                )}
              </div>

              <div>
                <label htmlFor="tipo_res" className="form-label">
                  Tipo de Residência
                </label>
                <input
                  type="text"
                  id="tipo_res"
                  name="tipo_res"
                  className="form-input"
                  value={formik.values.tipo_res || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Quarta linha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <label htmlFor="endereco" className="form-label">
                  Endereço
                </label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  className="form-input"
                  value={formik.values.endereco || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <label htmlFor="numero" className="form-label">
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  className="form-input"
                  value={formik.values.numero || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Quinta linha */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="bairro" className="form-label">
                  Bairro
                </label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  className="form-input"
                  value={formik.values.bairro || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <label htmlFor="cidade" className="form-label">
                  Cidade
                </label>
                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  className="form-input"
                  value={formik.values.cidade || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <label htmlFor="uf" className="form-label">
                  UF
                </label>
                <input
                  type="text"
                  id="uf"
                  name="uf"
                  className={`form-input ${
                    formik.touched.uf && formik.errors.uf ? 'border-red-300' : ''
                  }`}
                  value={formik.values.uf || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={2}
                />
                {formik.touched.uf && formik.errors.uf && (
                  <div className="form-error">{formik.errors.uf}</div>
                )}
              </div>
            </div>

            {/* Sexta linha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="telefone" className="form-label">
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefone"
                  name="telefone"
                  className="form-input"
                  value={formik.values.telefone || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div>
                <label htmlFor="celular" className="form-label">
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  className="form-input"
                  value={formik.values.celular || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>

            {/* Sétima linha */}
            <div className="mb-6">
              <label htmlFor="observacoes" className="form-label">
                Observações
              </label>
              <textarea
                id="observacoes"
                name="observacoes"
                rows={4}
                className="form-input"
                value={formik.values.observacoes || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/clientes')}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !formik.isValid}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FormCliente;