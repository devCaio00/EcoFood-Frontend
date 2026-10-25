export type TipoUsuario = "Doador" | "Receptor" | "Admin";

export type StatusDoacao =
  | "Disponivel"
  | "Reservado"
  | "Retirado"
  | "Expirado"
  | "Cancelado";

export type StatusReserva = "Pendente" | "Concluida" | "Cancelada";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  tipoUsuario: TipoUsuario;
  endereco: string;
  dataCadastro: string;
}

export interface Doacao {
  id: number;
  doadorId: number;
  doadorNome: string;
  doadorEndereco: string;
  descricao: string;
  categoria: string | null;
  quantidade: number;
  unidadeMedida: string;
  validadeAlimento: string | null;
  status: StatusDoacao;
  observacoes: string | null;
  dataCriacao: string;
}

export interface Reserva {
  id: number;
  doacaoId: number;
  doacaoDescricao: string;
  receptorId: number;
  receptorNome: string;
  enderecoConfirmado: boolean;
  enderecoRetiradaSnapshot: string;
  dataReserva: string;
  dataRetirada: string | null;
  status: StatusReserva;
}

// Payloads de entrada
export interface NovoUsuario {
  nome: string;
  email: string;
  telefone?: string;
  tipoUsuario: TipoUsuario;
  endereco: string;
}

export interface NovaDoacao {
  doadorId: number;
  descricao: string;
  categoria?: string;
  quantidade: number;
  unidadeMedida: string;
  validadeAlimento?: string | null;
  observacoes?: string;
}

export interface NovaReserva {
  doacaoId: number;
  receptorId: number;
  enderecoConfirmado: boolean;
}