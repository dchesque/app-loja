import { Router } from 'express';

// Importando rotas dos módulos
import authRoutes from '../modules/auth/AuthRoutes';
import clienteRoutes from '../modules/clientes/clienteRoutes';
import fornecedorRoutes from '../modules/fornecedores/fornecedorRoutes';
// Comentando as rotas que ainda não foram implementadas
// import funcionarioRoutes from '../modules/funcionarios/funcionarioRoutes';
// import contasPagarRoutes from '../modules/financeiro/contasPagar/contasPagarRoutes';
// import planoContasRoutes from '../modules/financeiro/planoContas/planoContasRoutes';
// import chequesRoutes from '../modules/financeiro/cheques/chequesRoutes';

const router = Router();

// Configurando as rotas de cada módulo
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/fornecedores', fornecedorRoutes);
// Comentando as rotas que ainda não foram implementadas
// router.use('/funcionarios', funcionarioRoutes);
// router.use('/financeiro/contas-pagar', contasPagarRoutes);
// router.use('/financeiro/plano-contas', planoContasRoutes);
// router.use('/financeiro/cheques', chequesRoutes);

export default router;