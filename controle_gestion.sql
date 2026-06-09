CREATE DATABASE controle_gestion;
\c controle_gestion;


CREATE TABLE utilisateur(
    id_utilisateur SERIAL PRIMARY KEY,
    mail VARCHAR(500),
    mdp VARCHAR(500),
    statut INT --1 si admin, 5 si simple user
);

INSERT INTO utilisateur(mail,mdp, statut)VALUES
('mtatamo50@gmail.com', 'mdp',1),
('mariaraz@gmail.com', 'maria',5);

-- Table: ville
CREATE TABLE ville (
    id_ville SERIAL PRIMARY KEY,
    nom_ville VARCHAR(100),
    code_ville INT,
    type_ville VARCHAR(50)
);

INSERT INTO ville(nom_ville, code_ville, type_ville) values
('Antalaha',1, 'DRA'),
('Antananarivo',2, 'DRA'),
('Antsiranana',3, 'REPR'),
('Antsohihy',4, 'REPR'),
('Mahajanga', 5, 'DRA'),
('Morondava', 6, 'REPR'),
('Morombe', 7, 'REPR'),
('Nosy Be', 8, 'REPR'),
('Port St Louis', 9, 'REPR'),
('Tolagnaro', 12, 'REPR'),
('Toliara', 13, 'RDA'),
('Vohemar', 14, 'REPR'),
('Manakara', 15, 'REPR'),
('Mananjary', 16, 'REPR'),
('Toamasina', 17, 'DRA'),
('Maintirano', 19, 'REPR'),
('Maroantsetra', 20, 'REPR'),
('Mahanoro',22, 'REPR'),
('Sainte Marie', 23, 'REPR'),
('Analalava', 24, 'REPR'),
('Mananara', 26, 'REPR'),
('Soanierana Ivongo', 27, 'REPR'),
('Miandrivazo', 28, 'REPR'),
('Belo Sur Tsiribihina', 29, 'REPR'),
('Loukintsy', 30, 'REPR'),
('PF Manangareza', 32, 'REPR'),
('Foulpointe', 34, 'REPR'),
('Belo Sur Mer', 35, 'REPR'),
('Marovoay', 36, 'REPR'),
('Farafangana', 37, 'REPR'),
('Besalampy', 38, 'REPR'),
('Cratère Nosy Be', 39, 'REPR'),
('Ankify', 40, 'REPR'),
('Ambolozy', 41, 'REPR'),
('Brickaville', 42, 'REPR'),
('Antanambe', 43, 'REPR'),
('Sambava', 44, 'REPR'),
('Mahabo', 47, 'REPR'),
('Antsiraka', 48, 'REPR'),
('Katsepy', 49, 'REPR'),
('Manambato', 50, 'REPR'),
('Nosy Varika', 51, 'REPR');

--table direction
CREATE TABLE direction(
    id_direction SERIAL PRIMARY KEY,
    nom_direction VARCHAR(100)
);

INSERT INTO direction(nom_direction)VALUES
('DAGC'),
('DAIJE'),
('DAF');


-- Table: type_tiers
CREATE TABLE type_tiers (
    id_type_tiers SERIAL PRIMARY KEY,
    type_tiers VARCHAR(50) -- Exemple: client ou fournisseur
);

INSERT INTO type_tiers(type_tiers) VALUES
('Client'),
('Fournisseur');


-- Table: Tiers
CREATE TABLE tiers (
    id_tiers VARCHAR(20) PRIMARY KEY, -- Utilisation de VARCHAR pour un ID personnalisé
    nom VARCHAR(100),
    prenoms VARCHAR(100),
    contact VARCHAR(100),
    raison_social VARCHAR(100),
    num_stat VARCHAR(50),
    NIF VARCHAR(50),
    CIN VARCHAR(50),
    id_ville INT REFERENCES ville(id_ville) ON DELETE CASCADE, -- Cascade pour maintenir l'intégrité référentielle
    id_type_tiers INT REFERENCES type_tiers(id_type_tiers) ON DELETE SET NULL -- Supprime ou définit NULL si supprimé
);

CREATE TABLE type_compte(
    id_type_compte SERIAL PRIMARY KEY,
    type_compte varchar(50)

);

INSERT INTO type_compte(type_compte) VALUES
('recette'),
('depense-Investissements'),
('depense-Fonctionnements');


-- Table: comptes
CREATE TABLE comptes (
    id_compte SERIAL PRIMARY KEY,
    code VARCHAR(20),
    libelle VARCHAR(2000),
    id_type_compte INT REFERENCES type_compte(id_type_compte)
);
--recette = 1
--depense-investissement = 2
--depense-fonctionnement = 3
INSERT INTO comptes (code, libelle, id_type_compte)
VALUES
    ('751133', 'Droit et redevance sur les marchandises', 1),
    ('751300', 'Redevance de flux marine', 1),
    ('706100', 'Location d''espaces', 1),
    ('706200', 'Location de batiments', 1),
    ('706300'
        , 'Location de materiels', 1),
    ('751121', 'Redevance d''exploitation', 1),
    ('751122', 'Redevance domaniale', 1),
    ('751131', 'Droits et redevances sur les navires', 1),
    ('751132', 'Droits de manutention', 1);

INSERT INTO comptes (code, libelle, id_type_compte)
VALUES
('751133','Droits et redevances sur les marchandises et les passagers', 1);

INSERT INTO comptes (code, libelle, id_type_compte)VALUES
('213100', 'Bâtiments administratifs APMF', 2),
('213500', 'Bâtiment administratifs APMF', 2),
('215100', 'Phares et ses batiments annexes', 2),
('215200', 'Equipements de signalisation maritime', 2),
('215500', 'Installation techniques pour usage administratif', 2),
('215900', 'Autres Installation techniques', 2),
('218100', 'Matériels roulants', 2),
('218110', 'Matériels de navigation maritime et fluviale', 2),
('218120', 'Matériels roulants', 2),
('218300', 'Matériels informatiques', 2),
('218340', 'Matériels de numerisation', 2),
('218400', 'Matériels de communication', 2),
('218420', 'Postes téléphoniques mobiles', 2),
('218500', 'Matériels et mobiliers de bureau', 2),
('218590', 'Autres matériels et mobiliers de bureau', 2),
('218900', 'Autres immobilisations corporelles', 2),
('274000', 'Prests PGA', 2),

('602200', 'Fournitures de bureau', 3),
('602220', 'Imprime et cachet et doc administratifs', 3),
('602300', 'Consommables informatiques', 3),
('602310', 'Encres et toners', 3),
('602400', 'Habillements', 3),
('602500', 'Décorations/protéctions', 3),
('602600', 'Produits d''entretien', 3),
('602800', 'Acaht matériels et equipement de sport', 3),
('602900', 'Autres approvisionnemnts/fournitures', 3),
('605000', 'Achats materiels/équipements', 3),
('605100', 'Achats pieces detachées', 3),
('605200', 'Achats petits outillages', 3),
('606200', 'Achats carburants et lubrifiants', 3),
('606300', 'Eau et electricité', 3),
('612500', 'Produits alimentaires', 3),
('615300', 'Entretiens et reparations', 3),
('616000', 'Primes d''assurances', 3),
('618100', 'Documentation spécifiques', 3),
('618300', 'Documentation courante', 3),
('618410', 'Formation a Madagascar', 3),
('618420', 'Formation a l''étranger', 3),
('618500', 'Colloques et séminaires', 3),

('621000', 'Personnel temporaire', 3),
('622100', 'Intermédiaires spécifiques', 3),
('622300', 'Remunerations intermediares RFM', 3),
('623000', 'Relations publiques', 3),
('625000', 'Frais de mission', 3),
('625900', 'Autres frais de mission', 3),
('626000', 'Frais postaux et télécommunications', 3),
('626100', 'Frais postaux(BP et expéditions', 3),
('627000', 'Services bancaires et assimiles', 3),
('628000', 'Cotisations et divers', 3),
('641000', 'Rémunérations du Personnel', 3),
('645110', 'Cotisations CNAPS', 3),
('645120', 'Cotisations CRCM', 3),
('647000', 'Autres charges sociales', 3),
('653000', 'indemnites de session', 3),
('656100', 'Subventions ENEM', 3),
('656300', 'Amendes et pénalités', 3),
('666000', 'Charges financieres', 3),
('680000', 'Dotations aux amortissements', 3),
('681000', 'Dotations actifs non courants', 3),
('695000', 'IBS', 3); 

CREATE TABLE budget(
    id_budget SERIAL PRIMARY KEY,
    annee INT,
    code_programme INT,
    id_compte INT REFERENCES comptes(id_compte),
    montant NUMERIC(15, 2),
    libelle VARCHAR(2000),
    id_ville INT REFERENCES ville (id_ville)
);

INSERT INTO budget (annee, code_programme,id_compte, montant, libelle, id_ville) VALUES
('2024', '022', 1, 1000000, 'Droits de manutention', 3);
INSERT INTO budget (annee, code_programme,id_compte, montant, libelle, id_ville) VALUES
('2024', '022', 39, 1000000, 'Dotations', 3);

INSERT INTO budget (annee, code_programme, id_compte, montant, libelle, id_ville)
VALUES
(2024, 22, (SELECT id_compte FROM comptes WHERE id_type_compte = 2 LIMIT 1), 500000.00, 'Investissement en infrastructure', 3);



-- Table: recette_gasynet
CREATE TABLE recette_gasynet (
    id_recette_gasynet SERIAL PRIMARY KEY,
    date_recette DATE,
    id_compte INT REFERENCES comptes(id_compte),
    bureau_douane VARCHAR(50),
    id_ville INT REFERENCES ville(id_ville),
    montant_HT NUMERIC(15, 2),
    TVA INT
);

-- Insertion pour Antananarivo (id_ville = 2) pour novembre
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2024-11-12', 1, 'Bureau3', 2, 3500000.00, 20),
('2024-11-15', 2, 'Bureau4', 2, 1800000.00, 20);

-- Insertion pour Toamasina (id_ville = 17) pour novembre
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2024-11-08', 1, 'Bureau1', 17, 5500.00, 20),
('2024-11-11', 1, 'Bureau2', 17, 20000.00, 20);

-- Insertion pour Antananarivo (id_ville = 2) pour décembre
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2024-12-05', 2, 'Bureau5', 2, 4500000.00, 20),
('2024-12-10', 1, 'Bureau6', 2, 1500000.00, 20);

-- Insertion pour Antsiranana (id_ville = 3) pour décembre
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2024-12-12', 1, 'Bureau1', 3, 10000.00, 20);

-- Insertion pour Antananarivo pour les années 2020-2024
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2020-03-15', 1, 'Bureau1', 2, 1000000.00, 20),   -- 2020
('2021-03-15', 1, 'Bureau1', 2, 1500000.00, 20),   -- 2021
('2022-03-15', 1, 'Bureau1', 2, 2000000.00, 20),   -- 2022
('2023-03-15', 1, 'Bureau1', 2, 2500000.00, 20),   -- 2023
('2024-03-15', 1, 'Bureau1', 2, 3000000.00, 20);   -- 2024

-- Insertion pour Toamasina pour les années 2020-2024
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2020-05-10', 2, 'Bureau2', 17, 50000.00, 20),    -- 2020
('2021-05-10', 2, 'Bureau2', 17, 60000.00, 20),    -- 2021
('2022-05-10', 2, 'Bureau2', 17, 70000.00, 20),    -- 2022
('2023-05-10', 2, 'Bureau2', 17, 80000.00, 20),    -- 2023
('2024-05-10', 2, 'Bureau2', 17, 90000.00, 20);    -- 2024

-- Insertion pour Antsiranana pour les années 2020-2024
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2020-06-05', 1, 'Bureau1', 3, 20000.00, 20),   -- 2020
('2021-06-05', 1, 'Bureau1', 3, 25000.00, 20),   -- 2021
('2022-06-05', 1, 'Bureau1', 3, 30000.00, 20),   -- 2022
('2023-06-05', 1, 'Bureau1', 3, 35000.00, 20),   -- 2023
('2024-06-05', 1, 'Bureau1', 3, 40000.00, 20);   -- 2024

-- Insertion pour Morondava pour les années 2020-2024
INSERT INTO recette_gasynet (date_recette, id_compte, bureau_douane, id_ville, montant_ht, tva) VALUES
('2020-07-05', 2, 'Bureau1', 6, 15000.00, 20),    -- 2020
('2021-07-05', 2, 'Bureau1', 6, 18000.00, 20),    -- 2021
('2022-07-05', 2, 'Bureau1', 6, 20000.00, 20),    -- 2022
('2023-07-05', 2, 'Bureau1', 6, 25000.00, 20),    -- 2023
('2024-07-05', 2, 'Bureau1', 6, 30000.00, 20);    -- 2024


-- Table: recette_APMF
CREATE TABLE recette_all_apmf (
    id_recette_apmf_all SERIAL PRIMARY KEY,
    id_compte INT REFERENCES comptes(id_compte),
    id_ville INT REFERENCES ville(id_ville),
    id_tiers VARCHAR(20) REFERENCES tiers(id_tiers),
    taux_tva INT,
    num_facture VARCHAR(100),
    libelle VARCHAR(2000),
    date_facture date,
    montant_ht NUMERIC(15, 2),
    tva NUMERIC(15, 2),
    montant_ttc NUMERIC(15, 2)
);

CREATE TABLE recette_apmf_vas (
    id_recette_apmf_vas SERIAL PRIMARY KEY,
    id_compte INT REFERENCES comptes(id_compte),
    id_ville INT REFERENCES ville(id_ville),
    id_tiers VARCHAR(20) REFERENCES tiers(id_tiers),
    taux_tva INT,
    navire VARCHAR(200),
    imm VARCHAR(200),
    num_facture VARCHAR(100),
    libelle VARCHAR(2000),
    date_facture date,
    montant_ht NUMERIC(15, 2),
    tva NUMERIC(15, 2),
    montant_ttc NUMERIC(15, 2)
);


/*vue pour unir rectte gasynet et recette all apmf*/

SELECT*FROM recette_all_apmf LEFT JOIN recette_gasynet ON recette_all_apmf.id_compte = recette_gasynet.id_compte;

--arcticles
CREATE TABLE articles(
    id_article SERIAL PRIMARY KEY,
    code_famille INT,
    famille_article VARCHAR(200),
    id_compte INT REFERENCES comptes(id_compte)
);

INSERT INTO articles(code_famille, famille_article, id_compte) values
(1, 'Autres Appro', 47),
(2, 'Consommable informatique', 41),
(3, 'Fournitures de bureau',39 ),
(4, 'Matériels informatiques',39),
(6, 'Matériels de bureau', 31),
(7, 'Mobiliers de bureau', 35),
(8, 'Produits d''entretien',45 ),
(9, 'Matériels de communication',45),
(10, 'Matériels de transport', 30),
(11, 'Matériels techniques',26 ),
(12, 'Petits outillages', 50),
(13, 'Outillages', 48),
(14, 'Carburants et lubrifiants', 39),
(15, 'Matériels navals', 29),
(16, 'Habillements', 43),
(17, 'Décoration', 44 ),
(18, 'Pneumatiques', 49),
(19, 'Pieces Detachées', 49),
(20, 'Matériels et equipements', 48),
(21, 'Quincaillerie',45),
(22, 'Tissus',44),
(23, 'Equipement électrique',48),
(24, 'Produits pharmacieutiques', 45),
(25, 'Documentations', 56),
(26, 'Equipement de protection individuelle',45 ),
(27, 'Logiciels', 16);

---creation articles
CREATE TABLE creation_article(
    id_creation_article SERIAL PRIMARY KEY,
    code_famille INT,
    code_article VARCHAR(50),
    article VARCHAR(100),
    pu NUMERIC(15, 3),
    quantite INT
);

INSERT INTO creation_article(code_famille, code_article, article, pu, quantite) VALUES
(1, 'AAP0001', 'Café', 1000, 100),
(1, 'AAP0002', 'Sucre', 500, 200),
(1, 'AAP0003', 'Sel', 500, 100),
(2, 'CIN0001', 'DDE', 20000, 100),
(2, 'CIN0002', 'CD', 25000, 100),
(2, 'CIN0003', 'DISC', 30000, 100);

--besoin par service
CREATE TABLE besoin_par_service(
    id_besoin_par_service SERIAL PRIMARY KEY,
    annee_besoin INT,
    id_demandeur INT REFERENCES direction(id_direction),
    id_creation_article INT REFERENCES creation_article(id_creation_article),
    quantite INT
);

CREATE TABLE modification_suppression_budget (
    id_modification SERIAL PRIMARY KEY,
    annee_modification INT,
    id_compte INT REFERENCES comptes(id_compte),
    id_budget INT REFERENCES budget(id_budget),
    num_marche VARCHAR(100),
    responsable VARCHAR(200),
    taux_amortissement INT,
    avance NUMERIC(15, 3),
    remb_garantie NUMERIC(15, 3),
    attach1 NUMERIC(15, 3) DEFAULT NULL,
    attach2 NUMERIC(15, 3) DEFAULT NULL,
    attach3 NUMERIC(15, 3) DEFAULT NULL,
    attach4 NUMERIC(15, 3) DEFAULT NULL,
    attach5 NUMERIC(15, 3) DEFAULT NULL,
    attach6 NUMERIC(15, 3) DEFAULT NULL,
    attach7 NUMERIC(15, 3) DEFAULT NULL,
    attach8 NUMERIC(15, 3) DEFAULT NULL,
    attach9 NUMERIC(15, 3) DEFAULT NULL,
    attach10 NUMERIC(15, 3) DEFAULT NULL,
    attach11 NUMERIC(15, 3) DEFAULT NULL,
    attach12 NUMERIC(15, 3) DEFAULT NULL,
    attach13 NUMERIC(15, 3) DEFAULT NULL,
    attach14 NUMERIC(15, 3) DEFAULT NULL,
    attach15 NUMERIC(15, 3) DEFAULT NULL,
    attach16 NUMERIC(15, 3) DEFAULT NULL,
    attach17 NUMERIC(15, 3) DEFAULT NULL,
    attach18 NUMERIC(15, 3) DEFAULT NULL,
    attach19 NUMERIC(15, 3) DEFAULT NULL,
    attach20 NUMERIC(15, 3) DEFAULT NULL
);

--amenagemnt budget
CREATE TABLE amenagement_budget(
    id_amenagement SERIAL PRIMARY KEY,
    annee INT,
    id_compte INT REFERENCES comptes(id_compte),
    id_budget INT REFERENCES budget(id_budget),
    modif_plus NUMERIC(15, 3),
    modif_moins NUMERIC(15, 3),
    date_programme_emploi DATE
);

INSERT INTO amenagement_budget(annee, id_compte, id_budget, modif_plus, modif_moins, date_programme_emploi)
VALUES(2024, 1, 6, 500, 50, '2024-12-18');

INSERT INTO amenagement_budget(annee, id_compte, id_budget, modif_plus, modif_moins, date_programme_emploi)
VALUES(2024, 1, 7, 500, 50, '2024-12-18');


--depenses_SIIG
CREATE TABLE type_operation(
    id_type_operation SERIAL PRIMARY KEY,
    type_operation VARCHAR(100)
);
INSERT INTO type_operation(type_operation) VALUES
('ENG'),
('DEG');


CREATE TABLE depenses_siig(
    id_depense_siig SERIAL PRIMARY KEY,
    id_type_operation INT REFERENCES type_operation(id_type_operation),
    annee INT,
    num_engagement VARCHAR(50),
    code_programme INT,
    code_tiers VARCHAR(20) REFERENCES tiers(id_tiers),
    id_compte INT REFERENCES comptes (id_compte),
    objet VARCHAR(500),
    date_eng DATE,
    grande_rubrique VARCHAR(500),
    montant NUMERIC(15,3),
    etat VARCHAR(50)
    
);

--historiques depenses_siig
CREATE TABLE public.historique_depenses_siig (
    id_depense_siig integer NOT NULL,
    id_type_operation integer,
    annee integer,
    num_engagement character varying(50),
    code_programme integer,
    code_tiers character varying(20),
    id_compte integer,
    objet character varying(500),
    date_eng date,
    grande_rubrique character varying(500),
    montant numeric(15,3),
    etat character varying(50),
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP, -- Ajout de la colonne date_modification
    PRIMARY KEY (id_depense_siig, date_modification), -- Clé primaire avec id_depense_siig et date_modification
    FOREIGN KEY (code_tiers) REFERENCES tiers(id_tiers),
    FOREIGN KEY (id_compte) REFERENCES comptes(id_compte),
    FOREIGN KEY (id_type_operation) REFERENCES type_operation(id_type_operation)
);

--table financement
CREATE TABLE financement(
    id_financement SERIAL PRIMARY KEY,
    financement VARCHAR(100)
);
INSERT INTO financement(financement) VALUES
('Propre'),
('Subvention');

--type depense
CREATE TABLE type_depense(
    id_type_depense SERIAL PRIMARY KEY,
    type_depense VARCHAR(100)
);
INSERT INTO type_depense(type_depense) VALUES
('Investissement'),
('Fonctionnement');

--table marche
CREATE TABLE marches(
    id_marche SERIAL PRIMARY KEY,
    annee INT,
    id_compte INT REFERENCES comptes (id_compte),
    num_marche VARCHAR(50),
    id_financement INT REFERENCES financement(id_financement),
    id_type_depense INT REFERENCES type_depense(id_type_depense),
    objet_marche VARCHAR(200),
    attributaire VARCHAR(200),
    montant_ht NUMERIC(15, 3),
    tva INT,
    num_os VARCHAR(50),
    date_os DATE,
    num_sur_registre VARCHAR(50),
    delai_en_jour INT,
    date_signature DATE,
    date_notification DATE,
    observation VARCHAR(500)

);

--historiques marches
CREATE TABLE public.historiques_marches(
    id_marche INTEGER NOT NULL,
    annee INT,
    id_compte INT REFERENCES comptes (id_compte),
    num_marche VARCHAR(50),
    id_financement INT REFERENCES financement(id_financement),
    id_type_depense INT REFERENCES type_depense(id_type_depense),
    objet_marche VARCHAR(200),
    attributaire VARCHAR(200),
    montant_ht NUMERIC(15, 3),
    tva INT,
    num_os VARCHAR(50),
    date_os DATE,
    num_sur_registre VARCHAR(50),
    delai_en_jour INT,
    date_signature DATE,
    date_notification DATE,
    observation VARCHAR(500),
    date_misajour timestamp without time zone DEFAULT CURRENT_TIMESTAMP

);


--table pta
CREATE TABLE pta(
    id_pta SERIAL PRIMARY KEY,
    annee INT,
    code_strategique VARCHAR(50),
    code_activite VARCHAR(50),
    libelle VARCHAR(100),
    montant NUMERIC(15, 3),
    id_direction INT REFERENCES direction(id_direction),
    code_programme INT,
    ref_dos INT REFERENCES dos(id_dos)

);
--table historique PTA
CREATE TABLE public.historiques_pta(
    id_pta INTEGER NOT NULL,
    annee INT,
    code_strategique VARCHAR(50),
    code_activite VARCHAR(50),
    libelle VARCHAR(100),
    montant NUMERIC(15, 3),
    id_direction INT REFERENCES direction(id_direction),
    code_programme INT,
    ref_dos INT REFERENCES dos(id_dos),
    date_misajour timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--table attachement par compte 
CREATE TABLE attachement_par_compte(
    id_attachement SERIAL PRIMARY KEY,
    id_marche INT REFERENCES marches(id_marche),
    annee_paiement INT,
    num_attachement VARCHAR(50),
    montant NUMERIC(15, 3)
);

--reference DOS
CREATE TABLE objectifs(
    id_objectif SERIAL PRIMARY KEY,
    code_objectif INT,
    objectif TEXT
);
INSERT INTO objectifs(code_objectif, objectif) VALUES
(1, 'Administration responsable, efficace et efficiente'),
(2, 'Capital humain compétent et intégré'),
(3, 'Ports aux normes et compétitifs'),
(4, 'Ports secondaires, un moyen de désenclavement des régions et un vecteur de développement'),
(5, 'Navires respectant les normes de sécurité'),
(6, 'Exploitation maritime performante et compétitive'),
(7, 'Navigation maritime dans les eaux territoriales malgaches fiable et contrôlée'),
(8, 'Marins malgaches compétents, reconnus et protégés de par leurs droits'),
(9, 'Voies navigables fluides confortant la modernisation du transport fluvial'),
(10, 'Transport fluvial, moyen de désenclavement et d''accompagnement au développement local');

CREATE TABLE strategies(
    id_strategie SERIAL PRIMARY KEY,
    code_strategie INT,
    strategie TEXT
);
INSERT INTO strategies(code_strategie, strategie) VALUES
(1, 'Instaurer l'' état de droit et l'' autorité de l'' Etat pour progresser l'' efficacité de l'' EPIC');
INSERT INTO strategies(code_strategie, strategie) VALUES
(2, 'Assurer le bon recouvrement des recettes pour mieux contribuer au déploiement du secteur et de la caisse de l Etat'),
(3, 'Sécuriser et optimiser la gestion des patrimoines'),
(4, 'Développer un partenariat équitable pour le développement du secteur'),
(5, 'Renforcer la qualité et la performance technique et administrative pour la professionnalisation du métier'),
(6, 'Ouverture de l''exploitation portuaire au capital privé tout en maintenant le rôle régalien de l''état'),
(7, 'Gestion des ports optimisés'),
(8, 'Entretien et développement des infrastructures portuaires'),
(9, 'Mise aux normes ISPS des ports'),
(10, 'Environnement portuaire propre'),
(11, 'Contribuer au développement économique des régions'),
(12, 'Amélioration de l''administration de la flotte sous pavillon malgache'),
(13, 'Normalisation de l''exploitation des navires battant pavillon malgache'),
(14, 'Mise en place de registre international de madagascar'),
(15, 'Assistance aux navigateurs pour la conduite des navires'),
(16, 'Appui et intervention en cas d''événement en mer'),
(17, 'Mise aux normes stcw des qualifications des marins malagasy'),
(19, 'Normalisation des agences de recrutement et de placement'),
(20, 'Gestion efficace de gens de mer'),
(21, 'Encadrement et formation de gens de mer'),
(22, 'Entretien des voies navigables'),
(23, 'Modernisation des infrastructures fluviales'),
(24, 'Normalisation des navires'),
(25, 'navigation intérieure innovée et sécuritaire'),
(26, 'Gestion efficace des mariniers'),
(27, 'Renforcement de sécurité à la navigation'),
(28, 'Renforcement de la sécurité à la navigation et appui et intervention en cas d''événement fluvial');



CREATE TABLE activites(
    id_activite SERIAL PRIMARY KEY,
    code_activite INT,
    activite TEXT
);
INSERT INTO activites(code_activite, activite)  VALUES
(1,'Assurer que le statut de l''APMF soit cohérent avec sa mission'),
(2, 'Assurer une transparence de gestion à travers des audits et contrôles réguliers'),
(3, 'Appliquer la politique qualité'),
(4, 'Assurer la transparence de passation de marché publique'),
(5, 'Déléguer le pouvoir en renforçant les ressources mises à disposition aux directions et représentations régionales'),
(6, 'Renforcer les cadres juridiques pour le développement du secteur'),
(7, 'Appliquer l''E-gouvernance pour la gestion numérique des documents et des ressources disponibles'),
(8, 'Optimiser les dépenses de fonctionnement et d''investissement de l''agence'),
(9, 'Sécuriser les recettes par la numérisation du système et par la remise à niveau de la performance des systèmes portuaires'),
(10, 'Renforcer les systèmes spécifiquement dédiés aux contrôles et évaluations de recettes'),
(11, 'Optimiser les dépenses de fonctionnement et d''investissement de l''agence'),
(12, 'Inventorier régulièrement et sécuriser systématiquement les patrimoines de l''APMF'),
(13, 'Gérer efficacement les propriétés bâties'),
(14, 'Gérer et assurer le bon fonctionnement des materiels roulants et flottants affectés aux activités de l''Agence'),
(15, 'Participer aux ateliers et formations internationales relative au développement du secteur'),
(16, 'Ratifier et appliquer les conventions internationales'),
(17, 'Applique et gérer de manière effective les instruments et les projets de l''OMI'),
(18, 'S''intégrer aux partenariats institutionnels régionaux et internationaux pour la sécurisation et le développement S''intégrer aux partenariats institutionnels régionaux et internationaux pour la sécurisation et le développement'),
(19, ' Développer des partenariats technique et financier pour le développement des projets portuaires et ses dérivés, pour
des projets sur les navires, pour les formations internationales et pour la sécurité à la navigation
'),
(20, 'Concrétiser des partenariats publiques-privés pour la gestion des patrimoines');

--------

(21, 'Mettre en place un système de gestion prévisionnelle des emplois et compétences (GEPC)'),
(22, 'Élaborer et proposer des perspectives/plans d''évolution de carrière'),
(23, 'Gérer avec transparence le recrutement et la formation interne'),
(24, 'Promouvoir les promotions internes'),
(25, 'Mettre en place un système d''écoute et de communication interne efficace pour impliquer l''ensemble du personnel'),
(26, 'Réaliser des teams building pour créer une bonne ambiance en milieu de travail'),
(27, 'Développer un système d’évaluation du personnel'),
(28, 'Solliciter l''amélioration continue de soi par un système de récompense'),
(29, 'Mettre en place des corps d''agents d''administration portuaire, maritime et fluvial'),
(30, 'Assurer et maintenir le rôle d’autorité de la capitainerie du Port'),
(31, 'Inciter aux investissements portuaires et activités dérivées'),
(32, 'Céder les activités de services publics portuaires aux partenaires privés sous formes de concession et de permission
d''outillage privé
'),
(33, 'Appuyer la connexion des projets économiques locaux avec les ports'),
(34, 'Mettre à jour les textes de bases sur les statuts des ports conformément à la politique de développement de Madagascar'),
(35, 'Elaborer des règlements particuliers pour chaque port'),
(36, 'Numériser les bases de données portuaires'),
(37, 'Mise en place de base de données'),
(38, 'Mise en œuvre du schéma nationale directeur de port pour les projets portuaires'),
(39, ' Assurer le respect des cahiers des charges exigeant l''acquisition progressive d''équipements répondant à l''évolution des
opérations dans le Port
'),
(40, 'Dématérialiser les services'),
(41, 'Renforcer la technicité des ressources humaines répondant à la modernisation'),
(42, 'Mettre en place un guichet unique des opérations portuaires en vue de la dématérialisation et de l''allègement des procédures'),
(43, 'Mise en place d''un système de suivi et de contrôle'),
(44, 'Réhabiliter et mettre aux normes les infrastructures existantes'),
(45, 'Mettre en place un système de contrôle et de suivi autonome des infrastructures portuaires'),
(46, 'Augmenter la capacité d''accueil par de nouvelles constructions ou extensions des ports'),
(47, 'Mettre en place un système de dragage permanent'),
(48, 'Doter l''administration de base de données hydrographiques, bathymétriques et techniques pour améliorer les prises de
décision aux investissement portuaires et du transport maritime
'),
(49, 'Doter les ports d''équipements modernes et performants'),
(50, 'Mettre en place un système de coordination, de suivi et d''évaluation permanente'),
(51, 'Intégrer les usagers des ports et les partenaires privés dans la mise en place du code ISPS'),
(52, 'Renforcer la capacité des agents et étoffer l''équipe dans la mise en œuvre du code ISPS'),
(53, 'Clôturer et sécuriser tous les ports'),
(54, 'Assurer l''éclairage des domaines portuaires'),
(55, 'Doter des ports des installations portuaires de réception et de traitement des déchets'),
(56, 'Mettre en place un système de contrôle environnemental des ports et des navires aux quais'),
(57, 'Doter des ports internationaux des laboratoires d''analyses environnementales'),
(58, 'Renforcer la capacité des PSCO en gestion de l''environnement'),
(59, 'Etoffer l''équipe de PSCO en gestion de l''environnement'),
(60, 'Collaborer avec les institutions de recherche et de gestion environnementale pour la préservation du milieu marin'),
(61, 'Appuyer et favoriser les activités portuaires connexes (logistiques pétroliers, pêches, port franc)'),
(62, 'Favoriser le recrutement local'),
(63, 'Développement des partenariats institutionnels et prives pour accroitre les retombés économiques des ports'),
(64, 'Numériser la base de données administrative et technique des navires'),
(65, 'Renforcer le pool d''inspecteurs des affaires maritimes (IAM)'),
(66, 'Appliquer le flag state control (FSC)'),
(67, 'Mettre en place un système de délivrance d''actes administratifs (guichet unique ???)'),
(68, 'Intensifier le contrôle des navires pour le respect de l’environnement maritime'),
(69, 'Renforcer le système de gestion et contrôle de cycle de vie des navires'),
(70, 'Agréer les chantiers navals'),
(71, 'Elaborer un catalogue des matériels de sécurités de navires'),
(72, 'Agréer des établissements de distribution de matériels de sécurités'),
(73, 'Mettre en place de centres de sécurité des navires'),
(74, 'Mettre en place des bureaux de gestion d''accidents'),
(75, 'Reconnaitre et agréer les organisations de sécurités et de sureté maritime notamment dans l''expertise et
les sociétés de classification
'),
(77, 'Actualiser les routes maritimes'),
(78, 'Rendre disponible de façon permanente des cartes nautiques mise à jour'),
(79, 'Installer et maintenir les équipements d''aides à la navigation'),
(80, 'Formaliser les lignes de transport maritime'),
(81, 'Cartographie les zones sensibles'),
(82, 'Mettre en place des centres de contrôle à distance des équipements d''aide à la navigation'),
(83, 'Mettre à disposition de manière effective les renseignements sur la sécurité maritime'),
(84, 'Mettre en place des statons de contrôle pour le suivi des trafics maritimes'),
(85, 'Renforcer la procédure de contrôle au départ et à l''arrivée des navires'),
(86, 'Réaliser des inspections et de contrôle en mer'),
(87, 'Déployer et contrôler les balises AIS pour les navires non conventionnel dans les zones à haut risque d’accident
maritime et d’activité illicite
'),
(88, 'Installer et maintenir des stations AIS côtière'),
(89, 'Mettre en place un système SAR'),
(90, 'Mettre en place des centres de coordination des recherches et de sauvetages maritimes'),
(91, 'Développer des partenariats institutionnels pour les interventions en mer'),
(92, 'Mettre en place des points de refuge pour les navires en détresses sur le territoire maritime Malagasy')
(93, 'Vulgariser un mécanisme d''assistance en mer'),
(94, 'Appuyer et sécuriser les évènements nautiques nationaux'),
(95, 'Renforcer les capacités des agents de contrôle environnemental des navires'),
(96, 'Appliquer et contrôler l’amendement de Manille'),
(97, 'Renforcer la capacité linguistique des gens de mer'),
(98, 'Normaliser les qualifications des marins portuaires'),
(99, 'Elaborer et adopter le statut particulier de marins portuaires'),
(100, 'Renforcer la capacité professionnelle des marins portuaires'),
(101, 'Renforcer le système d''agreement des agences de placement et/ou de recrutement pour la professionnalisation du métier'),
(102, 'Instaurer un système de contrôle des agences en matière de recrutement des gens de mer'),
(103, 'Mettre en place une base de données électronique fiable des gens de mer'),
(104, 'Mettre en place un dispositif de suivi des marins travaillant en freelance'),
(105, 'Mener une veille du marché de travail des gens de mer sur le plan national et à l''international'),
(106, 'Mettre en œuvre la Convention des Pièces d''Identité des Marins (PIM)'),
(107, 'Ratifier et mettre en œuvre le MLC 2006'),
(108, 'Réglementer le salaire et l''accès aux avantages sociaux'),
(109, 'Renforcer le contrôle du système de visite médicale des gens de mer et créer à terme des cliniques des gens de mer'),
(110, 'Mettre en place un système d''homologation des équipements de sécurité'),
(111, 'Doter d''équipement de sauvetage les marins professionnels au cabotage'),
(112, 'Réduire les couts de visite médicale des gens de mers au cabotage'),
(113, 'Dispenser des formations professionnelles aux métiers de cabotages'),
(114, 'Augmenter le nombre d’établissements de formation maritime'),
(115, 'Renforcer le suivi et le contrôle des établissement et des formations'),
(116, 'Formaliser le comité national tripartie sur le travail maritime incluant les autorités, les représentants des employeurs et
les représentants de gens de mer
'),
(117, 'Renforcer le comité paritaire sur la formation maritime'),
(118, 'Dragages réguliers des canaux et fleuves dynamiques'),
(119, 'Entretien des canaux'),
(120, 'Protection des berges des voies navigables'),
(121, 'Mise en place de panneau de signalisation'),
(122, 'Entretenir et mettre à niveau des infrastructures portuaires adaptées à chaque voie navigable'),
(123, 'Construire des infrastructures adaptées au site économiquement dynamique'),
(124, 'Assurer un environnement portuaire et fluviale propre et respectueux de l''environnement'),
(125, 'Renforcer les visites de sécurité et contrôle des navires'),
(126, 'Mettre en place de bureau locale de contrôles des navires'),
(127, 'Elaborer une base de données numériques des navires'),
(128, 'Agréer et contrôler les chantiers navals'),
(129, 'Prescrire les consignes de sécurités pour les constructions traditionnelles et artisanales'),
(130, 'Inciter la modernisation des embarcations et prescrire les normes de sécurité correspondant à chaque catégorie'),
(131, 'Elaborer et appliquer le code de la navigation intérieure'),
(132, 'Formaliser et contrôler les lignes fluviales'),
(133, 'Elaborer et appliquer des règlementations spécifiques pour chaque voie navigable'),
(134, 'Mettre en place une base de données électronique fiable des mariniers'),
(135, 'Formaliser les métiers des mariniers'),
(136, 'Agréer des établissements et de centre de formation fluviale'),
(137, 'Renforcer et contrôler régulièrement la capacité des mariniers'),
(138, 'Installer et entretenir des balises et de consignes de sécurités aux voies navigables'),
(139, 'Mettre en place des polices de la navigation'),
(140, 'Mettre en placement un système SAR à la navigation intérieure'),
(141, 'Doter des moyens matériels flottant pour la sécurisation de la navigation intérieure et pour des activités de
recherches et sauvetage
'),
(142, 'Sécuriser les évènements nautiques et fluviaux nationaux'),
(143, 'Développer des partenariats public-privés dans l’exploitation portuaire et des voies navigables'),
(144, 'Doter les collectivités et autorités locales d’équipements de sauvetage'),
(145, 'Sécuriser les ports fluviaux par le renforcement de contrôles des personnes et des marchandises'),
(146, 'Clôturer et mettre en place des éclairages suffisants dans l''enceinte portuaire'),
(147, 'Inciter le PPP aux activités et exploitations portuaires');


--table DOS
CREATE TABLE dos(
    id_dos SERIAL PRIMARY KEY,
    libelle VARCHAR(50),
    ref_dos VARCHAR(50)
);

--table DRSN
CREATE TABLE drsn(
    id_drsn SERIAL PRIMARY KEY,
    num_facture VARCHAR(100),
    droit_de_port NUMERIC(15, 3),
    droit_de_stationnement NUMERIC(15, 3),
    autres NUMERIC(15, 3)
);

CREATE view facture_drsn 
AS recette_all_apmf r
JOIN drsn d
ON r.num_facture = d.num_facture;

--table dsm
CREATE TABLE dsm(
    id_dsm SERIAL PRIMARY KEY,
    num_facture VARCHAR(100),
    mses_embarquees DECIMAL,
    mses_debarquees DECIMAL,
    passagers_nationaux DECIMAL,
    passagers_internationaux DECIMAL
);

--table dm
CREATE TABLE dm(
    id_dm SERIAL PRIMARY KEY,
    num_facture VARCHAR(100),
    mses_embarquees DECIMAL,
    mses_debarquees DECIMAL
);

--table vas
CREATE TABLE vas(
    id_vas SERIAL PRIMARY KEY,
    num_facture VARCHAR(100),
    nav_plaisancier_200 INT,
    nav_plaisancier_300 INT,
    emb_trad_60 INT,
    emb_trad_120 INT,
    vedette_mot_hb_120 INT,
    remorqueur_vedette_200 INT,
    remorqueur_vedette_300 INT,
    barge_chaland_inf INT,
    barge_chaland_sup INT,
    nav_de_charge_inf_200 INT,
    nav_de_charge_inf_1600 INT,
    nav_de_charge_sup_1600 INT,
    nav_de_peche_mot_hb_220 INT,
    nav_de_peche_mot_ib_280 INT,
    nav_de_peche_cotiere_400 INT,
    nav_de_peche_au_large INT

);

--table aam marins
CREATE TABLE aam_marins(
    id_aam_marin SERIAL PRIMARY KEY,
    num_facture VARCHAR(100),
    aptitude INT,
    base INT,
    f1 INT,
    f2 INT,
    f3 INT,
    f4 INT,
    f5 INT,
    f6 INT,
    f7 INT,
    f8 INT,
    f9 INT,
    f10 INT
);

--table location TP et Location
CREATE TABLE location_tp(
    id_location_tp SERIAL PRIMARY KEY,
    surface_louee INT
);

--table stat
CREATE TABLE stat(
    id_stat SERIAL PRIMARY KEY,
    libelle_stat VARCHAR(100),
    code_stat VARCHAR(100)
);
INSERT INTO stat(libelle_stat, code_stat)VALUES
('Premier Stat','STAT001'),
('Premier Stat','STAT001'),
('Troisieme Stat','STAT003');

--table marchandises
CREATE TABLE marchandises(
    id_marchandise SERIAL PRIMARY KEY,
    importation_donnees VARCHAR(200),
    port_ou_localite INT REFERENCES ville(id_ville),
    date_operation DATE,
    operation VARCHAR(200),
    id_navire INT REFERENCES navires_operationnels(id_navire),
    provenance_ou_destination INT REFERENCES ville(id_ville),
    type_stat VARCHAR(50),
    quantite INT,
    code_stat INT REFERENCES stat(id_stat)
);

--table navire operationnels
CREATE TABLE navires_operationnels(
    id_navire SERIAL PRIMARY KEY,
    id_ville INT REFERENCES ville(id_ville),
    date_operation DATE,
    navire VARCHAR(100),
    imm VARCHAR(100)

);

CREATE TABLE taches (
    id_tache SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    descriptions TEXT,
    date_debut DATE,
    date_limite DATE,
    statut VARCHAR(50) DEFAULT 'Non commencé', -- Statut: Non commencé, En cours, Terminé
    id_utilisateur INTEGER REFERENCES utilisateur(id_utilisateur), -- Table des utilisateurs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




















