import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import fornecedorService, { Fornecedor } from '../../services/fornecedorService';

const FormFornecedor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Fornecedor>({
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
  });

  const isEditMode = !!id;

  // Esquema de validação
  const validationSchema = Yup.object({
    codigo: Yup.string().required('Código é obrigatório'),
    razao_social: Yup.string().required('Razão Social é obrigatória'),
    nome_fantasia: Yup.string().required('Nome Fantasia é obrigatório'),
    cnpj: Yup.string()
      .required('CNPJ é obrigatório')
      .matches(
        /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
        'CNPJ deve estar no formato 00.000.000/0000-00'
      ),
    email: Yup.string().email('Email inválido').nullable(),
    cep: Yup.string().matches(
      /^(\d{5}-\d{3})?$/,
      'CEP deve estar no formato 00000-000'
    ).nullable(),
    uf: Yup.string().max(2, 'UF deve ter no máximo 2 caracteres').nullable(),
    website: Yup.string().url('URL inválida').nullable()
  });

  // Carregar dados do fornecedor para edição
  useEffect(() => {
    const fetchFornecedor = async () => {
      if (isEditMode) {
        try {
          setIsLoading(true);
          const fornecedor = await fornecedorService.obterFornecedorPorId(parseInt(id));
          setInitialValues(fornecedor);
          formik.setValues(fornecedor);
        } catch (error) {
          console.error('Erro ao carregar fornecedor:', error);
          toast.error('Não foi possível carregar os dados do fornecedor.');
          navigate('/fornecedores');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFornecedor();
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
          await fornecedorService.atualizarFornecedor(parseInt(id), values);
          toast.success('Fornecedor atualizado com sucesso!');
        } else {
          await fornecedorService.criarFornecedor(values);
          toast.success('Fornecedor criado com sucesso!');
        }
        navigate('/fornecedores');
      } catch (error) {
        console.error('Erro ao salvar fornecedor:', error);
        toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} fornecedor.`);
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Formatar CNPJ enquanto o usuário digita
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove todos os não-dígitos
    if (value.length <= 14) {
      // Formata como CNPJ: 00.000.000/0000-00
      value = value
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    formik.setFieldValue('cnpj', value);
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

  // Buscar CEP via API
  const handleCepBlur = async () => {
    const cep = formik.values.cep?.replace(/\D/g, '');
    
    if (cep?.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          formik.setFieldValue('endereco', data.logradouro);
          formik.setFieldValue('bairro', data.bairro);
          formik.setFieldValue('cidade', data.localidade);
          formik.setFieldValue('uf', data.uf);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h1>
        </div>

        {isLoading && !formik.values.id ? (
          <div className="bg-white rounded-lg shadow p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Dados Gerais</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="md:col-span-2">
                  <label htmlFor="razao_social" className="form-label">
                    Razão Social <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="razao_social"
                    name="razao_social"
                    className={`form-input ${
                      formik.touched.razao_social && formik.errors.razao_social ? 'border-red-300' : ''
                    }`}
                    value={formik.values.razao_social}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.razao_social && formik.errors.razao_social && (
                    <div className="form-error">{formik.errors.razao_social}</div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="nome_fantasia" className="form-label">
                    Nome Fantasia <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome_fantasia"
                    name="nome_fantasia"
                    className={`form-input ${
                      formik.touched.nome_fantasia && formik.errors.nome_fantasia ? 'border-red-300' : ''
                    }`}
                    value={formik.values.nome_fantasia}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.nome_fantasia && formik.errors.nome_fantasia && (
                    <div className="form-error">{formik.errors.nome_fantasia}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="cnpj" className="form-label">
                    CNPJ <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="cnpj"
                    name="cnpj"
                    className={`form-input ${
                      formik.touched.cnpj && formik.errors.cnpj ? 'border-red-300' : ''
                    }`}
                    value={formik.values.cnpj}
                    onChange={handleCnpjChange}
                    onBlur={formik.handleBlur}
                    maxLength={18}
                  />
                  {formik.touched.cnpj && formik.errors.cnpj && (
                    <div className="form-error">{formik.errors.cnpj}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="inscricao_estadual" className="form-label">
                    Inscrição Estadual
                  </label>
                  <input
                    type="text"
                    id="inscricao_estadual"
                    name="inscricao_estadual"
                    className="form-input"
                    value={formik.values.inscricao_estadual || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

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
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${
                      formik.touched.email && formik.errors.email ? 'border-red-300' : ''
                    }`}
                    value={formik.values.email || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="form-error">{formik.errors.email}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="contato" className="form-label">
                    Contato
                  </label>
                  <input
                    type="text"
                    id="contato"
                    name="contato"
                    className="form-input"
                    value={formik.values.contato || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div>
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-input"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    onBlur={(e) => {
                      formik.handleBlur(e);
                      handleCepBlur();
                    }}
                    maxLength={9}
                  />
                  {formik.touched.cep && formik.errors.cep && (
                    <div className="form-error">{formik.errors.cep}</div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Digite o CEP para autocompletar o endereço
                  </p>
                </div>
              
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

                <div>
                  <label htmlFor="complemento" className="form-label">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    className="form-input"
                    value={formik.values.complemento || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

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
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Outras Informações</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="website" className="form-label">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className={`form-input ${
                      formik.touched.website && formik.errors.website ? 'border-red-300' : ''
                    }`}
                    value={formik.values.website || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://exemplo.com"
                  />
                  {formik.touched.website && formik.errors.website && (
                    <div className="form-error">{formik.errors.website}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="categoria" className="form-label">
                    Categoria
                  </label>
                  <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    className="form-input"
                    value={formik.values.categoria || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="md:col-span-2">
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
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/fornecedores')}
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

export default FormFornecedor;