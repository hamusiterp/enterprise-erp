--
-- PostgreSQL database dump
--

\restrict bSXTnHwLvK8AbB55bKIUwb342stcIyyHVYQbPRzNdBut7zA4AeEmOPS8gjabg9c

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_log (
    id bigint NOT NULL,
    log_name character varying(255),
    description text NOT NULL,
    subject_type character varying(255),
    subject_id bigint,
    event character varying(255),
    causer_type character varying(255),
    causer_id bigint,
    attribute_changes json,
    properties json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: activity_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_log_id_seq OWNED BY public.activity_log.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    user_id bigint,
    module character varying(100) NOT NULL,
    action character varying(50) NOT NULL,
    record_id bigint,
    record_name character varying(255),
    old_values json,
    new_values json,
    ip_address inet,
    user_agent text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: banks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banks (
    id bigint NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(150) NOT NULL,
    official_name character varying(200),
    account_number character varying(50),
    branch character varying(100),
    contact_address character varying(255),
    opening_balance numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    opening_balance_remaining numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    minimum_balance numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    overdraft_available boolean DEFAULT false NOT NULL,
    overdraft_start_date date,
    overdraft_end_date date,
    overdraft_amount numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    overdraft_amount_remaining numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    overdraft_limit numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    overdraft_status character varying(30) DEFAULT 'inactive'::character varying NOT NULL,
    term_loan_available boolean DEFAULT false NOT NULL,
    term_loan_start_date date,
    term_loan_end_date date,
    term_loan_amount numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    transfer_rate numeric(10,4) DEFAULT '0'::numeric NOT NULL,
    repayment_amount numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    repayment_amount_remaining numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    term_loan_relief boolean DEFAULT false NOT NULL,
    term_loan_relief_start_date date,
    term_loan_relief_end_date date,
    loan_status character varying(30) DEFAULT 'inactive'::character varying NOT NULL,
    period character varying(20),
    gregorian_date date,
    ethiopian_date character varying(20),
    cob_balance numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    ending_balance numeric(20,2) DEFAULT '0'::numeric NOT NULL,
    suggestion character varying(100),
    credit_suggestion character varying(100),
    category character varying(500),
    start_month character varying(50),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    last_activity text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: banks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.banks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.banks_id_seq OWNED BY public.banks.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id bigint NOT NULL,
    department_id character varying(20) NOT NULL,
    department_name character varying(200) NOT NULL,
    description text,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: designations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.designations (
    id bigint NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    department_id bigint,
    level integer,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    description text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    CONSTRAINT designations_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


--
-- Name: designations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.designations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: designations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.designations_id_seq OWNED BY public.designations.id;


--
-- Name: erp_cheque; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.erp_cheque (
    id bigint NOT NULL,
    bank_id bigint NOT NULL,
    branch character varying(100) NOT NULL,
    cheque_no character varying(50) NOT NULL,
    signature_status character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    void_by character varying(100),
    void_by_user_id bigint,
    void_date date,
    active_by character varying(100),
    active_by_user_id bigint,
    active_date date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    is_used boolean DEFAULT false NOT NULL,
    used_reference_type character varying(50),
    used_reference_id bigint,
    used_at timestamp(0) without time zone
);


--
-- Name: erp_cheque_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.erp_cheque_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: erp_cheque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.erp_cheque_id_seq OWNED BY public.erp_cheque.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection character varying(255) NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: model_has_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.model_has_permissions (
    permission_id bigint NOT NULL,
    model_type character varying(255) NOT NULL,
    model_id bigint NOT NULL
);


--
-- Name: model_has_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.model_has_roles (
    role_id bigint NOT NULL,
    model_type character varying(255) NOT NULL,
    model_id bigint NOT NULL
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    guard_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: role_has_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_has_permissions (
    permission_id bigint NOT NULL,
    role_id bigint NOT NULL
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    guard_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: sales_bank; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_bank (
    id bigint NOT NULL,
    bank_id character varying(20),
    bank_name character varying(100),
    bank_name_orginal character varying(200) NOT NULL,
    account_no character varying(50),
    branch character varying(50),
    contact_address character varying(50),
    begnning_amount numeric(64,2),
    begnning__amount_left numeric(64,2),
    od_available character varying(20),
    start_date character varying(10),
    end_date character varying(10),
    od_amount numeric(64,2),
    od_amount_left numeric(64,2),
    min_amount numeric(64,2) DEFAULT '0'::numeric NOT NULL,
    od_limit character varying(20) DEFAULT ''::character varying NOT NULL,
    od_status character varying(30),
    term_loan character varying(20),
    term_loan_start_date character varying(10),
    term_loan_end_date character varying(10),
    term_loan_amount numeric(64,2),
    transfer_rate numeric(64,2) DEFAULT '0'::numeric NOT NULL,
    repayment_amount numeric(64,2),
    repayment_amount_left character varying(20) DEFAULT ''::character varying NOT NULL,
    term_loan_relief character varying(20) DEFAULT ''::character varying NOT NULL,
    term_loan_relief_start_date character varying(20) DEFAULT ''::character varying NOT NULL,
    term_loan_relief_end_date character varying(20) DEFAULT ''::character varying NOT NULL,
    period character varying(20),
    ethiopian_date character varying(10),
    date_registered character varying(10),
    cob_balance character varying(20) DEFAULT ''::character varying NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    last_activity character varying(100) DEFAULT ''::character varying NOT NULL,
    suggestion character varying(20) DEFAULT ''::character varying NOT NULL,
    end_balance character varying(20) DEFAULT ''::character varying NOT NULL,
    loan_status character varying(20) DEFAULT ''::character varying NOT NULL,
    credit_suggestion character varying(20) DEFAULT ''::character varying NOT NULL,
    category character varying(500) DEFAULT ''::character varying NOT NULL,
    start_month character varying(50) DEFAULT ''::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_bank_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_bank_id_seq OWNED BY public.sales_bank.id;


--
-- Name: sales_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_category (
    id bigint NOT NULL,
    category character varying(50) NOT NULL,
    type character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_category_id_seq OWNED BY public.sales_category.id;


--
-- Name: sales_customer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_customer (
    id bigint NOT NULL,
    customer_no character varying(20) NOT NULL,
    customer_type character varying(30) NOT NULL,
    firstname character varying(50),
    lastname character varying(50),
    company_name character varying(200),
    email_address character varying(100),
    tin_number character varying(50),
    contact_person character varying(100),
    phone_number character varying(50) NOT NULL,
    customer_status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    withhold boolean DEFAULT false NOT NULL,
    withhold_percent numeric(5,2),
    location character varying(100) NOT NULL,
    withhold_from_advance boolean DEFAULT false NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_customer_id_seq OWNED BY public.sales_customer.id;


--
-- Name: sales_fa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_fa (
    id bigint NOT NULL,
    asset_no character varying(20) NOT NULL,
    vehicle_no character varying(50),
    tag_no character varying(50) NOT NULL,
    plate_no character varying(50),
    category_id bigint NOT NULL,
    name_of_machinery character varying(200) NOT NULL,
    make_of_vehicle character varying(100),
    model character varying(100),
    make_of_year character varying(20),
    chassis_no character varying(100),
    engine_no character varying(100),
    engine_model character varying(100),
    make_of_engine character varying(100),
    horse_power numeric(12,2),
    type_of_fuel character varying(50),
    reading_type character varying(30),
    reading numeric(18,2),
    consumption numeric(12,2),
    standard_consumption numeric(12,2),
    tanker_capacity numeric(12,2),
    last_refill date,
    has_gauge boolean DEFAULT false NOT NULL,
    gauge_reading numeric(12,2),
    service_interval integer,
    last_service date,
    purchase_date date,
    licence_renewal_date date,
    last_inspection_renewal_date date,
    last_insurance_renewal_date date,
    front_view_photo character varying(500),
    rear_view_photo character varying(500),
    right_side_view_photo character varying(500),
    left_side_view_photo character varying(500),
    libre_document character varying(500),
    inspection_document character varying(500),
    insurance_document character varying(500),
    asset_condition character varying(30) DEFAULT 'good'::character varying NOT NULL,
    current_location character varying(200),
    assigned_to character varying(200),
    remarks text,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    registered_date date,
    edited_by character varying(100),
    edited_by_user_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_fa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_fa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_fa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_fa_id_seq OWNED BY public.sales_fa.id;


--
-- Name: sales_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_item (
    id bigint NOT NULL,
    item_no character varying(30) NOT NULL,
    item_description text NOT NULL,
    category character varying(50) NOT NULL,
    unit character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    product_date date,
    type character varying(30) NOT NULL,
    inventory character varying(20) NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_item_id_seq OWNED BY public.sales_item.id;


--
-- Name: sales_project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_project (
    id bigint NOT NULL,
    project_no character varying(20) NOT NULL,
    project_source character varying(30) NOT NULL,
    bid_reference character varying(30),
    work_order_no character varying(30),
    project_name text NOT NULL,
    project_name_letter text,
    project_description text NOT NULL,
    location text NOT NULL,
    customer_id bigint,
    employer text NOT NULL,
    has_consultant boolean DEFAULT false NOT NULL,
    consultant text,
    has_specified_area boolean DEFAULT false NOT NULL,
    area character varying(100),
    construction_project_type character varying(30) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone,
    business_unit character varying(100),
    contract_type character varying(100),
    contract_amount_before_vat numeric(30,2),
    contract_pricing_type character varying(100),
    contract_date date,
    has_site_handover_date boolean DEFAULT false NOT NULL,
    site_handover_date date,
    has_commencement_date boolean DEFAULT false NOT NULL,
    commencement_date date,
    project_duration integer,
    duration_type character varying(30),
    no_of_holidays integer,
    payment_term character varying(50),
    has_advance_payment boolean DEFAULT false NOT NULL,
    advance_percent numeric(5,2),
    has_advance_repayment boolean DEFAULT false NOT NULL,
    advance_repayment_complete_percent numeric(5,2),
    advance_repayment_percent numeric(5,2),
    advance_repayment_start character varying(30),
    interim_payment_schedule integer,
    advance_payment_due_date date,
    has_advance_bond boolean DEFAULT false NOT NULL,
    advance_bond_percent numeric(5,2),
    advance_bond_type character varying(50),
    advance_bond_start_date date,
    advance_bond_end_date date,
    has_performance_bond boolean DEFAULT false NOT NULL,
    performance_bond_percent numeric(5,2),
    performance_bond_type character varying(50),
    performance_bond_start_date date,
    performance_bond_end_date date,
    has_price_adjustment boolean DEFAULT false NOT NULL,
    price_adjustment_percent numeric(5,2),
    has_retention boolean DEFAULT false NOT NULL,
    retention_percent numeric(5,2),
    has_price_index boolean DEFAULT false NOT NULL,
    has_liquidity_damage boolean DEFAULT false NOT NULL,
    liquidity_percent numeric(5,2),
    liquidity_limit numeric(30,2),
    minimum_payment_time integer,
    engineering_facilities json
);


--
-- Name: sales_project_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_project_id_seq OWNED BY public.sales_project.id;


--
-- Name: sales_purchaser; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_purchaser (
    id bigint NOT NULL,
    purchaser_no character varying(20) NOT NULL,
    purchaser_name character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_purchaser_account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_purchaser_account (
    id bigint NOT NULL,
    purchaser_id bigint NOT NULL,
    bank_id bigint NOT NULL,
    account_number character varying(50) NOT NULL,
    account_name character varying(100),
    currency character varying(10),
    is_primary boolean DEFAULT false NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_purchaser_account_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_purchaser_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_purchaser_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_purchaser_account_id_seq OWNED BY public.sales_purchaser_account.id;


--
-- Name: sales_purchaser_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_purchaser_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_purchaser_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_purchaser_id_seq OWNED BY public.sales_purchaser.id;


--
-- Name: sales_subcontractor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_subcontractor (
    id bigint NOT NULL,
    type character varying(20) NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    company_name character varying(150),
    tin_no character varying(50),
    address text NOT NULL,
    contact_person character varying(100) NOT NULL,
    phone_number character varying(100) NOT NULL,
    tax_percent numeric(5,2) DEFAULT '0'::numeric NOT NULL,
    category_id bigint NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_subcontractor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_subcontractor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_subcontractor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_subcontractor_id_seq OWNED BY public.sales_subcontractor.id;


--
-- Name: sales_supplier; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_supplier (
    id bigint NOT NULL,
    supplier_no character varying(20) NOT NULL,
    supplier_name character varying(200) NOT NULL,
    category_id bigint NOT NULL,
    address text,
    phone_number character varying(50) NOT NULL,
    has_tin boolean DEFAULT false NOT NULL,
    tin character varying(50),
    registered_by character varying(100),
    registered_by_user_id bigint,
    date_registered date,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    approved_by character varying(500),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: sales_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_supplier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_supplier_id_seq OWNED BY public.sales_supplier.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log ALTER COLUMN id SET DEFAULT nextval('public.activity_log_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: banks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banks ALTER COLUMN id SET DEFAULT nextval('public.banks_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: designations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations ALTER COLUMN id SET DEFAULT nextval('public.designations_id_seq'::regclass);


--
-- Name: erp_cheque id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque ALTER COLUMN id SET DEFAULT nextval('public.erp_cheque_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: sales_bank id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_bank ALTER COLUMN id SET DEFAULT nextval('public.sales_bank_id_seq'::regclass);


--
-- Name: sales_category id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_category ALTER COLUMN id SET DEFAULT nextval('public.sales_category_id_seq'::regclass);


--
-- Name: sales_customer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_customer ALTER COLUMN id SET DEFAULT nextval('public.sales_customer_id_seq'::regclass);


--
-- Name: sales_fa id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa ALTER COLUMN id SET DEFAULT nextval('public.sales_fa_id_seq'::regclass);


--
-- Name: sales_item id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_item ALTER COLUMN id SET DEFAULT nextval('public.sales_item_id_seq'::regclass);


--
-- Name: sales_project id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_project ALTER COLUMN id SET DEFAULT nextval('public.sales_project_id_seq'::regclass);


--
-- Name: sales_purchaser id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser ALTER COLUMN id SET DEFAULT nextval('public.sales_purchaser_id_seq'::regclass);


--
-- Name: sales_purchaser_account id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser_account ALTER COLUMN id SET DEFAULT nextval('public.sales_purchaser_account_id_seq'::regclass);


--
-- Name: sales_subcontractor id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_subcontractor ALTER COLUMN id SET DEFAULT nextval('public.sales_subcontractor_id_seq'::regclass);


--
-- Name: sales_supplier id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_supplier ALTER COLUMN id SET DEFAULT nextval('public.sales_supplier_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_log (id, log_name, description, subject_type, subject_id, event, causer_type, causer_id, attribute_changes, properties, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, module, action, record_id, record_name, old_values, new_values, ip_address, user_agent, created_at, updated_at) FROM stdin;
1	1	Departments	Update	4	Engineering	{"id":4,"department_id":"DEP002","department_name":"Engineering Department","description":"make engineering works","status":"active","registered_by":1,"created_at":"2026-07-27T19:30:38.000000Z","updated_at":"2026-07-27T19:30:53.000000Z","deleted_at":null}	{"id":4,"department_id":"DEP002","department_name":"Engineering","description":"make engineering works","status":"active","registered_by":1,"created_at":"2026-07-27T19:30:38.000000Z","updated_at":"2026-07-27T19:46:26.000000Z","deleted_at":null}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-27 19:46:26	2026-07-27 19:46:26
2	1	Departments	Update	4	Engineering Department	{"id":4,"department_id":"DEP002","department_name":"Engineering","description":"make engineering works","status":"active","registered_by":1,"created_at":"2026-07-27T19:30:38.000000Z","updated_at":"2026-07-27T19:46:26.000000Z","deleted_at":null}	{"id":4,"department_id":"DEP002","department_name":"Engineering Department","description":"make engineering works","status":"active","registered_by":1,"created_at":"2026-07-27T19:30:38.000000Z","updated_at":"2026-07-27T20:07:00.000000Z","deleted_at":null}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-27 20:07:00	2026-07-27 20:07:00
3	1	Departments	Update	4	Engineering Departments	{"id":4,"department_id":"DEP002","department_name":"Engineering Department","description":"make engineering works","status":"active","registered_by":1,"created_at":"2026-07-27T19:30:38.000000Z","updated_at":"2026-07-27T20:07:00.000000Z","deleted_at":null}	{"id":4,"department_id":"DEP002","department_name":"Engineering Departments","description":"make engineering works","status":"active","registered_by":1,"created_at":"2026-07-27T19:30:38.000000Z","updated_at":"2026-07-28T19:27:56.000000Z","deleted_at":null}	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	2026-07-28 19:27:56	2026-07-28 19:27:56
\.


--
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.banks (id, code, name, official_name, account_number, branch, contact_address, opening_balance, opening_balance_remaining, minimum_balance, overdraft_available, overdraft_start_date, overdraft_end_date, overdraft_amount, overdraft_amount_remaining, overdraft_limit, overdraft_status, term_loan_available, term_loan_start_date, term_loan_end_date, term_loan_amount, transfer_rate, repayment_amount, repayment_amount_remaining, term_loan_relief, term_loan_relief_start_date, term_loan_relief_end_date, loan_status, period, gregorian_date, ethiopian_date, cob_balance, ending_balance, suggestion, credit_suggestion, category, start_month, status, last_activity, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.departments (id, department_id, department_name, description, status, registered_by, created_at, updated_at, deleted_at) FROM stdin;
1	DEP001	Engineering Department	Make engineering works	active	1	2026-07-27 18:59:46	2026-07-27 19:00:34	2026-07-27 19:00:34
4	DEP002	Engineering Departments	make engineering works	active	1	2026-07-27 19:30:38	2026-07-28 19:27:56	\N
\.


--
-- Data for Name: designations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.designations (id, code, name, department_id, level, status, description, created_at, updated_at, deleted_at) FROM stdin;
1	DES001	Manager	4	1	active	\N	2026-07-29 19:57:29	2026-07-29 20:07:35	2026-07-29 20:07:35
2	DES002	Manager	4	1	active	\N	2026-07-29 20:07:56	2026-07-29 20:15:22	2026-07-29 20:15:22
3	DES003	Manager	4	1	active	\N	2026-07-29 20:15:40	2026-07-29 20:15:40	\N
\.


--
-- Data for Name: erp_cheque; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.erp_cheque (id, bank_id, branch, cheque_no, signature_status, status, registered_by, registered_by_user_id, date_registered, void_by, void_by_user_id, void_date, active_by, active_by_user_id, active_date, created_at, updated_at, deleted_at, is_used, used_reference_type, used_reference_id, used_at) FROM stdin;
1	5	Main	EP098877	fully	active	System Administrator	1	2026-08-06	\N	\N	\N	\N	\N	\N	2026-08-06 19:57:32	2026-08-06 19:57:32	\N	f	\N	\N	\N
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_07_25_203600_create_personal_access_tokens_table	2
5	2026_07_25_212829_create_permission_tables	3
6	2026_07_25_212938_add_status_to_users_table	4
7	2026_07_27_181408_create_departments_table	5
8	2026_07_27_190248_fix_departments_unique_constraints	6
9	2026_07_27_193829_create_audit_logs_table	7
10	2026_07_28_190610_create_designations_table	8
11	2026_07_29_204539_create_banks_table	9
12	2026_07_30_180906_create_sales_bank_table	10
13	2026_08_01_194738_create_sales_item_table	11
14	2026_08_01_204019_create_activity_log_table	12
15	2026_08_01_215012_create_sales_project_table	13
16	2026_08_01_221731_add_contract_fields_to_sales_project_table	14
17	2026_08_01_225235_add_schedule_fields_to_sales_project_table	15
18	2026_08_02_183358_add_payment_fields_to_sales_project_table	16
19	2026_08_02_185804_add_security_bond_fields_to_sales_project_table	17
20	2026_08_02_191715_add_other_fields_to_sales_project_table	18
21	2026_08_02_193757_create_sales_category_table	19
22	2026_08_02_202438_create_sales_supplier_table	20
23	2026_08_03_190153_create_sales_customer_table	21
24	2026_08_03_194346_create_sales_fa_table	22
25	2026_08_05_185202_create_sales_purchaser_table	23
26	2026_08_05_185233_create_sales_purchaser_account_table	23
27	2026_08_05_204323_fix_sales_purchaser_account_bank_foreign_key	24
28	2026_08_06_191241_create_erp_cheque_table	25
29	2026_08_06_192912_add_usage_fields_to_erp_cheque_table	26
30	2026_08_06_195328_fix_erp_cheque_bank_foreign_key	27
31	2026_08_08_195016_create_sales_subcontractor_table	28
\.


--
-- Data for Name: model_has_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.model_has_permissions (permission_id, model_type, model_id) FROM stdin;
\.


--
-- Data for Name: model_has_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.model_has_roles (role_id, model_type, model_id) FROM stdin;
1	App\\Models\\User	1
2	App\\Models\\User	2
1	App\\Models\\User	3
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, name, guard_name, created_at, updated_at) FROM stdin;
1	users.view	web	2026-07-25 21:31:42	2026-07-25 21:31:42
2	users.create	web	2026-07-25 21:31:42	2026-07-25 21:31:42
3	users.update	web	2026-07-25 21:31:42	2026-07-25 21:31:42
4	users.delete	web	2026-07-25 21:31:42	2026-07-25 21:31:42
5	users.export	web	2026-07-25 21:31:42	2026-07-25 21:31:42
6	users.reset-password	web	2026-07-25 21:31:42	2026-07-25 21:31:42
7	users.change-status	web	2026-07-25 21:31:42	2026-07-25 21:31:42
8	roles.view	web	2026-07-25 21:31:42	2026-07-25 21:31:42
9	roles.create	web	2026-07-25 21:31:42	2026-07-25 21:31:42
10	roles.update	web	2026-07-25 21:31:42	2026-07-25 21:31:42
11	roles.delete	web	2026-07-25 21:31:42	2026-07-25 21:31:42
12	permissions.view	web	2026-07-25 21:31:42	2026-07-25 21:31:42
13	audit-logs.view	web	2026-07-25 21:31:42	2026-07-25 21:31:42
14	system-settings.manage	web	2026-07-25 21:31:42	2026-07-25 21:31:42
15	departments.view	web	2026-07-27 18:24:51	2026-07-27 18:24:51
16	departments.create	web	2026-07-27 18:24:51	2026-07-27 18:24:51
17	departments.update	web	2026-07-27 18:24:51	2026-07-27 18:24:51
18	departments.delete	web	2026-07-27 18:24:51	2026-07-27 18:24:51
19	departments.export	web	2026-07-27 18:24:51	2026-07-27 18:24:51
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_has_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role_has_permissions (permission_id, role_id) FROM stdin;
1	1
2	1
3	1
4	1
5	1
6	1
7	1
8	1
9	1
10	1
11	1
12	1
13	1
14	1
1	2
2	2
3	2
5	2
8	2
1	3
1	4
15	1
16	1
17	1
18	1
19	1
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, guard_name, created_at, updated_at) FROM stdin;
1	Administrator	web	2026-07-25 21:31:42	2026-07-25 21:31:42
2	Manager	web	2026-07-25 21:31:42	2026-07-25 21:31:42
3	Officer	web	2026-07-25 21:31:42	2026-07-25 21:31:42
4	Viewer	web	2026-07-25 21:31:42	2026-07-25 21:31:42
\.


--
-- Data for Name: sales_bank; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_bank (id, bank_id, bank_name, bank_name_orginal, account_no, branch, contact_address, begnning_amount, begnning__amount_left, od_available, start_date, end_date, od_amount, od_amount_left, min_amount, od_limit, od_status, term_loan, term_loan_start_date, term_loan_end_date, term_loan_amount, transfer_rate, repayment_amount, repayment_amount_left, term_loan_relief, term_loan_relief_start_date, term_loan_relief_end_date, period, ethiopian_date, date_registered, cob_balance, status, last_activity, suggestion, end_balance, loan_status, credit_suggestion, category, start_month, created_at, updated_at, deleted_at) FROM stdin;
4	BNK1001	CBE	CBE	10009277733	Main	\N	1000.00	1000.00	No	\N	\N	\N	\N	1000.00		\N	No	\N	\N	\N	3.00	\N		No			\N	\N	\N		active								2026-07-30 19:19:25	2026-07-30 19:38:37	2026-07-30 19:38:37
5	BNK1002	Commercial Bank of Ethiopia	CBE	10009277733	Main	\N	1000.00	1000.00	Yes	2026-07-30	2026-08-30	5000000.00	5000000.00	1000.00	5000000	Active	Yes	2026-07-30	2026-08-30	250000.00	3.00	250000.00	250000	Yes	2026-07-30	2026-08-10	10	\N	\N		active				Active				2026-07-30 19:39:35	2026-07-30 19:56:03	\N
\.


--
-- Data for Name: sales_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_category (id, category, type, status, created_at, updated_at, deleted_at) FROM stdin;
2	Electrical	Material	active	2026-08-02 20:12:46	2026-08-02 20:12:46	\N
1	Steel and Steel Item	Material	active	2026-08-02 20:12:13	2026-08-02 20:14:01	\N
3	Plumbing	supplier	active	2026-08-03 18:22:24	2026-08-03 18:22:24	\N
4	Other Category	Machine	active	2026-08-03 18:50:00	2026-08-03 19:31:47	\N
\.


--
-- Data for Name: sales_customer; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_customer (id, customer_no, customer_type, firstname, lastname, company_name, email_address, tin_number, contact_person, phone_number, customer_status, withhold, withhold_percent, location, withhold_from_advance, registered_by, registered_by_user_id, date_registered, created_at, updated_at, deleted_at) FROM stdin;
1	CUS000001	company	\N	\N	Hamusit Technology Plc	bin.get24@gmail.com	0068833071	Biniam Getnet	0912616124	active	t	3.00	Addis Ababa	t	System Administrator	1	2026-08-03	2026-08-03 19:22:36	2026-08-03 19:23:04	\N
\.


--
-- Data for Name: sales_fa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_fa (id, asset_no, vehicle_no, tag_no, plate_no, category_id, name_of_machinery, make_of_vehicle, model, make_of_year, chassis_no, engine_no, engine_model, make_of_engine, horse_power, type_of_fuel, reading_type, reading, consumption, standard_consumption, tanker_capacity, last_refill, has_gauge, gauge_reading, service_interval, last_service, purchase_date, licence_renewal_date, last_inspection_renewal_date, last_insurance_renewal_date, front_view_photo, rear_view_photo, right_side_view_photo, left_side_view_photo, libre_document, inspection_document, insurance_document, asset_condition, current_location, assigned_to, remarks, status, registered_by, registered_by_user_id, registered_date, edited_by, edited_by_user_id, created_at, updated_at, deleted_at) FROM stdin;
1	FA000001	1	KA0101	3-AA09889	4	Car	Toyota	MD093322	2010	123	124	MD099	Japan	12.00	Diesel	engine_horse_power	12.00	\N	\N	12.00	2026-08-03	t	1222.00	\N	\N	2026-08-01	\N	\N	\N	fixed-assets/photos/UBKMLZo2gQtJcvaHqBgJpLQmHgwWaarYZIqb9GaK.jpg	fixed-assets/photos/o1o4uAuSNlhVhc3QZZu5vFQl0xX9bEwz5XsEkNWb.jpg	fixed-assets/photos/2xUkSocCQjI3qef5afjSJvkh1jaZknDRyVX9dUpR.jpg	fixed-assets/photos/VUnz6sjOIhf1DTTVJYbFaovJ3KLVbxLbks3NRyRH.jpg	fixed-assets/documents/j0Fsj9DUbhjK7awKKy9Mb6yNghwjNSk0KePFOf1W.pdf	fixed-assets/documents/mxZMyBuaiADt21vM5OOSOyRfjVR3cItqw79mUwjC.pdf	fixed-assets/documents/7BSTCzBkAHuXVgYN9K7hZzxr2Pmv4eValI0sxzfc.pdf	good	\N	\N	\N	active	System Administrator	1	2026-08-03	\N	\N	2026-08-03 20:27:55	2026-08-03 20:27:55	\N
\.


--
-- Data for Name: sales_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_item (id, item_no, item_description, category, unit, status, product_date, type, inventory, registered_by, registered_by_user_id, date_registered, created_at, updated_at, deleted_at) FROM stdin;
1	ITM1001	Sand	Construction Materials	Kilogram	active	2026-08-01	Product	Stock	System Administrator	1	2026-08-01	2026-08-01 20:48:22	2026-08-01 20:49:18	\N
\.


--
-- Data for Name: sales_project; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_project (id, project_no, project_source, bid_reference, work_order_no, project_name, project_name_letter, project_description, location, customer_id, employer, has_consultant, consultant, has_specified_area, area, construction_project_type, status, registered_by, registered_by_user_id, date_registered, created_at, updated_at, deleted_at, business_unit, contract_type, contract_amount_before_vat, contract_pricing_type, contract_date, has_site_handover_date, site_handover_date, has_commencement_date, commencement_date, project_duration, duration_type, no_of_holidays, payment_term, has_advance_payment, advance_percent, has_advance_repayment, advance_repayment_complete_percent, advance_repayment_percent, advance_repayment_start, interim_payment_schedule, advance_payment_due_date, has_advance_bond, advance_bond_percent, advance_bond_type, advance_bond_start_date, advance_bond_end_date, has_performance_bond, performance_bond_percent, performance_bond_type, performance_bond_start_date, performance_bond_end_date, has_price_adjustment, price_adjustment_percent, has_retention, retention_percent, has_price_index, has_liquidity_damage, liquidity_percent, liquidity_limit, minimum_payment_time, engineering_facilities) FROM stdin;
\.


--
-- Data for Name: sales_purchaser; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_purchaser (id, purchaser_no, purchaser_name, status, registered_by, registered_by_user_id, date_registered, created_at, updated_at, deleted_at) FROM stdin;
1	PUR000001	Zerfu Bekele	active	System Administrator	1	2026-08-05	2026-08-05 20:20:16	2026-08-05 20:20:16	\N
3	PUR000002	Abebe Kebede	active	System Administrator	1	2026-08-08	2026-08-08 20:42:27	2026-08-08 20:42:27	\N
\.


--
-- Data for Name: sales_purchaser_account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_purchaser_account (id, purchaser_id, bank_id, account_number, account_name, currency, is_primary, status, registered_by, registered_by_user_id, date_registered, created_at, updated_at, deleted_at) FROM stdin;
2	1	5	10000121232312	\N	ETB	t	active	System Administrator	1	2026-08-05	2026-08-05 20:45:26	2026-08-05 20:46:02	2026-08-05 20:46:02
3	1	5	100096565656	Current	ETB	f	active	System Administrator	1	2026-08-05	2026-08-05 20:46:38	2026-08-05 20:53:01	\N
\.


--
-- Data for Name: sales_subcontractor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_subcontractor (id, type, firstname, lastname, company_name, tin_no, address, contact_person, phone_number, tax_percent, category_id, status, registered_by, registered_by_user_id, date_registered, created_at, updated_at, deleted_at) FROM stdin;
1	company	\N	\N	Hamusit Technology Plc	006883242	addis	Biniam Getnet	0912616124	15.00	1	active	System Administrator	1	2026-08-08	2026-08-08 20:21:47	2026-08-08 20:21:47	\N
\.


--
-- Data for Name: sales_supplier; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_supplier (id, supplier_no, supplier_name, category_id, address, phone_number, has_tin, tin, registered_by, registered_by_user_id, date_registered, status, approved_by, created_at, updated_at, deleted_at) FROM stdin;
2	SUP000002	Kassa and Sons Construction	4	Legetafo	0911009988	t	0068833071	System Administrator	1	2026-08-03	active	\N	2026-08-03 18:52:34	2026-08-03 18:52:50	2026-08-03 18:52:50
1	SUP000001	Kassa and Sons Construction	2	Legetafo	0911009988	t	0068833071	System Administrator	1	2026-08-03	active	\N	2026-08-03 18:50:45	2026-08-03 18:53:08	\N
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
xYmZ4I8EvCpMF1GRJ78QJtGmiu7nQVEFNoeh2JWK	\N	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	eyJfdG9rZW4iOiI1WHk0TUpNcVhqRTJPMGhNbjM2ZnRES0NvMVlNbzN5NmkwaElkM2JVIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9hcGlcL3VzZXIiLCJyb3V0ZSI6bnVsbH0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=	1786217760
OWDaiFLv5uKJ1UAa3TG5Uy6QJB9BbuHNsJUppywt	1	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	eyJfdG9rZW4iOiJWVlo2SmhLaERUczJvTFAxcFRNVGxxUTVTbXBMV1BETGRsZjNVU1dIIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9hcGlcL2FkbWluXC9wZXJtaXNzaW9ucz9wYWdlPTEmcGVyX3BhZ2U9MTAiLCJyb3V0ZSI6InBlcm1pc3Npb25zLmluZGV4In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsInBhc3N3b3JkX2hhc2hfd2ViIjoiMGE0NmNjY2NlYWFmOGJjZmZiYzg0OTk3NjcyMTMyZTBlOTAyZmNhZjk0OWU4NDM4ZGQwOGYwYzU5MTBhZGYyNyJ9	1786222211
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at, status) FROM stdin;
2	Biniam Getnet Zeleke	bin.get24@gmail.com	\N	$2y$12$SbpkpT6gTIo.PCnve7Vr6e9XEnVnmwWMSivMnwy0RZhNgNFLRFQz6	\N	2026-07-25 22:01:58	2026-07-25 22:03:39	active
3	Yidnekachew Negesse	yidnek@gmail.com	\N	$2y$12$OIbXu2MDtpzxYuAeR1318uSh4/LwhFrloFzK4kd5evENmLi5bFRL2	\N	2026-07-27 18:48:48	2026-07-27 18:48:48	active
1	System Administrator	admin@enterprise.test	\N	$2y$12$Q2rbAdKugwDgwrWEKdzRa..JXe3f2eJb7T/qANAF.6D9y5q0XKg3e	7BxnOrpwQeQCdQgXX5tiNCX543pSjxYWfczQ8SVSqtKD0lcRhHdnsUvTbCt6	2026-07-25 20:45:32	2026-07-25 21:31:42	active
\.


--
-- Name: activity_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_log_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 3, true);


--
-- Name: banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.banks_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_id_seq', 4, true);


--
-- Name: designations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.designations_id_seq', 3, true);


--
-- Name: erp_cheque_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.erp_cheque_id_seq', 1, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 31, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.permissions_id_seq', 19, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: sales_bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_bank_id_seq', 5, true);


--
-- Name: sales_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_category_id_seq', 4, true);


--
-- Name: sales_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_customer_id_seq', 1, true);


--
-- Name: sales_fa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_fa_id_seq', 1, true);


--
-- Name: sales_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_item_id_seq', 1, true);


--
-- Name: sales_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_project_id_seq', 1, false);


--
-- Name: sales_purchaser_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_purchaser_account_id_seq', 3, true);


--
-- Name: sales_purchaser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_purchaser_id_seq', 3, true);


--
-- Name: sales_subcontractor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_subcontractor_id_seq', 1, true);


--
-- Name: sales_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_supplier_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: activity_log activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_log
    ADD CONSTRAINT activity_log_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: banks banks_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_code_unique UNIQUE (code);


--
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: designations designations_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_code_unique UNIQUE (code);


--
-- Name: designations designations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_pkey PRIMARY KEY (id);


--
-- Name: erp_cheque erp_cheque_cheque_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque
    ADD CONSTRAINT erp_cheque_cheque_no_unique UNIQUE (cheque_no);


--
-- Name: erp_cheque erp_cheque_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque
    ADD CONSTRAINT erp_cheque_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: model_has_permissions model_has_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_permissions
    ADD CONSTRAINT model_has_permissions_pkey PRIMARY KEY (permission_id, model_id, model_type);


--
-- Name: model_has_roles model_has_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_roles
    ADD CONSTRAINT model_has_roles_pkey PRIMARY KEY (role_id, model_id, model_type);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: permissions permissions_name_guard_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_name_guard_name_unique UNIQUE (name, guard_name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: role_has_permissions role_has_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_pkey PRIMARY KEY (permission_id, role_id);


--
-- Name: roles roles_name_guard_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_guard_name_unique UNIQUE (name, guard_name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: sales_bank sales_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_bank
    ADD CONSTRAINT sales_bank_pkey PRIMARY KEY (id);


--
-- Name: sales_category sales_category_category_type_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_category
    ADD CONSTRAINT sales_category_category_type_unique UNIQUE (category, type);


--
-- Name: sales_category sales_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_category
    ADD CONSTRAINT sales_category_pkey PRIMARY KEY (id);


--
-- Name: sales_customer sales_customer_customer_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_customer
    ADD CONSTRAINT sales_customer_customer_no_unique UNIQUE (customer_no);


--
-- Name: sales_customer sales_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_customer
    ADD CONSTRAINT sales_customer_pkey PRIMARY KEY (id);


--
-- Name: sales_fa sales_fa_asset_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa
    ADD CONSTRAINT sales_fa_asset_no_unique UNIQUE (asset_no);


--
-- Name: sales_fa sales_fa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa
    ADD CONSTRAINT sales_fa_pkey PRIMARY KEY (id);


--
-- Name: sales_fa sales_fa_tag_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa
    ADD CONSTRAINT sales_fa_tag_no_unique UNIQUE (tag_no);


--
-- Name: sales_item sales_item_item_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_item
    ADD CONSTRAINT sales_item_item_no_unique UNIQUE (item_no);


--
-- Name: sales_item sales_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_item
    ADD CONSTRAINT sales_item_pkey PRIMARY KEY (id);


--
-- Name: sales_project sales_project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_project
    ADD CONSTRAINT sales_project_pkey PRIMARY KEY (id);


--
-- Name: sales_project sales_project_project_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_project
    ADD CONSTRAINT sales_project_project_no_unique UNIQUE (project_no);


--
-- Name: sales_purchaser_account sales_purchaser_account_bank_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser_account
    ADD CONSTRAINT sales_purchaser_account_bank_number_unique UNIQUE (bank_id, account_number);


--
-- Name: sales_purchaser_account sales_purchaser_account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser_account
    ADD CONSTRAINT sales_purchaser_account_pkey PRIMARY KEY (id);


--
-- Name: sales_purchaser sales_purchaser_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser
    ADD CONSTRAINT sales_purchaser_pkey PRIMARY KEY (id);


--
-- Name: sales_purchaser sales_purchaser_purchaser_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser
    ADD CONSTRAINT sales_purchaser_purchaser_no_unique UNIQUE (purchaser_no);


--
-- Name: sales_subcontractor sales_subcontractor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_subcontractor
    ADD CONSTRAINT sales_subcontractor_pkey PRIMARY KEY (id);


--
-- Name: sales_supplier sales_supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_supplier
    ADD CONSTRAINT sales_supplier_pkey PRIMARY KEY (id);


--
-- Name: sales_supplier sales_supplier_supplier_no_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_supplier
    ADD CONSTRAINT sales_supplier_supplier_no_unique UNIQUE (supplier_no);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activity_log_log_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_log_log_name_index ON public.activity_log USING btree (log_name);


--
-- Name: audit_logs_created_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_created_at_index ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_module_action_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_module_action_index ON public.audit_logs USING btree (module, action);


--
-- Name: audit_logs_record_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_record_id_index ON public.audit_logs USING btree (record_id);


--
-- Name: banks_account_number_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_account_number_index ON public.banks USING btree (account_number);


--
-- Name: banks_branch_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_branch_index ON public.banks USING btree (branch);


--
-- Name: banks_ethiopian_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_ethiopian_date_index ON public.banks USING btree (ethiopian_date);


--
-- Name: banks_gregorian_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_gregorian_date_index ON public.banks USING btree (gregorian_date);


--
-- Name: banks_loan_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_loan_status_index ON public.banks USING btree (loan_status);


--
-- Name: banks_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_name_index ON public.banks USING btree (name);


--
-- Name: banks_official_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_official_name_index ON public.banks USING btree (official_name);


--
-- Name: banks_overdraft_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_overdraft_status_index ON public.banks USING btree (overdraft_status);


--
-- Name: banks_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX banks_status_index ON public.banks USING btree (status);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: causer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX causer ON public.activity_log USING btree (causer_type, causer_id);


--
-- Name: departments_created_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX departments_created_at_index ON public.departments USING btree (created_at);


--
-- Name: departments_department_id_active_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_department_id_active_unique ON public.departments USING btree (department_id) WHERE (deleted_at IS NULL);


--
-- Name: departments_department_name_active_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX departments_department_name_active_unique ON public.departments USING btree (lower((department_name)::text)) WHERE (deleted_at IS NULL);


--
-- Name: departments_department_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX departments_department_name_index ON public.departments USING btree (department_name);


--
-- Name: departments_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX departments_status_index ON public.departments USING btree (status);


--
-- Name: designations_department_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX designations_department_id_index ON public.designations USING btree (department_id);


--
-- Name: designations_level_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX designations_level_index ON public.designations USING btree (level);


--
-- Name: designations_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX designations_name_index ON public.designations USING btree (name);


--
-- Name: designations_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX designations_status_index ON public.designations USING btree (status);


--
-- Name: erp_cheque_bank_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX erp_cheque_bank_id_status_index ON public.erp_cheque USING btree (bank_id, status);


--
-- Name: erp_cheque_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX erp_cheque_date_registered_index ON public.erp_cheque USING btree (date_registered);


--
-- Name: erp_cheque_is_used_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX erp_cheque_is_used_index ON public.erp_cheque USING btree (is_used);


--
-- Name: erp_cheque_signature_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX erp_cheque_signature_status_index ON public.erp_cheque USING btree (signature_status);


--
-- Name: erp_cheque_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX erp_cheque_status_index ON public.erp_cheque USING btree (status);


--
-- Name: erp_cheque_used_reference_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX erp_cheque_used_reference_id_index ON public.erp_cheque USING btree (used_reference_id);


--
-- Name: failed_jobs_connection_queue_failed_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX failed_jobs_connection_queue_failed_at_index ON public.failed_jobs USING btree (connection, queue, failed_at);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: model_has_permissions_model_id_model_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX model_has_permissions_model_id_model_type_index ON public.model_has_permissions USING btree (model_id, model_type);


--
-- Name: model_has_roles_model_id_model_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX model_has_roles_model_id_model_type_index ON public.model_has_roles USING btree (model_id, model_type);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sales_bank_account_no_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_bank_account_no_index ON public.sales_bank USING btree (account_no);


--
-- Name: sales_bank_bank_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_bank_bank_id_index ON public.sales_bank USING btree (bank_id);


--
-- Name: sales_bank_bank_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_bank_bank_name_index ON public.sales_bank USING btree (bank_name);


--
-- Name: sales_bank_loan_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_bank_loan_status_index ON public.sales_bank USING btree (loan_status);


--
-- Name: sales_bank_od_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_bank_od_status_index ON public.sales_bank USING btree (od_status);


--
-- Name: sales_bank_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_bank_status_index ON public.sales_bank USING btree (status);


--
-- Name: sales_category_category_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_category_category_index ON public.sales_category USING btree (category);


--
-- Name: sales_category_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_category_status_index ON public.sales_category USING btree (status);


--
-- Name: sales_category_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_category_type_index ON public.sales_category USING btree (type);


--
-- Name: sales_customer_company_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_company_name_index ON public.sales_customer USING btree (company_name);


--
-- Name: sales_customer_customer_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_customer_status_index ON public.sales_customer USING btree (customer_status);


--
-- Name: sales_customer_customer_type_customer_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_customer_type_customer_status_index ON public.sales_customer USING btree (customer_type, customer_status);


--
-- Name: sales_customer_customer_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_customer_type_index ON public.sales_customer USING btree (customer_type);


--
-- Name: sales_customer_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_date_registered_index ON public.sales_customer USING btree (date_registered);


--
-- Name: sales_customer_email_address_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_email_address_index ON public.sales_customer USING btree (email_address);


--
-- Name: sales_customer_phone_number_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_phone_number_index ON public.sales_customer USING btree (phone_number);


--
-- Name: sales_customer_tin_number_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_tin_number_index ON public.sales_customer USING btree (tin_number);


--
-- Name: sales_customer_withhold_withhold_from_advance_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_customer_withhold_withhold_from_advance_index ON public.sales_customer USING btree (withhold, withhold_from_advance);


--
-- Name: sales_fa_asset_condition_current_location_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_asset_condition_current_location_index ON public.sales_fa USING btree (asset_condition, current_location);


--
-- Name: sales_fa_asset_condition_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_asset_condition_index ON public.sales_fa USING btree (asset_condition);


--
-- Name: sales_fa_category_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_category_id_status_index ON public.sales_fa USING btree (category_id, status);


--
-- Name: sales_fa_chassis_no_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_chassis_no_index ON public.sales_fa USING btree (chassis_no);


--
-- Name: sales_fa_engine_no_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_engine_no_index ON public.sales_fa USING btree (engine_no);


--
-- Name: sales_fa_last_inspection_renewal_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_last_inspection_renewal_date_index ON public.sales_fa USING btree (last_inspection_renewal_date);


--
-- Name: sales_fa_last_insurance_renewal_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_last_insurance_renewal_date_index ON public.sales_fa USING btree (last_insurance_renewal_date);


--
-- Name: sales_fa_licence_renewal_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_licence_renewal_date_index ON public.sales_fa USING btree (licence_renewal_date);


--
-- Name: sales_fa_name_of_machinery_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_name_of_machinery_index ON public.sales_fa USING btree (name_of_machinery);


--
-- Name: sales_fa_plate_no_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_plate_no_index ON public.sales_fa USING btree (plate_no);


--
-- Name: sales_fa_purchase_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_purchase_date_index ON public.sales_fa USING btree (purchase_date);


--
-- Name: sales_fa_reading_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_reading_type_index ON public.sales_fa USING btree (reading_type);


--
-- Name: sales_fa_registered_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_registered_date_index ON public.sales_fa USING btree (registered_date);


--
-- Name: sales_fa_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_status_index ON public.sales_fa USING btree (status);


--
-- Name: sales_fa_type_of_fuel_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_type_of_fuel_index ON public.sales_fa USING btree (type_of_fuel);


--
-- Name: sales_fa_vehicle_no_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_fa_vehicle_no_index ON public.sales_fa USING btree (vehicle_no);


--
-- Name: sales_item_category_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_category_index ON public.sales_item USING btree (category);


--
-- Name: sales_item_category_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_category_status_index ON public.sales_item USING btree (category, status);


--
-- Name: sales_item_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_date_registered_index ON public.sales_item USING btree (date_registered);


--
-- Name: sales_item_inventory_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_inventory_index ON public.sales_item USING btree (inventory);


--
-- Name: sales_item_inventory_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_inventory_status_index ON public.sales_item USING btree (inventory, status);


--
-- Name: sales_item_product_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_product_date_index ON public.sales_item USING btree (product_date);


--
-- Name: sales_item_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_status_index ON public.sales_item USING btree (status);


--
-- Name: sales_item_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_type_index ON public.sales_item USING btree (type);


--
-- Name: sales_item_type_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_type_status_index ON public.sales_item USING btree (type, status);


--
-- Name: sales_item_unit_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_item_unit_index ON public.sales_item USING btree (unit);


--
-- Name: sales_project_bid_reference_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_bid_reference_index ON public.sales_project USING btree (bid_reference);


--
-- Name: sales_project_business_unit_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_business_unit_index ON public.sales_project USING btree (business_unit);


--
-- Name: sales_project_construction_project_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_construction_project_type_index ON public.sales_project USING btree (construction_project_type);


--
-- Name: sales_project_construction_project_type_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_construction_project_type_status_index ON public.sales_project USING btree (construction_project_type, status);


--
-- Name: sales_project_contract_date_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_contract_date_index ON public.sales_project USING btree (contract_date);


--
-- Name: sales_project_contract_pricing_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_contract_pricing_type_index ON public.sales_project USING btree (contract_pricing_type);


--
-- Name: sales_project_contract_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_contract_type_index ON public.sales_project USING btree (contract_type);


--
-- Name: sales_project_customer_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_customer_id_index ON public.sales_project USING btree (customer_id);


--
-- Name: sales_project_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_date_registered_index ON public.sales_project USING btree (date_registered);


--
-- Name: sales_project_duration_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_duration_type_index ON public.sales_project USING btree (duration_type);


--
-- Name: sales_project_payment_term_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_payment_term_index ON public.sales_project USING btree (payment_term);


--
-- Name: sales_project_project_source_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_project_source_index ON public.sales_project USING btree (project_source);


--
-- Name: sales_project_project_source_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_project_source_status_index ON public.sales_project USING btree (project_source, status);


--
-- Name: sales_project_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_status_index ON public.sales_project USING btree (status);


--
-- Name: sales_project_work_order_no_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_project_work_order_no_index ON public.sales_project USING btree (work_order_no);


--
-- Name: sales_purchaser_account_account_number_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_account_account_number_index ON public.sales_purchaser_account USING btree (account_number);


--
-- Name: sales_purchaser_account_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_account_date_registered_index ON public.sales_purchaser_account USING btree (date_registered);


--
-- Name: sales_purchaser_account_is_primary_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_account_is_primary_index ON public.sales_purchaser_account USING btree (is_primary);


--
-- Name: sales_purchaser_account_purchaser_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_account_purchaser_id_status_index ON public.sales_purchaser_account USING btree (purchaser_id, status);


--
-- Name: sales_purchaser_account_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_account_status_index ON public.sales_purchaser_account USING btree (status);


--
-- Name: sales_purchaser_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_date_registered_index ON public.sales_purchaser USING btree (date_registered);


--
-- Name: sales_purchaser_purchaser_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_purchaser_name_index ON public.sales_purchaser USING btree (purchaser_name);


--
-- Name: sales_purchaser_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_purchaser_status_index ON public.sales_purchaser USING btree (status);


--
-- Name: sales_subcontractor_category_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_subcontractor_category_id_status_index ON public.sales_subcontractor USING btree (category_id, status);


--
-- Name: sales_subcontractor_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_subcontractor_date_registered_index ON public.sales_subcontractor USING btree (date_registered);


--
-- Name: sales_subcontractor_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_subcontractor_status_index ON public.sales_subcontractor USING btree (status);


--
-- Name: sales_subcontractor_type_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_subcontractor_type_index ON public.sales_subcontractor USING btree (type);


--
-- Name: sales_subcontractor_type_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_subcontractor_type_status_index ON public.sales_subcontractor USING btree (type, status);


--
-- Name: sales_supplier_category_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_supplier_category_id_status_index ON public.sales_supplier USING btree (category_id, status);


--
-- Name: sales_supplier_date_registered_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_supplier_date_registered_index ON public.sales_supplier USING btree (date_registered);


--
-- Name: sales_supplier_phone_number_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_supplier_phone_number_index ON public.sales_supplier USING btree (phone_number);


--
-- Name: sales_supplier_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_supplier_status_index ON public.sales_supplier USING btree (status);


--
-- Name: sales_supplier_supplier_name_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_supplier_supplier_name_index ON public.sales_supplier USING btree (supplier_name);


--
-- Name: sales_supplier_tin_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sales_supplier_tin_index ON public.sales_supplier USING btree (tin);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: subject; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subject ON public.activity_log USING btree (subject_type, subject_id);


--
-- Name: uq_designations_name_lower; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_designations_name_lower ON public.designations USING btree (lower((name)::text)) WHERE (deleted_at IS NULL);


--
-- Name: users_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_status_index ON public.users USING btree (status);


--
-- Name: audit_logs audit_logs_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: departments departments_registered_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_registered_by_foreign FOREIGN KEY (registered_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: designations designations_department_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.designations
    ADD CONSTRAINT designations_department_id_foreign FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: erp_cheque erp_cheque_active_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque
    ADD CONSTRAINT erp_cheque_active_by_user_id_foreign FOREIGN KEY (active_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: erp_cheque erp_cheque_bank_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque
    ADD CONSTRAINT erp_cheque_bank_fk FOREIGN KEY (bank_id) REFERENCES public.sales_bank(id) ON DELETE RESTRICT;


--
-- Name: erp_cheque erp_cheque_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque
    ADD CONSTRAINT erp_cheque_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: erp_cheque erp_cheque_void_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.erp_cheque
    ADD CONSTRAINT erp_cheque_void_by_user_id_foreign FOREIGN KEY (void_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: model_has_permissions model_has_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_permissions
    ADD CONSTRAINT model_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: model_has_roles model_has_roles_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.model_has_roles
    ADD CONSTRAINT model_has_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: role_has_permissions role_has_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_has_permissions role_has_permissions_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_has_permissions
    ADD CONSTRAINT role_has_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: sales_customer sales_customer_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_customer
    ADD CONSTRAINT sales_customer_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_fa sales_fa_category_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa
    ADD CONSTRAINT sales_fa_category_fk FOREIGN KEY (category_id) REFERENCES public.sales_category(id) ON DELETE RESTRICT;


--
-- Name: sales_fa sales_fa_edited_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa
    ADD CONSTRAINT sales_fa_edited_by_user_id_foreign FOREIGN KEY (edited_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_fa sales_fa_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_fa
    ADD CONSTRAINT sales_fa_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_item sales_item_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_item
    ADD CONSTRAINT sales_item_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_project sales_project_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_project
    ADD CONSTRAINT sales_project_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_purchaser_account sales_purchaser_account_bank_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser_account
    ADD CONSTRAINT sales_purchaser_account_bank_id_foreign FOREIGN KEY (bank_id) REFERENCES public.sales_bank(id) ON DELETE RESTRICT;


--
-- Name: sales_purchaser_account sales_purchaser_account_purchaser_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser_account
    ADD CONSTRAINT sales_purchaser_account_purchaser_fk FOREIGN KEY (purchaser_id) REFERENCES public.sales_purchaser(id) ON DELETE CASCADE;


--
-- Name: sales_purchaser_account sales_purchaser_account_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser_account
    ADD CONSTRAINT sales_purchaser_account_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_purchaser sales_purchaser_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_purchaser
    ADD CONSTRAINT sales_purchaser_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_subcontractor sales_subcontractor_category_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_subcontractor
    ADD CONSTRAINT sales_subcontractor_category_fk FOREIGN KEY (category_id) REFERENCES public.sales_category(id) ON DELETE RESTRICT;


--
-- Name: sales_subcontractor sales_subcontractor_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_subcontractor
    ADD CONSTRAINT sales_subcontractor_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: sales_supplier sales_supplier_category_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_supplier
    ADD CONSTRAINT sales_supplier_category_fk FOREIGN KEY (category_id) REFERENCES public.sales_category(id) ON DELETE RESTRICT;


--
-- Name: sales_supplier sales_supplier_registered_by_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_supplier
    ADD CONSTRAINT sales_supplier_registered_by_user_id_foreign FOREIGN KEY (registered_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict bSXTnHwLvK8AbB55bKIUwb342stcIyyHVYQbPRzNdBut7zA4AeEmOPS8gjabg9c

