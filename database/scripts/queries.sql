-- Queries Úteis para OmniFlow

-- 1. Listar todas as empresas com seus planos
SELECT 
    c.id,
    c.name AS company_name,
    c.cnpj,
    c.email,
    c.status,
    p.name AS plan_name,
    p.price,
    COUNT(DISTINCT u.id) AS total_users
FROM companies c
JOIN plans p ON c.plan_id = p.id
LEFT JOIN users u ON c.id = u.company_id
GROUP BY c.id, c.name, c.cnpj, c.email, c.status, p.name, p.price
ORDER BY c.created_at DESC;

-- 2. Listar conversas abertas por empresa
SELECT 
    conv.id,
    c.name AS company_name,
    cust.name AS customer_name,
    cust.phone,
    ch.type AS channel,
    u.name AS assigned_to,
    conv.status,
    conv.created_at
FROM conversations conv
JOIN companies c ON conv.company_id = c.id
JOIN customers cust ON conv.customer_id = cust.id
JOIN channels ch ON conv.channel_id = ch.id
LEFT JOIN users u ON conv.assigned_to = u.id
WHERE conv.status = 'OPEN'
ORDER BY conv.updated_at DESC;

-- 3. Estatísticas por empresa
SELECT 
    c.name AS company_name,
    COUNT(DISTINCT cust.id) AS total_customers,
    COUNT(DISTINCT conv.id) AS total_conversations,
    COUNT(DISTINCT CASE WHEN conv.status = 'OPEN' THEN conv.id END) AS open_conversations,
    COUNT(DISTINCT u.id) AS total_users,
    COUNT(DISTINCT ch.id) AS total_channels
FROM companies c
LEFT JOIN customers cust ON c.id = cust.company_id
LEFT JOIN conversations conv ON c.id = conv.company_id
LEFT JOIN users u ON c.id = u.company_id
LEFT JOIN channels ch ON c.id = ch.company_id
GROUP BY c.id, c.name;

-- 4. Buscar clientes por nome ou telefone
SELECT 
    cust.id,
    cust.name,
    cust.phone,
    cust.email,
    cust.tags,
    c.name AS company_name,
    COUNT(conv.id) AS total_conversations
FROM customers cust
JOIN companies c ON cust.company_id = c.id
LEFT JOIN conversations conv ON cust.id = conv.customer_id
WHERE 
    cust.name ILIKE '%:search%' 
    OR cust.phone LIKE '%:search%'
GROUP BY cust.id, cust.name, cust.phone, cust.email, cust.tags, c.name;

-- 5. Listar usuários por empresa com suas conversas atribuídas
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.is_active,
    c.name AS company_name,
    COUNT(conv.id) AS assigned_conversations
FROM users u
JOIN companies c ON u.company_id = c.id
LEFT JOIN conversations conv ON u.id = conv.assigned_to AND conv.status = 'OPEN'
GROUP BY u.id, u.name, u.email, u.role, u.is_active, c.name
ORDER BY c.name, u.role, u.name;

-- 6. Verificar limite de usuários por plano
SELECT 
    c.name AS company_name,
    p.name AS plan_name,
    p.max_users AS plan_limit,
    COUNT(u.id) AS current_users,
    (p.max_users - COUNT(u.id)) AS available_slots
FROM companies c
JOIN plans p ON c.plan_id = p.id
LEFT JOIN users u ON c.id = u.company_id AND u.is_active = TRUE
GROUP BY c.id, c.name, p.name, p.max_users
HAVING COUNT(u.id) >= p.max_users * 0.8;

-- 7. Clientes mais ativos (mais conversas)
SELECT 
    cust.id,
    cust.name,
    cust.phone,
    cust.tags,
    c.name AS company_name,
    COUNT(conv.id) AS total_conversations,
    MAX(conv.updated_at) AS last_interaction
FROM customers cust
JOIN companies c ON cust.company_id = c.id
JOIN conversations conv ON cust.id = conv.customer_id
GROUP BY cust.id, cust.name, cust.phone, cust.tags, c.name
ORDER BY total_conversations DESC
LIMIT 10;

-- 8. Canais conectados por empresa
SELECT 
    c.name AS company_name,
    ch.type AS channel_type,
    ch.status,
    ch.created_at AS connected_at
FROM companies c
JOIN channels ch ON c.id = ch.company_id
ORDER BY c.name, ch.type;

-- 9. Conversas não atribuídas
SELECT 
    conv.id,
    c.name AS company_name,
    cust.name AS customer_name,
    cust.phone,
    ch.type AS channel,
    conv.created_at
FROM conversations conv
JOIN companies c ON conv.company_id = c.id
JOIN customers cust ON conv.customer_id = cust.id
JOIN channels ch ON conv.channel_id = ch.id
WHERE conv.assigned_to IS NULL AND conv.status = 'OPEN'
ORDER BY conv.created_at ASC;

-- 10. Relatório de uso por plano
SELECT 
    p.name AS plan_name,
    COUNT(DISTINCT c.id) AS total_companies,
    SUM(p.price) AS monthly_revenue,
    AVG(user_count.users) AS avg_users_per_company
FROM plans p
LEFT JOIN companies c ON p.id = c.plan_id AND c.status = 'ACTIVE'
LEFT JOIN (
    SELECT company_id, COUNT(*) AS users
    FROM users
    WHERE is_active = TRUE
    GROUP BY company_id
) user_count ON c.id = user_count.company_id
GROUP BY p.id, p.name, p.price
ORDER BY monthly_revenue DESC;
