-- AutoServe Flyway V10 Migration Script: Seed Persistent Staff Principals for Fixed Production Login
-- Ensures persistent internal DB principals exist for MANAGER, MECHANIC, and ADMIN roles.

INSERT INTO users (user_name, email, password, user_role, mobile, is_active, created_on, updated_on)
SELECT 'AutoServe Manager', 'manager@autoserve.com', '$2a$10$T84Zp5.raOx8E0FC8r2N3.DVAqMna.AZUzQ6DMgdHJ03PfSK99fNy', 'MANAGER', '9000000001', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'manager@autoserve.com');

INSERT INTO users (user_name, email, password, user_role, mobile, is_active, created_on, updated_on)
SELECT 'AutoServe Mechanic', 'mechanic@autoserve.com', '$2a$10$txD0z2AKvZLW7jbWOIkyoOtVaGeLkx6kQBzQjod8FE.Rz2uYiFD0y', 'MECHANIC', '9000000002', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'mechanic@autoserve.com');

INSERT INTO users (user_name, email, password, user_role, mobile, is_active, created_on, updated_on)
SELECT 'AutoServe Administrator', 'admin@autoserve.com', '$2a$10$CggPZjHVxZouxpg22BIozOYi2qYF5rpBS5jd.wz7A0nod3te9soMC', 'ADMIN', '9000000003', 1, NOW(), NOW()
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@autoserve.com');
