import type {
    BaseListFilters,
    
    RecordStatus,
} from './api';

export type SignatureStatus =
    | 'fully'
    | 'partially';

export interface Cheque {

    id: number;

    bank_id: number;

    bank?: {

        id: number;

        name: string;

        branch?: string | null;

    } | null;

    branch: string;

    cheque_no: string;

    signature_status: SignatureStatus;

    status: RecordStatus;

    registered_by?: string | null;

    date_registered?: string | null;

    void_by?: string | null;

    void_date?: string | null;

    active_by?: string | null;

    active_date?: string | null;

    is_used: boolean;

    can_edit: boolean;

    can_void: boolean;

    can_activate: boolean;

    deleted_at?: string | null;

}

export interface ChequeFormValues {

    bank_id: number;

    branch: string;

    cheque_no: string;

    signature_status: SignatureStatus;

    status: RecordStatus;

}

export interface ChequeFilters
    extends Omit<
        BaseListFilters,
        'status'
    > {

    bank_id?: number;

    signature_status?: SignatureStatus;

    status?: RecordStatus | 'void';

}

export interface ChequeStatistics {

    total: number;

    active: number;

    void: number;

    deleted: number;

    fully_signed: number;

    partially_signed: number;

    used: number;

    unused: number;

}