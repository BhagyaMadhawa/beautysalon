--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Postgres.app)
-- Dumped by pg_dump version 17.5 (Postgres.app)

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

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: certifications; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.certifications (
    id integer NOT NULL,
    salon_id integer,
    certificate_name character varying(255),
    issue_date date,
    certificate_id character varying(100),
    certificate_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.certifications OWNER TO bhagyaranasinghe;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certifications_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    salon_id integer,
    question text,
    answer text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.faqs OWNER TO bhagyaranasinghe;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: opening_hours; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.opening_hours (
    id integer NOT NULL,
    salon_id integer,
    day_of_week character varying(10),
    is_opened boolean DEFAULT true,
    start_time time without time zone,
    end_time time without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.opening_hours OWNER TO bhagyaranasinghe;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.opening_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.opening_hours_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.opening_hours_id_seq OWNED BY public.opening_hours.id;


--
-- Name: portfolio_images; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.portfolio_images (
    id integer NOT NULL,
    portfolio_id integer,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.portfolio_images OWNER TO bhagyaranasinghe;

--
-- Name: portfolio_images_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.portfolio_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_images_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: portfolio_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.portfolio_images_id_seq OWNED BY public.portfolio_images.id;


--
-- Name: portfolios; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.portfolios (
    id integer NOT NULL,
    salon_id integer,
    album_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.portfolios OWNER TO bhagyaranasinghe;

--
-- Name: portfolios_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolios_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: portfolios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.portfolios_id_seq OWNED BY public.portfolios.id;


--
-- Name: salon_addresses; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.salon_addresses (
    id integer NOT NULL,
    salon_id integer,
    country character varying(100),
    city character varying(100),
    postcode character varying(20),
    full_address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.salon_addresses OWNER TO bhagyaranasinghe;

--
-- Name: salon_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.salon_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salon_addresses_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: salon_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.salon_addresses_id_seq OWNED BY public.salon_addresses.id;


--
-- Name: salons; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.salons (
    id integer NOT NULL,
    user_id integer,
    name character varying(255),
    email character varying(255),
    phone character varying(20),
    description text,
    type character varying(50),
    profile_image_url text,
    is_approved boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1,
    registration_step integer DEFAULT 0,
    CONSTRAINT salons_type_check CHECK (((type)::text = ANY ((ARRAY['salon_owner'::character varying, 'beauty_professional'::character varying])::text[])))
);


ALTER TABLE public.salons OWNER TO bhagyaranasinghe;

--
-- Name: salons_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.salons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salons_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: salons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.salons_id_seq OWNED BY public.salons.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.services (
    id integer NOT NULL,
    salon_id integer,
    name character varying(255),
    duration integer,
    price numeric(10,2),
    discounted_price numeric(10,2),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.services OWNER TO bhagyaranasinghe;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: social_links; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.social_links (
    id integer NOT NULL,
    salon_id integer,
    platform character varying(50),
    url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.social_links OWNER TO bhagyaranasinghe;

--
-- Name: social_links_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_links_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: social_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.social_links_id_seq OWNED BY public.social_links.id;


--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.user_addresses (
    id integer NOT NULL,
    user_id integer,
    country character varying(100),
    city character varying(100),
    postcode character varying(20),
    full_address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.user_addresses OWNER TO bhagyaranasinghe;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.user_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_addresses_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.user_addresses_id_seq OWNED BY public.user_addresses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: bhagyaranasinghe
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email public.citext NOT NULL,
    password character varying(255),
    login_type character varying(20),
    role character varying(50) NOT NULL,
    profile_image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1,
    registration_step integer DEFAULT 0,
    approval_status character varying(20) DEFAULT 'approved'::character varying,
    approval_message text,
    requesting_role character varying(50) DEFAULT 'client'::character varying NOT NULL,
    CONSTRAINT users_requesting_role_check CHECK (((requesting_role)::text = ANY ((ARRAY['client'::character varying, 'professional'::character varying, 'admin'::character varying, 'owner'::character varying])::text[]))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['client'::character varying, 'professional'::character varying, 'admin'::character varying, 'owner'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO bhagyaranasinghe;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: bhagyaranasinghe
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO bhagyaranasinghe;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bhagyaranasinghe
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: opening_hours id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.opening_hours ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_id_seq'::regclass);


--
-- Name: portfolio_images id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.portfolio_images ALTER COLUMN id SET DEFAULT nextval('public.portfolio_images_id_seq'::regclass);


--
-- Name: portfolios id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.portfolios ALTER COLUMN id SET DEFAULT nextval('public.portfolios_id_seq'::regclass);


--
-- Name: salon_addresses id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.salon_addresses ALTER COLUMN id SET DEFAULT nextval('public.salon_addresses_id_seq'::regclass);


--
-- Name: salons id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.salons ALTER COLUMN id SET DEFAULT nextval('public.salons_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: social_links id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.social_links ALTER COLUMN id SET DEFAULT nextval('public.social_links_id_seq'::regclass);


--
-- Name: user_addresses id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.user_addresses ALTER COLUMN id SET DEFAULT nextval('public.user_addresses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.certifications (id, salon_id, certificate_name, issue_date, certificate_id, certificate_url, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.faqs (id, salon_id, question, answer, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: opening_hours; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.opening_hours (id, salon_id, day_of_week, is_opened, start_time, end_time, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: portfolio_images; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.portfolio_images (id, portfolio_id, image_url, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: portfolios; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.portfolios (id, salon_id, album_name, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: salon_addresses; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.salon_addresses (id, salon_id, country, city, postcode, full_address, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: salons; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.salons (id, user_id, name, email, phone, description, type, profile_image_url, is_approved, created_at, updated_at, status, registration_step) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.services (id, salon_id, name, duration, price, discounted_price, description, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: social_links; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.social_links (id, salon_id, platform, url, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.user_addresses (id, user_id, country, city, postcode, full_address, created_at, updated_at, status) FROM stdin;
1	1	uk	asdasd	asdasdasd	asdasdasfgdfsafasd	2025-07-26 23:37:27.103463	2025-07-26 23:37:27.103463	1
2	4	GB	asd	asd	asd	2025-08-18 04:29:20.735851	2025-08-18 04:29:20.735851	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bhagyaranasinghe
--

COPY public.users (id, first_name, last_name, email, password, login_type, role, profile_image_url, created_at, updated_at, status, registration_step, approval_status, approval_message, requesting_role) FROM stdin;
1	Bhagya	Ranasinghe	bhagya@mail.com	$2b$10$60/6k6O0ISdMw92tgVUR5.rqlhxs4TkdmfkwGuDWMfnf/12Dx5DE2	email	client	\N	2025-07-26 23:37:27.08779	2025-07-26 23:37:27.08779	1	0	approved	\N	client
4	Mad	Ranasinghe	mad@gmail.com	$2b$10$mEfmca/EOmlTM62ECYrgaOFvipX2FqrhEA6Qpwh4P16F6LrBj7igW	email	professional	\N	2025-08-18 04:29:20.735851	2025-08-18 04:29:20.735851	1	0	pending	\N	professional
\.


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.certifications_id_seq', 1, false);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.faqs_id_seq', 1, false);


--
-- Name: opening_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.opening_hours_id_seq', 1, false);


--
-- Name: portfolio_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.portfolio_images_id_seq', 1, false);


--
-- Name: portfolios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.portfolios_id_seq', 1, false);


--
-- Name: salon_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.salon_addresses_id_seq', 1, false);


--
-- Name: salons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.salons_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.services_id_seq', 1, false);


--
-- Name: social_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.social_links_id_seq', 1, false);


--
-- Name: user_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.user_addresses_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bhagyaranasinghe
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: opening_hours opening_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);


--
-- Name: portfolio_images portfolio_images_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.portfolio_images
    ADD CONSTRAINT portfolio_images_pkey PRIMARY KEY (id);


--
-- Name: portfolios portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);


--
-- Name: salon_addresses salon_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.salon_addresses
    ADD CONSTRAINT salon_addresses_pkey PRIMARY KEY (id);


--
-- Name: salons salons_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.salons
    ADD CONSTRAINT salons_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: faqs faqs_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: opening_hours opening_hours_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: portfolio_images portfolio_images_portfolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.portfolio_images
    ADD CONSTRAINT portfolio_images_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id);


--
-- Name: portfolios portfolios_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: salon_addresses salon_addresses_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.salon_addresses
    ADD CONSTRAINT salon_addresses_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id) ON DELETE CASCADE;


--
-- Name: salons salons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.salons
    ADD CONSTRAINT salons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: services services_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: social_links social_links_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bhagyaranasinghe
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

