import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaExclamationTriangle } from 'react-icons/fa';

/**
 * Componente de modal de confirmação para ações importantes
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.show - Controla se o modal está visível
 * @param {Function} props.onHide - Função chamada ao fechar o modal
 * @param {Function} props.onConfirm - Função chamada ao confirmar a ação
 * @param {string} props.title - Título do modal
 * @param {string} props.message - Mensagem do modal
 * @param {string} props.confirmButtonText - Texto do botão de confirmação
 * @param {string} props.confirmButtonVariant - Variante do botão de confirmação (cores do Bootstrap)
 */
const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = "Confirmar",
  message = "Tem certeza que deseja realizar esta ação?",
  confirmButtonText = "Confirmar",
  confirmButtonVariant = "danger"
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaExclamationTriangle className="text-warning me-2" />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant={confirmButtonVariant} onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmButtonText: PropTypes.string,
  confirmButtonVariant: PropTypes.string
};

export default ConfirmModal;