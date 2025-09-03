--
-- PostgreSQL database dump
--

\restrict sWMBY4jSU7IwNt6a89dfMsRCUnzaT80FDb1C8cpffzLOyCCQZqHDeUIeiwhmqCX

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Name: category_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category_ratings (
    id integer NOT NULL,
    review_id integer,
    category_id integer,
    rating numeric(2,1) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1,
    CONSTRAINT category_ratings_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.category_ratings OWNER TO postgres;

--
-- Name: category_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_ratings_id_seq OWNER TO postgres;

--
-- Name: category_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_ratings_id_seq OWNED BY public.category_ratings.id;


--
-- Name: certifications; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.certifications OWNER TO postgres;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certifications_id_seq OWNER TO postgres;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: opening_hours; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.opening_hours OWNER TO postgres;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.opening_hours_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.opening_hours_id_seq OWNER TO postgres;

--
-- Name: opening_hours_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.opening_hours_id_seq OWNED BY public.opening_hours.id;


--
-- Name: portfolio_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_images (
    id integer NOT NULL,
    portfolio_id integer,
    image_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.portfolio_images OWNER TO postgres;

--
-- Name: portfolio_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolio_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_images_id_seq OWNER TO postgres;

--
-- Name: portfolio_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolio_images_id_seq OWNED BY public.portfolio_images.id;


--
-- Name: portfolios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolios (
    id integer NOT NULL,
    salon_id integer,
    album_name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.portfolios OWNER TO postgres;

--
-- Name: portfolios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolios_id_seq OWNER TO postgres;

--
-- Name: portfolios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolios_id_seq OWNED BY public.portfolios.id;


--
-- Name: rating_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.rating_categories OWNER TO postgres;

--
-- Name: rating_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_categories_id_seq OWNER TO postgres;

--
-- Name: rating_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_categories_id_seq OWNED BY public.rating_categories.id;


--
-- Name: review_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_images (
    id integer NOT NULL,
    review_id integer,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.review_images OWNER TO postgres;

--
-- Name: review_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.review_images_id_seq OWNER TO postgres;

--
-- Name: review_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_images_id_seq OWNED BY public.review_images.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    salon_id integer,
    user_id integer,
    rating numeric(2,1) NOT NULL,
    review_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1,
    CONSTRAINT reviews_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: salon_addresses; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.salon_addresses OWNER TO postgres;

--
-- Name: salon_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salon_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salon_addresses_id_seq OWNER TO postgres;

--
-- Name: salon_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salon_addresses_id_seq OWNED BY public.salon_addresses.id;


--
-- Name: salon_gallery; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salon_gallery (
    id integer NOT NULL,
    salon_id integer,
    photo_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.salon_gallery OWNER TO postgres;

--
-- Name: salon_gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salon_gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salon_gallery_id_seq OWNER TO postgres;

--
-- Name: salon_gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salon_gallery_id_seq OWNED BY public.salon_gallery.id;


--
-- Name: salons; Type: TABLE; Schema: public; Owner: postgres
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
    average_rating numeric(3,2) DEFAULT 0.00,
    total_reviews integer DEFAULT 0,
    CONSTRAINT salons_type_check CHECK (((type)::text = ANY ((ARRAY['salon_owner'::character varying, 'beauty_professional'::character varying])::text[])))
);


ALTER TABLE public.salons OWNER TO postgres;

--
-- Name: salons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salons_id_seq OWNER TO postgres;

--
-- Name: salons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salons_id_seq OWNED BY public.salons.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    salon_id integer,
    name character varying(255),
    duration text,
    price numeric(10,2),
    discounted_price numeric(10,2),
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: social_links; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.social_links OWNER TO postgres;

--
-- Name: social_links_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_links_id_seq OWNER TO postgres;

--
-- Name: social_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_links_id_seq OWNED BY public.social_links.id;


--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_addresses_id_seq OWNER TO postgres;

--
-- Name: user_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_addresses_id_seq OWNED BY public.user_addresses.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    email character varying(255) NOT NULL,
    password character varying(255),
    login_type character varying(20),
    requesting_role character varying(50) NOT NULL,
    role character varying(50) NOT NULL,
    profile_image_url text,
    registration_step integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status smallint DEFAULT 1,
    approval_status character varying(20) DEFAULT 'approved'::character varying,
    approval_message text,
    CONSTRAINT users_requesting_role_check CHECK (((requesting_role)::text = ANY ((ARRAY['client'::character varying, 'professional'::character varying, 'admin'::character varying, 'owner'::character varying])::text[]))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['client'::character varying, 'professional'::character varying, 'admin'::character varying, 'owner'::character varying, 'pending'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: category_ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_ratings ALTER COLUMN id SET DEFAULT nextval('public.category_ratings_id_seq'::regclass);


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: opening_hours id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours ALTER COLUMN id SET DEFAULT nextval('public.opening_hours_id_seq'::regclass);


--
-- Name: portfolio_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_images ALTER COLUMN id SET DEFAULT nextval('public.portfolio_images_id_seq'::regclass);


--
-- Name: portfolios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios ALTER COLUMN id SET DEFAULT nextval('public.portfolios_id_seq'::regclass);


--
-- Name: rating_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_categories ALTER COLUMN id SET DEFAULT nextval('public.rating_categories_id_seq'::regclass);


--
-- Name: review_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images ALTER COLUMN id SET DEFAULT nextval('public.review_images_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: salon_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salon_addresses ALTER COLUMN id SET DEFAULT nextval('public.salon_addresses_id_seq'::regclass);


--
-- Name: salon_gallery id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salon_gallery ALTER COLUMN id SET DEFAULT nextval('public.salon_gallery_id_seq'::regclass);


--
-- Name: salons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salons ALTER COLUMN id SET DEFAULT nextval('public.salons_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: social_links id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links ALTER COLUMN id SET DEFAULT nextval('public.social_links_id_seq'::regclass);


--
-- Name: user_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses ALTER COLUMN id SET DEFAULT nextval('public.user_addresses_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: category_ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category_ratings (id, review_id, category_id, rating, created_at, status) FROM stdin;
\.


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certifications (id, salon_id, certificate_name, issue_date, certificate_id, certificate_url, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, salon_id, question, answer, created_at, updated_at, status) FROM stdin;
1	1	ghhjj	lklk	2025-08-25 14:13:45.231303	2025-08-25 14:13:45.231303	1
2	1	kjnjjkj	kjbkjb	2025-08-25 14:13:45.242526	2025-08-25 14:13:45.242526	1
3	2	the latest da kmmmm	slkdmlkmlkmdfk	2025-08-27 09:26:01.232942	2025-08-27 09:26:01.232942	1
4	2	ajfnvklsnflvknslknvslknv	lfdkmlbvksbnlsknb	2025-08-27 09:26:01.240715	2025-08-27 09:26:01.240715	1
\.


--
-- Data for Name: opening_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.opening_hours (id, salon_id, day_of_week, is_opened, start_time, end_time, created_at, updated_at, status) FROM stdin;
1	1	Monday	t	09:00:00	17:00:00	2025-08-25 14:12:31.944991	2025-08-25 14:12:31.944991	1
2	1	Tuesday	t	09:00:00	17:00:00	2025-08-25 14:12:31.956998	2025-08-25 14:12:31.956998	1
3	1	Wednesday	t	09:00:00	17:00:00	2025-08-25 14:12:31.958421	2025-08-25 14:12:31.958421	1
4	1	Thursday	t	09:00:00	17:00:00	2025-08-25 14:12:31.959834	2025-08-25 14:12:31.959834	1
5	1	Friday	t	09:00:00	17:00:00	2025-08-25 14:12:31.960898	2025-08-25 14:12:31.960898	1
6	1	Saturday	t	09:00:00	17:00:00	2025-08-25 14:12:31.961811	2025-08-25 14:12:31.961811	1
7	1	Sunday	t	09:00:00	17:00:00	2025-08-25 14:12:31.964147	2025-08-25 14:12:31.964147	1
8	2	Monday	t	09:00:00	17:00:00	2025-08-27 09:25:37.054827	2025-08-27 09:25:37.054827	1
9	2	Tuesday	t	09:00:00	17:00:00	2025-08-27 09:25:37.082313	2025-08-27 09:25:37.082313	1
10	2	Wednesday	t	09:00:00	17:00:00	2025-08-27 09:25:37.083882	2025-08-27 09:25:37.083882	1
11	2	Thursday	t	09:00:00	17:00:00	2025-08-27 09:25:37.085161	2025-08-27 09:25:37.085161	1
12	2	Friday	t	09:00:00	17:00:00	2025-08-27 09:25:37.086499	2025-08-27 09:25:37.086499	1
13	2	Saturday	f	09:00:00	17:00:00	2025-08-27 09:25:37.08901	2025-08-27 09:25:37.08901	1
14	2	Sunday	f	09:00:00	17:00:00	2025-08-27 09:25:37.090275	2025-08-27 09:25:37.090275	1
\.


--
-- Data for Name: portfolio_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_images (id, portfolio_id, image_url, created_at, updated_at, status) FROM stdin;
1	1	/uploads/profile_images/image_1756103879958.jpg	2025-08-25 12:08:00.385009	2025-08-25 12:08:00.385009	1
2	1	/uploads/profile_images/image_1756103880194.svg	2025-08-25 12:08:00.389426	2025-08-25 12:08:00.389426	1
3	1	/uploads/profile_images/image_1756103880209.svg	2025-08-25 12:08:00.390321	2025-08-25 12:08:00.390321	1
4	1	/uploads/profile_images/image_1756103880223.svg	2025-08-25 12:08:00.392297	2025-08-25 12:08:00.392297	1
5	2	/uploads/image_1756266804768.png	2025-08-27 09:23:25.064191	2025-08-27 09:23:25.064191	1
6	2	/uploads/image_1756266804884.png	2025-08-27 09:23:25.070663	2025-08-27 09:23:25.070663	1
7	3	/uploads/image_1756266804912.png	2025-08-27 09:23:25.074163	2025-08-27 09:23:25.074163	1
8	3	/uploads/image_1756266804945.png	2025-08-27 09:23:25.075839	2025-08-27 09:23:25.075839	1
\.


--
-- Data for Name: portfolios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolios (id, salon_id, album_name, created_at, updated_at, status) FROM stdin;
1	1	Classic lash extensions	2025-08-25 12:08:00.357475	2025-08-25 12:08:00.357475	1
2	2	AlbumA	2025-08-27 09:23:25.052306	2025-08-27 09:23:25.052306	1
3	2	Album B	2025-08-27 09:23:25.07239	2025-08-27 09:23:25.07239	1
\.


--
-- Data for Name: rating_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rating_categories (id, name, description, created_at, status) FROM stdin;
1	Supplier Service	Quality of service provided by the supplier	2025-08-23 19:28:05.44231	1
2	On-time Service	Punctuality and timeliness of service	2025-08-23 19:28:05.44231	1
3	Service Quality	Overall quality of the service provided	2025-08-23 19:28:05.44231	1
\.


--
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_images (id, review_id, image_url, created_at, status) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, salon_id, user_id, rating, review_text, created_at, updated_at, status) FROM stdin;
1	2	1	5.0	hi	2025-08-27 11:36:13.613515	2025-08-27 11:36:13.613515	1
\.


--
-- Data for Name: salon_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salon_addresses (id, salon_id, country, city, postcode, full_address, created_at, updated_at, status) FROM stdin;
1	1	us	welimada	90216	Ramalankawa, nugathalawa	2025-08-25 11:02:12.900829	2025-08-25 11:02:12.900829	1
2	2	us	welimada	90216	Ramalankawa, nugathalawa	2025-08-27 09:21:39.071329	2025-08-27 09:21:39.071329	1
\.


--
-- Data for Name: salon_gallery; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salon_gallery (id, salon_id, photo_url, created_at, updated_at, status) FROM stdin;
\.


--
-- Data for Name: salons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salons (id, user_id, name, email, phone, description, type, profile_image_url, is_approved, created_at, updated_at, status, registration_step, average_rating, total_reviews) FROM stdin;
1	8	Salon A	salona@gmail.com	0711998184	trhis is salon A	\N	\N	f	2025-08-25 11:02:12.842106	2025-08-25 11:02:12.842106	1	5	0.00	0
2	19	SalonA	salona@gmail.com	0711998184	This is a Salon A	\N	\N	f	2025-08-27 09:21:39.029688	2025-08-27 11:36:13.613515	1	5	5.00	1
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, salon_id, name, duration, price, discounted_price, description, created_at, updated_at, status) FROM stdin;
1	1	service	30 min	5.00	4.00	advise	2025-08-25 14:09:42.409049	2025-08-25 14:09:42.409049	1
2	1	service5	30 min	5.00	4.00	df	2025-08-25 14:09:42.431789	2025-08-25 14:09:42.431789	1
3	2	ServiceA	30 min	4.00	3.00	Service number 2	2025-08-27 09:25:33.910396	2025-08-27 09:25:33.910396	1
4	2	Service 2	30 min	5.00	4.60	service number 3	2025-08-27 09:25:33.922077	2025-08-27 09:25:33.922077	1
\.


--
-- Data for Name: social_links; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_links (id, salon_id, platform, url, created_at, updated_at, status) FROM stdin;
1	1	facebook	https://docs.google.com/document/u/0/	2025-08-25 11:02:12.907097	2025-08-25 11:02:12.907097	1
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, user_id, country, city, postcode, full_address, created_at, updated_at, status) FROM stdin;
1	1	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-23 20:11:47.94135	2025-08-23 20:11:47.94135	1
2	4	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-25 08:14:17.713927	2025-08-25 08:14:17.713927	1
3	8	us	welimada	90216	Ramalankawa, nugathalawa	2025-08-25 09:03:47.554662	2025-08-25 09:03:47.554662	1
4	9	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-25 23:11:27.971165	2025-08-25 23:11:27.971165	1
5	10	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-25 23:22:48.691674	2025-08-25 23:22:48.691674	1
6	11	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 08:16:33.060391	2025-08-26 08:16:33.060391	1
7	12	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 10:19:12.73835	2025-08-26 10:19:12.73835	1
8	13	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 11:11:06.178018	2025-08-26 11:11:06.178018	1
9	14	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 11:14:06.209159	2025-08-26 11:14:06.209159	1
10	15	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 11:15:46.352301	2025-08-26 11:15:46.352301	1
11	16	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 11:26:54.781446	2025-08-26 11:26:54.781446	1
12	17	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 11:28:02.277109	2025-08-26 11:28:02.277109	1
13	18	US	welimada	90216	Ramalankawa, nugathalawa	2025-08-26 11:38:21.973006	2025-08-26 11:38:21.973006	1
14	19	us	welimada	90216	Ramalankawa, nugathalawa	2025-08-27 09:11:53.978392	2025-08-27 09:11:53.978392	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, login_type, requesting_role, role, profile_image_url, registration_step, created_at, updated_at, status, approval_status, approval_message) FROM stdin;
1	Akila	Piyumantha	akila7976ap@gmail.com	$2b$10$F2UWgoycUsIEXehNFmChFeRXi5/qdq4cIntO/ZnazzVSRti60zE8q	email	client	client	\N	0	2025-08-23 20:11:47.94135	2025-08-23 20:11:47.94135	1	approved	\N
4	Akila	-	akila79761ap@gmail.com	$2b$10$dhzyh31BM6QMubT9l9ZUIeUOCuhGQdT2o2tlRQAmr/vsm5Ukd2pZm	email	client	client	\N	0	2025-08-25 08:14:17.713927	2025-08-25 08:14:17.713927	1	approved	\N
8	Akila	-	akila79762ap@gmail.com	123456789	email	owner	pending	/uploads/profile_images/image_1756092827432.png	1	2025-08-25 09:03:47.548624	2025-08-25 09:03:47.548624	1	approved	\N
9	Akila	r	akila797f6ap@gmail.com	$2b$10$KbKE2S9.3sGeiOnj3vq09.IVXGZmASd4qatq1qist6LXp1v.xJvLK	email	client	client	\N	0	2025-08-25 23:11:27.971165	2025-08-25 23:11:27.971165	1	approved	\N
10	Akila	-	akila7976ap10@gmail.com	$2b$10$vHEpmax7jWj0.W2UUIKKI.ri4s87FCz9pxnPgPj1dx4AAZeJdzWDK	email	client	admin	/uploads/profile_images/image_1756144368544.png	0	2025-08-25 23:22:48.691674	2025-08-25 23:22:48.691674	1	approved	\N
11	Akila	-	akila@gmail.com	$2b$10$vKOjxbvee6RC.wS2lnKl7OSzrhdX6wsWgtM4eF5sQmsgRNzDXJe6W	email	client	admin	\N	0	2025-08-26 08:16:33.060391	2025-08-26 08:16:33.060391	1	approved	\N
12	Akila	-	akila1@gmail.com	$2b$10$1kXolVCLv2Del/N0g9Kq.e9f5BdwvB71DJhGOuz5r9VwpjavkBu8u	email	client	admin	/uploads/profile_images/image_1756183752661.png	0	2025-08-26 10:19:12.73835	2025-08-26 10:19:12.73835	1	approved	\N
13	admin	-	admin@gmail.com	$2b$10$Mtvy68vG76n4IX1wdsqFfe8mS.EkqqxWTSALtHU8HG947ImUXBPPK	email	client	admin	\N	0	2025-08-26 11:11:06.178018	2025-08-26 11:11:06.178018	1	approved	\N
14	Admin	-	Admin@gmail.com	$2b$10$lWMWdmzPJUknVfLXTQFTSexvqzZnzEvRZGY/AvBSoZoK81vDRyszO	email	client	admin	/uploads/image_1756187046033.png	0	2025-08-26 11:14:06.209159	2025-08-26 11:14:06.209159	1	approved	\N
15	Admin	a	admin1@gmail.com	$2b$10$FLLWuTniaNKKGuXgxVmeieES0f.9gsSQ3YCtlrfcig3OKk7P7iK1u	email	client	admin	/uploads/image_1756187146199.png	0	2025-08-26 11:15:46.352301	2025-08-26 11:15:46.352301	1	approved	\N
16	ADMIN	A	admin2@gmail.com	$2b$10$Sbn/7uMn51D3LFfmiufkL.S8BFsUdwxYLbpn3AsvVQ5d3U9aMcL3a	email	client	admin	\N	0	2025-08-26 11:26:54.781446	2025-08-26 11:26:54.781446	1	approved	\N
17	ADMIN 	B	adminb@gmail.com	$2b$10$Y/gMPFoiesrYwPfT1vRaNuq8G76u1FdAz5vC4N06tYAIW7jiH6/oi	email	client	admin	/uploads/image_1756187882164.png	0	2025-08-26 11:28:02.277109	2025-08-26 11:28:02.277109	1	approved	\N
18	AdminB	B	adminba@gmail.com	$2b$10$gKSlUsOKSg/xCi6/0JF1HeLn155smG6WD0bCBHmW7shAbuEbjWO1i	email	client	admin	/uploads/image_1756188501765.png	0	2025-08-26 11:38:21.973006	2025-08-26 11:38:21.973006	1	approved	\N
19	salon	A	salona@gmail.com	123456789	email	owner	pending	/uploads/image_1756266113827.png	1	2025-08-27 09:11:53.955774	2025-08-27 09:11:53.955774	1	approved	\N
\.


--
-- Name: category_ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.category_ratings_id_seq', 1, false);


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certifications_id_seq', 1, false);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_id_seq', 4, true);


--
-- Name: opening_hours_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.opening_hours_id_seq', 14, true);


--
-- Name: portfolio_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portfolio_images_id_seq', 8, true);


--
-- Name: portfolios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portfolios_id_seq', 3, true);


--
-- Name: rating_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_categories_id_seq', 3, true);


--
-- Name: review_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_images_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, true);


--
-- Name: salon_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salon_addresses_id_seq', 2, true);


--
-- Name: salon_gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salon_gallery_id_seq', 1, false);


--
-- Name: salons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salons_id_seq', 2, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 4, true);


--
-- Name: social_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_links_id_seq', 1, true);


--
-- Name: user_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_addresses_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


--
-- Name: category_ratings category_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_ratings
    ADD CONSTRAINT category_ratings_pkey PRIMARY KEY (id);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: opening_hours opening_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_pkey PRIMARY KEY (id);


--
-- Name: portfolio_images portfolio_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_images
    ADD CONSTRAINT portfolio_images_pkey PRIMARY KEY (id);


--
-- Name: portfolios portfolios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_pkey PRIMARY KEY (id);


--
-- Name: rating_categories rating_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating_categories
    ADD CONSTRAINT rating_categories_pkey PRIMARY KEY (id);


--
-- Name: review_images review_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: salon_addresses salon_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salon_addresses
    ADD CONSTRAINT salon_addresses_pkey PRIMARY KEY (id);


--
-- Name: salon_gallery salon_gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salon_gallery
    ADD CONSTRAINT salon_gallery_pkey PRIMARY KEY (id);


--
-- Name: salons salons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salons
    ADD CONSTRAINT salons_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_category_ratings_review_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_category_ratings_review_id ON public.category_ratings USING btree (review_id);


--
-- Name: idx_review_images_review_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_review_images_review_id ON public.review_images USING btree (review_id);


--
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- Name: idx_reviews_salon_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_salon_id ON public.reviews USING btree (salon_id);


--
-- Name: idx_reviews_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_user_id ON public.reviews USING btree (user_id);


--
-- Name: category_ratings category_ratings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_ratings
    ADD CONSTRAINT category_ratings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.rating_categories(id);


--
-- Name: category_ratings category_ratings_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category_ratings
    ADD CONSTRAINT category_ratings_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: certifications certifications_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: faqs faqs_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: opening_hours opening_hours_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.opening_hours
    ADD CONSTRAINT opening_hours_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: portfolio_images portfolio_images_portfolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_images
    ADD CONSTRAINT portfolio_images_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolios(id);


--
-- Name: portfolios portfolios_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolios
    ADD CONSTRAINT portfolios_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: review_images review_images_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT review_images_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: salon_addresses salon_addresses_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salon_addresses
    ADD CONSTRAINT salon_addresses_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id) ON DELETE CASCADE;


--
-- Name: salon_gallery salon_gallery_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salon_gallery
    ADD CONSTRAINT salon_gallery_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id) ON DELETE CASCADE;


--
-- Name: salons salons_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salons
    ADD CONSTRAINT salons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: services services_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: social_links social_links_salon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_salon_id_fkey FOREIGN KEY (salon_id) REFERENCES public.salons(id);


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict sWMBY4jSU7IwNt6a89dfMsRCUnzaT80FDb1C8cpffzLOyCCQZqHDeUIeiwhmqCX

