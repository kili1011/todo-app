--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: schreki
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO schreki;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: schreki
--

CREATE TABLE public.order_items (
    order_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.order_items OWNER TO schreki;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: schreki
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    status character varying NOT NULL
);


ALTER TABLE public.orders OWNER TO schreki;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: schreki
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO schreki;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schreki
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product; Type: TABLE; Schema: public; Owner: schreki
--

CREATE TABLE public.product (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.product OWNER TO schreki;

--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: schreki
--

CREATE SEQUENCE public.product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_id_seq OWNER TO schreki;

--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schreki
--

ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;


--
-- Name: todolists; Type: TABLE; Schema: public; Owner: schreki
--

CREATE TABLE public.todolists (
    id integer NOT NULL,
    name character varying NOT NULL,
    completed boolean NOT NULL
);


ALTER TABLE public.todolists OWNER TO schreki;

--
-- Name: todolists_id_seq; Type: SEQUENCE; Schema: public; Owner: schreki
--

CREATE SEQUENCE public.todolists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todolists_id_seq OWNER TO schreki;

--
-- Name: todolists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schreki
--

ALTER SEQUENCE public.todolists_id_seq OWNED BY public.todolists.id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: schreki
--

CREATE TABLE public.todos (
    id integer NOT NULL,
    description character varying NOT NULL,
    completed boolean NOT NULL,
    list_id integer NOT NULL
);


ALTER TABLE public.todos OWNER TO schreki;

--
-- Name: todos_id_seq; Type: SEQUENCE; Schema: public; Owner: schreki
--

CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_id_seq OWNER TO schreki;

--
-- Name: todos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: schreki
--

ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.product ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq'::regclass);


--
-- Name: todolists id; Type: DEFAULT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.todolists ALTER COLUMN id SET DEFAULT nextval('public.todolists_id_seq'::regclass);


--
-- Name: todos id; Type: DEFAULT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: schreki
--

COPY public.alembic_version (version_num) FROM stdin;
e6bb8338a647
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: schreki
--

COPY public.order_items (order_id, product_id) FROM stdin;
1	1
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: schreki
--

COPY public.orders (id, status) FROM stdin;
1	ready
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: schreki
--

COPY public.product (id, name) FROM stdin;
1	Great widget
\.


--
-- Data for Name: todolists; Type: TABLE DATA; Schema: public; Owner: schreki
--

COPY public.todolists (id, name, completed) FROM stdin;
25	Einkaufen	f
26	Merken	f
1	Uncategorized	f
35	Freundin	f
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: schreki
--

COPY public.todos (id, description, completed, list_id) FROM stdin;
84	Uncategorized Todo 1	t	1
85	Uncategorized Todo 2	t	1
90	Obst	t	25
91	Banane	f	25
97	Blumen für die Freundin kaufen	t	26
95	Uncategorized Todo 5	f	1
98	Uncategorized Todo 6	f	1
96	Morgen der Mutter gratulieren	t	26
88	 Uncategorized Todo 3	t	1
92	Uncategorized Todo 4	f	1
102	Computer zum Laufen bringen	t	35
101	Druckerzubehör bestellen	t	35
100	Blumen kaufen	t	35
94	Gemüse	f	25
\.


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schreki
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schreki
--

SELECT pg_catalog.setval('public.product_id_seq', 1, true);


--
-- Name: todolists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schreki
--

SELECT pg_catalog.setval('public.todolists_id_seq', 35, true);


--
-- Name: todos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: schreki
--

SELECT pg_catalog.setval('public.todos_id_seq', 102, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_id, product_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: todolists todolists_pkey; Type: CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.todolists
    ADD CONSTRAINT todolists_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(id);


--
-- Name: todos todos_list_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: schreki
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.todolists(id);


--
-- PostgreSQL database dump complete
--

